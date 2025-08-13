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
import { FaPaperPlane } from "react-icons/fa";
import Avatar from "react-avatar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(`${backendUrl}`);
// const socket = io("http://localhost:5000");

const CommentSkeleton = () => (
  <div className="flex gap-3 my-6 animate-pulse">
    <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0"></div>
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
    </div>
  </div>
);

const CommentSection = ({ pgId }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector((store) => store.comments);
  const { user } = useSelector((store) => store.auth); // Get current user for avatar
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    dispatch(fetchComments(pgId));
  }, [dispatch, pgId]);

  useEffect(() => {
    const handleUpdate = () => dispatch(fetchComments(pgId));
    const events = [
      "new-comment",
      "reply-added",
      "like-update",
      "dislike-update",
      "edit-comment",
      "delete-comment",
      "like-reply",
      "dislike-reply",
      "edit-reply",
      "delete-reply",
    ];
    events.forEach((event) => socket.on(event, handleUpdate));

    return () => {
      events.forEach((event) => socket.off(event, handleUpdate));
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
    <div className="bg-gray-800 rounded-2xl p-6 mt-8 text-white shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Discussion & Reviews</h2>

      {user && (
        <div className="flex gap-4 mb-8">
          <Avatar
            src={user?.photoURL}
            name={user?.displayName}
            size="40"
            round={true}
            className="flex-shrink-0 mt-1"
          />
          <div className="flex-1">
            <textarea
              rows="2"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 text-white transition duration-200"
            />
            <button
              onClick={handlePostComment}
              disabled={!newComment.trim()}
              className="mt-2 flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <FaPaperPlane /> Post Comment
            </button>
          </div>
        </div>
      )}

      {status === "loading" && (
        <>
          <CommentSkeleton />
          <CommentSkeleton />
        </>
      )}
      {status === "failed" && (
        <p className="text-red-400 bg-red-500/10 p-3 rounded-md">{error}</p>
      )}

      <div className="space-y-6">
        {status === "succeeded" &&
          comments.map((c, index) => (
            <div
              key={c._id}
              className={index > 0 ? "border-t border-gray-700 pt-6" : ""}
            >
              <Comment
                comment={c}
                onLike={() => dispatch(likeComment(c._id))}
                onDislike={() => dispatch(dislikeComment(c._id))}
                onReply={(id, text) =>
                  dispatch(replyToComment({ commentId: id, text }))
                }
                onEdit={(id, text) =>
                  dispatch(editComment({ commentId: id, text }))
                }
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
            </div>
          ))}
        {status === "succeeded" && comments.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            Be the first to leave a comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
