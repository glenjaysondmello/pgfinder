// backend/routes/chat.js
const express = require("express");
const { generateAIResponse } = require("../chatbot/groqBot");
const PG = require("../models/PgRoom");

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const pgList = await PG.find(); // Get all PGs from MongoDB
    const reply = await generateAIResponse(message, pgList);
    res.json({ reply });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    res.status(500).json({ error: "Failed to generate reply" });
  }
});

module.exports = router;
