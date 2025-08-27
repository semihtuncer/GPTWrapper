const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTextResponse = async (inputText) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant helping users. User will give you the description of what they want, you will help them. Response should be in a paragraph format, avoid using any markdown symbols",
      },
      {
        role: "user",
        content: `${inputText}`,
      },
    ],
  });
  return completion.choices[0].message.content;
};
const generateTitle = async (inputText) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: [
      {
        role: "system",
        content:
          "User will provide you a text and you will generate a title from it. Response should be in a text format with max characters of 25, avoid using any markdown symbols",
      },
      {
        role: "user",
        content: `${inputText}`,
      },
    ],
  });
  return completion.choices[0].message.content;
};

module.exports = { generateTextResponse, generateTitle };
