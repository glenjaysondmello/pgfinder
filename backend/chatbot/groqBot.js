const axios = require("axios");

const generateAIResponse = async (userMsg, pgData) => {
  const formattedPGs = pgData.join("\n");

  const messages = [
    {
      role: "system",
      content: `You are a helpful and knowledgeable Paying Guest (PG) Assistant. Use the following PG listings to answer user queries accurately:\n\n${formattedPGs}`,
    },
    {
      role: "user",
      content: userMsg,
    },
  ];

  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Groq API error:", error.response?.data || error.message);
    return "Sorry, I couldn't process your request right now. Please try again later.";
  }
};

module.exports = { generateAIResponse };
