const OpenAI = require('openai');
require('dotenv').config();
const {Pool} = require('pg')

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm',
  port: 5432,
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  organization: process.env.OPENAI_ORG_ID || undefined,
  project: process.env.OPENAI_PROJECT_ID || undefined,
});

// const isItem = async function(item) {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are an expert in item classification and whether they are real or not." },
//         { 
//           role: "user", 
//           content: `Please verify if the item the user submitted is an actual item or not. If the item is a real item, return it as 1. If the item is not a real item, return it as 2.` 
//         }
//       ],
//       max_tokens: 100, // Adjust max_tokens as necessary
//     });

//     // Log the full response for debugging purposes
//     console.log('OpenAI API Response:', response);

//     // Assuming response.choices is an array with one choice
//     const responseText = response.choices[0].message.content.trim().toLowerCase();

//     // Check the response and determine if the item is valid
//     if (responseText.includes('1')) {
//       return true;
//     } else if (responseText.includes('2')) {
//       return false;
//     } else {
//       // Handle unexpected responses
//       console.error('Unexpected response from OpenAI:', responseText);
//       throw new Error('Unexpected response from OpenAI');
//     }
//   } catch (error) {
//     console.error('Error calling OpenAI API:', error);
//     throw error;
//   }
// };


 //Function to classify items into categories
const categorizeItem = async function (item) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", //Openai model
      messages: [
        { role: "system", content: "You are an expert in item classification." },
        { 
          role: "user", 
          content: `Please classify the following item as 'restaurant', 'book', 'movie', or 'none'. If an item is neither a restaurant, book, nor movie, it will be placed in 'none'.
                    Respond with only 'restaurant', 'book', 'movie', or 'none'.
                    Item: ${item}` 
        }
      ],
      max_tokens: 10,
    });

    const classification = response.choices[0].message.content.trim();

    let categoryId;
    switch (classification.toLowerCase()) { 
      case 'restaurant':
        categoryId = 2;
        break;
      case 'book':
        categoryId = 3;
        break;
      case 'movie':
        categoryId = 1;
        break;
      case 'none':
      default:
        categoryId = 4;
        break;
    }

    return categoryId;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// Function to insert item and its category into the database
const itemIntoDatabase = async function (user_id, title, category_id) {
  try {
    const res = await pool.query(
      `INSERT INTO items(user_id, title, is_complete, category_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, title, false, category_id]
    );
    return res.rows[0];
  } catch (err) {
    console.error('Error inserting item into database', err);
    throw err;
  }
};

(async () => {
  try {
    const item = 'Lord of the Rings'; 

    const isRealItem = await isItem(item);
    console.log(`Is '${item}' a real item?`, isRealItem);
  } catch (error) {
    console.error('Error:', error);
  }
})();


module.exports = {
  categorizeItem,
  itemIntoDatabase
}
