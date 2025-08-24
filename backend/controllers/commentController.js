const Comment = require("../models/Comment");
const redisClient = require("../client/redisClient");

const CACHE_TTL = 60;

let io;
const initSocket = (_io) => (io = _io);

const broadcast = (event, data) => {
  if (io) io.emit(event, data);
};

const getComments = async (req, res) => {
  const { pgId } = req.params;
  const cacheKey = `comments:${pgId}`;

  try {
    const cachedComments = await redisClient.get(cacheKey);

    if (cachedComments) {
      return res.status(200).json(JSON.parse(cachedComments));
    }

    const comments = await Comment.find({ pgId }).sort({
      createdAt: -1,
    });

    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(comments));

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

    await redisClient.del(`comments:${pgId}`);

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

    await redisClient.del(`comments:${comment.pgId}`);

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

    // if (alreadyDisliked) {
    //   comment.dislikes -= 1;
    //   comment.dislikedBy = comment.dislikedBy.filter((id) => id !== userId);
    // }

    // comment.likes += 1;
    // comment.likedBy.push(userId);

    // const updated = await comment.save();

    const updated = {
      $inc: { likes: 1 },
      $addToSet: { likedBy: userId },
    };

    if (alreadyDisliked) {
      updated.$inc.dislikes = -1;
      updated.$pull = { dislikedBy: userId };
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updated, {
      new: true,
    });

    await redisClient.del(`comments:${comment.pgId}`);

    broadcast("like-update", updatedComment);
    res.status(200).json(updatedComment);
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

    // if (alreadyliked) {
    //   comment.likes -= 1;
    //   comment.likedBy = comment.likedBy.filter((id) => id !== userId);
    // }

    // comment.dislikes += 1;
    // comment.dislikedBy.push(userId);

    // const updated = await comment.save();

    const updated = {
      $inc: { dislikes: 1 },
      $addToSet: { dislikedBy: userId },
    };

    if (alreadyliked) {
      updated.$inc.likes = -1;
      updated.$pull = { likedBy: userId };
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, updated, {
      new: true,
    });

    await redisClient.del(`comments:${comment.pgId}`);

    broadcast("dislike-update", updatedComment);
    res.status(200).json(updatedComment);
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

    await redisClient.del(`comments:${comment.pgId}`);

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

    await redisClient.del(`comments:${comment.pgId}`);

    broadcast("delete-comment", commentId);
    res.status(200).json(commentId);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

const likeReply = async (req, res) => {
  const userId = req.user.uid;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findOne(
      { _id: commentId, "replies._id": replyId },
      { "replies.$": 1 }
    );

    if (!comment || !comment.replies.length) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const reply = comment.replies[0];

    if (reply.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You already liked this reply" });
    }

    const update = {
      $inc: { "replies.$.likes": 1 },
      $addToSet: { "replies.$.likedBy": userId },
    };

    if (reply.dislikedBy.includes(userId)) {
      update.$inc["replies.$.dislikes"] = -1;
      update.$pull = { "replies.$.dislikedBy": userId };
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      update,
      { new: true }
    );

    await redisClient.del(`comments:${updatedComment.pgId}`);

    broadcast("like-reply", updatedComment);
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

const dislikeReply = async (req, res) => {
  const userId = req.user.uid;
  const { commentId, replyId } = req.params;

  try {
    const comment = await Comment.findOne(
      { _id: commentId, "replies._id": replyId },
      { "replies.$": 1 }
    );

    if (!comment || !comment.replies.length) {
      return res.status(404).json({ message: "Reply not found" });
    }

    const reply = comment.replies[0];

    if (reply.dislikedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already disliked this reply" });
    }

    const update = {
      $inc: { "replies.$.dislikes": 1 },
      $addToSet: { "replies.$.dislikedBy": userId },
    };

    if (reply.likedBy.includes(userId)) {
      update.$inc["replies.$.likes"] = -1;
      update.$pull = { "replies.$.likedBy": userId };
    }

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, "replies._id": replyId },
      update,
      { new: true }
    );

    await redisClient.del(`comments:${updatedComment.pgId}`);

    broadcast("dislike-reply", updatedComment);
    res.status(200).json(updatedComment);
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

    await redisClient.del(`comments:${comment.pgId}`);

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

    await redisClient.del(`comments:${comment.pgId}`);

    broadcast("delete-reply", commentId);
    res.status(200).json({ commentId, replyId });
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

// const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     const reply = comment.replies.id(replyId);
//     if (!reply) return res.status(404).json({ message: "Reply not found" });

//     if (reply.likedBy.includes(userId))
//       return res.status(400).json({ message: "You already liked" });

//     const alreadyDisliked = reply.dislikedBy.includes(userId);

//     // if (alreadyDisliked) {
//     //   reply.dislikes -= 1;
//     //   reply.dislikedBy = reply.dislikedBy.filter((id) => id !== userId);
//     // }

//     // reply.likes += 1;
//     // reply.likedBy.push(userId);

//     // const updated = await comment.save();

//     const updatedReply = await Comment.findByIdAndUpdate(
//       replyId,
//       {
//         $inc: { likes: 1 },
//         $addToSet: { likedBy: userId },
//         $pull: { dislikedBy: userId },
//       },
//       { new: true }
//     );

//     if (alreadyDisliked) {
//       updatedReply.dislikes = Math.max(0, updatedReply.dislikes - 1);
//       await updatedComment.save();
//     }

//     await redisClient.del(`comments:${comment.pgId}`);

//     broadcast("like-reply", updatedComment);
//     res.status(200).json(updatedComment);

// ----------------------------------------

// const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     const reply = comment.replies.id(replyId);
//     if (!reply) return res.status(404).json({ message: "Reply not found" });

//     if (reply.dislikedBy.includes(userId))
//       return res.status(400).json({ message: "You already disliked" });

//     const alreadyliked = reply.likedBy.includes(userId);

//     // if (alreadyliked) {
//     //   reply.likes -= 1;
//     //   reply.likedBy = reply.likedBy.filter((id) => id !== userId);
//     // }

//     // reply.dislikes += 1;
//     // reply.dislikedBy.push(userId);

//     // const updated = await comment.save();

//     const updatedReply = await Comment.findByIdAndUpdate(
//       replyId,
//       {
//         $inc: { dislikes: 1 },
//         $addToSet: { dislikedBy: userId },
//         $pull: { likedBy: userId },
//       },
//       { new: true }
//     );

//     if (alreadyliked) {
//       updatedReply.likes = Math.max(0, updatedReply.likes - 1);
//       await updatedComment.save();
//     }const comment = await Comment.findById(commentId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     const reply = comment.replies.id(replyId);
//     if (!reply) return res.status(404).json({ message: "Reply not found" });

//     if (reply.dislikedBy.includes(userId))
//       return res.status(400).json({ message: "You already disliked" });

//     const alreadyliked = reply.likedBy.includes(userId);

//     // if (alreadyliked) {
//     //   reply.likes -= 1;
//     //   reply.likedBy = reply.likedBy.filter((id) => id !== userId);
//     // }

//     // reply.dislikes += 1;
//     // reply.dislikedBy.push(userId);

//     // const updated = await comment.save();

//     const updatedReply = await Comment.findByIdAndUpdate(
//       replyId,
//       {
//         $inc: { dislikes: 1 },
//         $addToSet: { dislikedBy: userId },
//         $pull: { likedBy: userId },
//       },
//       { new: true }
//     );

//     if (alreadyliked) {
//       updatedReply.likes = Math.max(0, updatedReply.likes - 1);
//       await updatedComment.save();
//     }
