// backend/routes/chat.js
const express = require("express");
const { handleChat, getUserChat } = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/chat", verifyToken, handleChat);
router.get("/chat/history", verifyToken, getUserChat);

module.exports = router;
