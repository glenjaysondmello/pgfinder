import React, { useState } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";

dayjs.extend(relativeTime);

const Comment = ({ comment, onLike, onDislike, onReply, onEdit, onDelete }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const { currentUser } = useSelector((store) => store.auth);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReply(false);
    }
  };

  const handleEditSubmit = () => {
    if (editedText.trim()) {
      onEdit(comment._id, editedText);
      setEditMode(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-3">
      <div className="flex justify-between">
        <span className="font-semibold">{comment.username}</span>
        <span className="text-gray-400 text-sm">
          {dayjs(comment.createdAt).fromNow()}
        </span>
      </div>
      {!editMode ? (
        <p className="mt-2 text-gray-300">{comment.text}</p>
      ) : (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleEditSubmit}
            className="bg-green-600 px-2 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-600 px-2 rounded"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="flex gap-4 mt-3 text-gray-400 text-sm">
        <button
          onClick={() => onLike(comment._id)}
          className="hover:text-blue-400"
        >
          <FaThumbsUp /> {comment.likes}
        </button>
        <button
          onClick={() => onDislike(comment._id)}
          className="hover:text-red-400"
        >
          <FaThumbsDown /> {comment.dislikes}
        </button>
        <button
          onClick={() => setShowReply(!showReply)}
          className="hover:text-green-400"
        >
          <FaReply /> Reply
        </button>
        {comment?.userId === currentUser && (
          <>
            <button
              onClick={() => setEditMode(true)}
              className="hover:text-yellow-400 flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(comment._id)}
              className="hover:text-pink-400 flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </>
        )}
      </div>

      {showReply && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-gray-700 text-white"
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-600 px-3 rounded"
          >
            Post
          </button>
        </div>
      )}

      {showReply && comment.replies.length > 0 && (
        <div className="mt-3 ml-6 space-y-2 border-l border-gray-600 pl-3">
          {comment.replies.map((reply, i) => (
            <div key={i} className="bg-gray-700 p-2 rounded">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{reply.username}</span>
                <span className="text-gray-400">
                  {dayjs(reply.createdAt).fromNow()}
                </span>
              </div>
              <p className="text-gray-300">{reply.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
