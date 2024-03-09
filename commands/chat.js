require('dotenv').config()
const {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
module.exports = async (message, client, args) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  await mongoClient.connect();

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];


    const chat = model.startChat({
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(args.join(' '));
    const response = result.response;
    const text = response.text();

    if (text) {
      await client.send({ message: text });
    } else {
      await client.send({ message: 'Error: Model failed to generate text.' });
    }
};