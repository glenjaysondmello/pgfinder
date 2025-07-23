const Comment = require("../models/Comment");

let io;
const initSocket = (_io) => (io = _io);

const broadcast = (event, data) => {
  if (io) io.emit(event, data);
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ pgId: req.params.pgId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

const postComments = async (req, res) => {
  const { username, text } = req.body;
  const pgId = req.params.pgId;

  try {
    const newComment = await Comment.create({
      pgId,
      username,
      text,
    });

    broadcast("new-comment", newComment);

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to post comment" });
  }
};

const replyToComment = async (req, res) => {
  const { username, text } = req.body;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ username, text });
    const updated = await comment.save();

    broadcast("reply-added", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply" });
  }
};

const likeComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    broadcast("like-update", comment);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

const dislikeComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    broadcast("dislike-update", comment);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};

const editComment = async (req, res) => {
  const { text } = req.body;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );

    broadcast("edit-comment", comment);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment" });
  }
};

const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    await Comment.findByIdAndDelete(commentId);
    broadcast("delete-comment", commentId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = {
  initSocket,
  getComments,
  postComments,
  replyToComment,
  likeComment,
  dislikeComment,
  editComment,
  deleteComment,
};
