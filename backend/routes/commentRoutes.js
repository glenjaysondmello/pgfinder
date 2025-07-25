const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/commentController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/:pgId", verifyToken, getComments);
router.post("/:pgId", verifyToken, postComment);
router.post("/:commentId/reply", verifyToken, replyToComment);
router.patch("/:commentId/like", verifyToken, likeComment);
router.patch("/:commentId/dislike", verifyToken, dislikeComment);
router.patch("/:commentId/edit", verifyToken, editComment);
router.delete("/:commentId", verifyToken, deleteComment);
router.patch("/:commentId/reply/:replyId/like", verifyToken, likeReply);
router.patch("/:commentId/reply/:replyId/dislike", verifyToken, dislikeReply);
router.patch("/:commentId/reply/:replyId/edit", verifyToken, editReply);
router.delete("/:commentId/reply/:replyId", verifyToken, deleteReply);

module.exports = router;
