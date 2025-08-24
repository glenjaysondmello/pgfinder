const { generateAIResponse } = require("../chatbot/groqBot");
const ChatModel = require("../models/ChatMessage");
const { searchPGsVector } = require("../chatbot/qdrantClient");
const redisClient = require("../client/redisClient");

const CACHE_TTL = 900;

const handleChat = async (req, res) => {
  const userId = req.user.uid;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const releventPGs = await searchPGsVector(message, 5);
    const reply = await generateAIResponse(message, releventPGs);

    let chat = await ChatModel.findOne({ userId });

    if (!chat) {
      chat = new ChatModel({
        userId,
        messages: [
          { type: "user", content: message },
          { type: "bot", content: reply },
        ],
      });

      await chat.save();

      await redisClient.setEx(
        `chats:${userId}`,
        CACHE_TTL,
        JSON.stringify(chat.messages)
      );
    } else {
      chat.messages.push({ type: "user", content: message });
      chat.messages.push({ type: "bot", content: reply });

      await chat.save();

      await redisClient.setEx(
        `chats:${userId}`,
        CACHE_TTL,
        JSON.stringify(chat.messages)
      );
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
};

const getUserChat = async (req, res) => {
  const userId = req.user.uid;
  const cacheKey = `chats:${userId}`;

  try {
    const cachedChats = await redisClient.get(cacheKey);

    if (cachedChats) {
      return res.json({ messages: JSON.parse(cachedChats) });
    }

    const chat = await ChatModel.findOne({ userId });
    const messages = chat?.messages || [];

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(messages));

    res.json({ messages });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

module.exports = { handleChat, getUserChat };
