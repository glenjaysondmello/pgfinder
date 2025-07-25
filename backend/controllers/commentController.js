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

const postComment = async (req, res) => {
  const userId = req.user.uid;
  const username = req.user.name;
  const { text } = req.body;
  const pgId = req.params.pgId;

  try {
    const newComment = await Comment.create({
      pgId,
      userId,
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
  const userId = req.user.uid;
  const username = req.user.name;
  const { text } = req.body;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ userId, username, text });
    const updated = await comment.save();

    broadcast("reply-added", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to add reply" });
  }
};

const likeComment = async (req, res) => {
  const userId = req.user.uid;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likedBy.includes(userId))
      return res.status(400).json({ message: "You already liked" });

    const alreadyDisliked = comment.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      comment.dislikes -= 1;
      comment.dislikedBy = comment.dislikedBy.filter((id) => id !== userId);
    }

    comment.likes += 1;
    comment.likedBy.push(userId);

    const updated = await comment.save();

    broadcast("like-update", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

const dislikeComment = async (req, res) => {
  const userId = req.user.uid;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.dislikedBy.includes(userId))
      return res.status(400).json({ message: "You already disliked" });

    const alreadyliked = comment.likedBy.includes(userId);

    if (alreadyliked) {
      comment.likes -= 1;
      comment.likedBy = comment.likedBy.filter((id) => id !== userId);
    }

    comment.dislikes += 1;
    comment.dislikedBy.push(userId);

    const updated = await comment.save();

    broadcast("dislike-update", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};

const editComment = async (req, res) => {
  const userId = req.user.uid;
  const { text } = req.body;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    comment.text = text;
    const updated = await comment.save();

    broadcast("edit-comment", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment" });
  }
};

const deleteComment = async (req, res) => {
  const userId = req.user.uid;
  const commentId = req.params.commentId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();

    broadcast("delete-comment", commentId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

const likeReply = async (req, res) => {
  const userId = req.user.uid;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.likedBy.includes(userId))
      return res.status(400).json({ message: "You already liked" });

    const alreadyDisliked = reply.dislikedBy.includes(userId);

    if (alreadyDisliked) {
      reply.dislikes -= 1;
      reply.dislikedBy = reply.dislikedBy.filter((id) => id !== userId);
    }

    reply.likes += 1;
    reply.likedBy.push(userId);

    const updated = await comment.save();

    broadcast("like-reply", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

const dislikeReply = async (req, res) => {
  const userId = req.user.uid;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.dislikedBy.includes(userId))
      return res.status(400).json({ message: "You already disliked" });

    const alreadyliked = reply.likedBy.includes(userId);

    if (alreadyliked) {
      reply.likes -= 1;
      reply.likedBy = reply.likedBy.filter((id) => id !== userId);
    }

    reply.dislikes += 1;
    reply.dislikedBy.push(userId);

    const updated = await comment.save();

    broadcast("dislike-reply", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike comment" });
  }
};

const editReply = async (req, res) => {
  const userId = req.user.uid;
  const { text } = req.body;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    reply.text = text;
    const updated = await comment.save();

    broadcast("edit-reply", updated);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment" });
  }
};

const deleteReply = async (req, res) => {
  const userId = req.user.uid;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.userId !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    comment.replies = comment.replies.filter(
      (r) => r._id.toString() !== replyId
    );

    // reply.remove();
    await comment.save();

    broadcast("delete-reply", commentId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = {
  initSocket,
  getComments,
  postComment,
  replyToComment,
  likeComment,
  dislikeComment,
  editComment,
  deleteComment,
  likeReply,
  dislikeReply,
  editReply,
  deleteReply,
};
