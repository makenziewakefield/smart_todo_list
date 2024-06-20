const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  organization: process.env.OPENAI_ORG_ID || undefined,
  project: process.env.OPENAI_PROJECT_ID || undefined,
});

