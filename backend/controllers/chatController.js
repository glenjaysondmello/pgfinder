const { generateAIResponse } = require("../chatbot/groqBot");
const PG = require("../models/PgRoom");
const ChatModel = require("../models/ChatMessage");

const handleChat = async (req, res) => {
  const userId = req.user.uid;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const pgList = await PG.find();
    const reply = await generateAIResponse(message, pgList);

    const chat = await ChatModel.findOne({ userId });

    if (!chat) {
      chat = new ChatModel({
        userId,
        messages: [
          { type: "user", content: message },
          { type: "bot", content: reply },
        ],
      });

      await chat.save();
    } else {
      chat.messages.push({ type: "user", content: message });
      chat.messages.push({ type: "bot", content: reply });

      await chat.save();
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
};

const getUserChat = async (req, res) => {
  const userId = req.user.uid;

  try {
    const chat = await ChatModel.findOne({ userId });
    const messages = chat?.messages || [];

    res.json({ messages: messages });
  } catch (error) {
    console.error("Get chat error:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

module.exports = { handleChat, getUserChat };
