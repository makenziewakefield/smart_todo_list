const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  organization: process.env.OPENAI_ORG_ID || undefined,
  project: process.env.OPENAI_PROJECT_ID || undefined,
});

// Function to classify items as 'book' or 'not a book'
const categorizeBooks = async function (item) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert in item classification." },
        { 
          role: "user", 
          content: `Please classify the following item as 'book' or 'not a book'. 
                    Respond with only 'book' or 'not a book'.
                    Item: ${item}` 
        }
      ],
      max_tokens: 10,
    });

    const classification = response.choices[0].message.content.trim();

    return classification.toLowerCase() === 'book';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// IIFE to run the async function immediately
(async () => {
  const book = 'A Song of Ice and Fire'; 
  const result = await categorizeBooks(book);
  console.log(`The item '${book}' is classified as: ${result ? 'book' : 'not a book'}`);
})();
