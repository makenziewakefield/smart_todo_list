const OpenAI = require('openai');
require('dotenv').config();

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  organization: process.env.OPENAI_ORG_ID || undefined,
  project: process.env.OPENAI_PROJECT_ID || undefined,
});

// Function to classify items into categories
const categorizeItem = async function (item) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    return classification;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// IIFE to run the async function immediately
(async () => {
  const item = 'Toilet'; 
  const result = await categorizeItem(item);
  console.log(`The item '${item}' is classified as: ${result}`);
})();
