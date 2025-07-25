const express = require("express");
const { chatbot } = require("../controllers/chatbotController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/chatbot", verifyToken, chatbot);

module.exports = router;
