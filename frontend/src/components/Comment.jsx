import React, { useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaReply,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Avatar from "react-avatar";

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
  const { user } = useSelector((store) => store.auth);
  const currentUser = user?.uid;

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
    <div className="flex gap-3">
      <Avatar
        src={comment.photoURL}
        name={comment.username}
        size="40"
        round={true}
        className="flex-shrink-0"
      />
      <div className="flex-1">
        <div className="bg-gray-700/50 p-3 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">{comment.username}</span>
            <span className="text-gray-400 text-xs">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>

          {!editMode ? (
            <p className="mt-1 text-gray-300 whitespace-pre-wrap">
              {comment.text}
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows="2"
                className="w-full p-2 bg-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSubmit}
                  className="bg-green-600 px-3 py-1 text-sm rounded-md font-semibold hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-500 px-3 py-1 text-sm rounded-md font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!editMode && (
          <div className="flex gap-4 mt-2 text-gray-400 text-xs items-center flex-wrap">
            <button
              onClick={() => onLike(comment._id)}
              className="flex items-center gap-1 hover:text-green-400 transition-colors"
            >
              <FaThumbsUp /> {comment.likes || 0}
            </button>
            <button
              onClick={() => onDislike(comment._id)}
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
            >
              <FaThumbsDown /> {comment.dislikes || 0}
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="font-semibold hover:text-white transition-colors flex items-center gap-1"
            >
              <FaReply /> Reply
            </button>
            {comment.userId === currentUser && (
              <>
                <button
                  onClick={() => setEditMode(true)}
                  className="font-semibold hover:text-white transition-colors flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="font-semibold hover:text-white transition-colors flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
          </div>
        )}

        {showReplyInput && (
          <div className="mt-3 flex gap-3">
            <Avatar
              src={user?.photoURL}
              name={user?.displayName}
              size="32"
              round={true}
            />
            <div className="flex-1">
              <textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="1"
                className="w-full p-2 bg-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="bg-gray-500 px-3 py-1 text-xs rounded-md font-semibold hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                  className="bg-blue-600 px-3 py-1 text-xs rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-600"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4 border-l-2 border-gray-700 pl-4">
            {comment.replies.map((reply) => (
              <div key={reply._id} className="flex gap-3">
                {/* highlight-start */}
                <Avatar
                  src={reply.photoURL}
                  name={reply.username}
                  size="32"
                  round={true}
                />
                <div className="flex-1">
                  <div className="bg-gray-700/50 p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {reply.username}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {dayjs(reply.createdAt).fromNow()}
                      </span>
                    </div>

                    {editingReplyId === reply._id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editedReplyText}
                          onChange={(e) => setEditedReplyText(e.target.value)}
                          rows="2"
                          className="w-full p-2 bg-gray-600 rounded-md text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReplySubmit(reply._id)}
                            className="bg-green-600 px-3 py-1 text-xs rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingReplyId(null)}
                            className="bg-gray-500 px-3 py-1 text-xs rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 mt-1 text-sm whitespace-pre-wrap">
                        {reply.text}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <button
                      onClick={() => onLikeReply(reply._id)}
                      className="flex items-center gap-1 hover:text-green-400"
                    >
                      <FaThumbsUp /> {reply.likes || 0}
                    </button>
                    <button
                      onClick={() => onDislikeReply(reply._id)}
                      className="flex items-center gap-1 hover:text-red-400"
                    >
                      <FaThumbsDown /> {reply.dislikes || 0}
                    </button>
                    {reply.userId === currentUser && (
                      <>
                        <button
                          onClick={() => {
                            setEditingReplyId(reply._id);
                            setEditedReplyText(reply.text);
                          }}
                          className="font-semibold hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteReply(reply._id)}
                          className="font-semibold hover:text-white"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
