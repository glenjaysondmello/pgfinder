import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
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
} from "../features/comments/commentSlice";
import Comment from "./Comment";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io("http://localhost:5000");

const CommentSection = ({ pgId }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector((store) => store.comments);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    dispatch(fetchComments(pgId));
  }, [dispatch, pgId]);

  useEffect(() => {
    const handleUpdate = () => dispatch(fetchComments(pgId));

    socket.on("new-comment", handleUpdate);
    socket.on("reply-added", handleUpdate);
    socket.on("like-update", handleUpdate);
    socket.on("dislike-update", handleUpdate);
    socket.on("edit-comment", handleUpdate);
    socket.on("delete-comment", handleUpdate);
    socket.on("like-reply", handleUpdate);
    socket.on("dislike-reply", handleUpdate);
    socket.on("edit-reply", handleUpdate);
    socket.on("delete-reply", handleUpdate);

    return () => {
      socket.off("new-comment", handleUpdate);
      socket.off("reply-added", handleUpdate);
      socket.off("like-update", handleUpdate);
      socket.off("dislike-update", handleUpdate);
      socket.off("edit-comment", handleUpdate);
      socket.off("delete-comment", handleUpdate);
      socket.off("like-reply", handleUpdate);
      socket.off("dislike-reply", handleUpdate);
      socket.off("edit-reply", handleUpdate);
      socket.off("delete-reply", handleUpdate);
      socket.disconnect();
    };
  }, [dispatch, pgId]);

  const handlePostComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    dispatch(postComment({ pgId, text: newComment }));
    setNewComment("");
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-8 text-white">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-700"
        />
        <button
          onClick={handlePostComment}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      {status === "loading" && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {comments.map((c) => (
        <Comment
          key={c._id}
          comment={c}
          onLike={() => dispatch(likeComment(c._id))}
          onDislike={() => dispatch(dislikeComment(c._id))}
          onReply={(id, text) =>
            dispatch(replyToComment({ commentId: id, text }))
          }
          onEdit={(id, text) => dispatch(editComment({ commentId: id, text }))}
          onDelete={(id) => dispatch(deleteComment(id))}
          onLikeReply={(replyId) =>
            dispatch(likeReply({ commentId: c._id, replyId }))
          }
          onDislikeReply={(replyId) =>
            dispatch(dislikeReply({ commentId: c._id, replyId }))
          }
          onEditReply={(replyId, text) =>
            dispatch(editReply({ commentId: c._id, replyId, text }))
          }
          onDeleteReply={(replyId) =>
            dispatch(deleteReply({ commentId: c._id, replyId }))
          }
        />
      ))}
    </div>
  );
};

export default CommentSection;
