const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      type: {
        type: String,
        enum: ["user", "bot"],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const ChatModel = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatModel;
