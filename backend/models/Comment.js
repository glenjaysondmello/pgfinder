const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "PG", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    replies: [replySchema],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

models.exports = mongoose.model("Comment", commentSchema);
