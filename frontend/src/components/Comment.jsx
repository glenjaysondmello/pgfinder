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

const Comment = ({
  comment,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  onLikeReply,
  onDislikeReply,
  onEditReply,
  onDeleteReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editedReplyText, setEditedReplyText] = useState("");

  const { currentUser } = useSelector((store) => store.auth);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    }
  };

  const handleEditSubmit = () => {
    if (editedText.trim()) {
      onEdit(comment._id, editedText);
      setEditMode(false);
    }
  };

  const handleEditReplySubmit = (replyId) => {
    if (editedReplyText.trim()) {
      onEditReply(replyId, editedReplyText);
      setEditingReplyId(null);
      setEditedReplyText("");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
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
          <button onClick={handleEditSubmit} className="bg-green-600 px-2 rounded">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="bg-gray-600 px-2 rounded">
            Cancel
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-3 text-gray-400 text-sm items-center flex-wrap">
        <button onClick={() => onLike(comment._id)} className="hover:text-blue-400 flex items-center gap-1">
          <FaThumbsUp /> {comment.likes}
        </button>
        <button onClick={() => onDislike(comment._id)} className="hover:text-red-400 flex items-center gap-1">
          <FaThumbsDown /> {comment.dislikes}
        </button>
        <button onClick={() => setShowReplyInput(!showReplyInput)} className="hover:text-green-400 flex items-center gap-1">
          <FaReply /> Reply
        </button>
        {comment.userId === currentUser && (
          <>
            <button onClick={() => setEditMode(true)} className="hover:text-yellow-400 flex items-center gap-1">
              <FaEdit /> Edit
            </button>
            <button onClick={() => onDelete(comment._id)} className="hover:text-pink-400 flex items-center gap-1">
              <FaTrash /> Delete
            </button>
          </>
        )}
      </div>

      {showReplyInput && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 px-2 py-1 rounded bg-gray-700 text-white"
          />
          <button onClick={handleReplySubmit} className="bg-blue-600 px-3 rounded">
            Post
          </button>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-4 ml-6 space-y-3 border-l border-gray-600 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply._id} className="bg-gray-700 p-3 rounded text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{reply.username}</span>
                <span className="text-gray-400 text-xs">{dayjs(reply.createdAt).fromNow()}</span>
              </div>

              {editingReplyId === reply._id ? (
                <div className="flex mt-2 gap-2">
                  <input
                    type="text"
                    value={editedReplyText}
                    onChange={(e) => setEditedReplyText(e.target.value)}
                    className="flex-1 px-2 py-1 rounded bg-gray-600 text-white"
                  />
                  <button onClick={() => handleEditReplySubmit(reply._id)} className="bg-green-600 px-2 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingReplyId(null)} className="bg-gray-500 px-2 rounded">
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-200 mt-1">{reply.text}</p>
              )}

              <div className="flex gap-3 mt-2 text-xs text-gray-300">
                <button onClick={() => onLikeReply(reply._id)} className="hover:text-blue-400 flex items-center gap-1">
                  <FaThumbsUp /> {reply.likes}
                </button>
                <button onClick={() => onDislikeReply(reply._id)} className="hover:text-red-400 flex items-center gap-1">
                  <FaThumbsDown /> {reply.dislikes}
                </button>

                {reply.userId === currentUser && (
                  <>
                    <button onClick={() => {
                      setEditingReplyId(reply._id);
                      setEditedReplyText(reply.text);
                    }} className="hover:text-yellow-400 flex items-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => onDeleteReply(reply._id)} className="hover:text-pink-400 flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
