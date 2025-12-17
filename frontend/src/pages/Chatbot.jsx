import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaPaperPlane, FaTrash } from "react-icons/fa";
import Avatar from "react-avatar";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../animations/Loader";

const PageLayout = ({ children }) => (
  <div className="bg-gray-900 min-h-screen flex flex-col">
    <Sidebar />
    <header className="fixed top-0 left-0 w-full z-40">
      <Navbar />
    </header>
    <main className="flex-1 pt-24 sm:pt-28 pb-4 px-4 flex">{children}</main>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-end gap-2">
    <img
      src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
      alt="bot"
      className="w-8 h-8 rounded-full"
    />
    <div className="bg-gray-700 text-gray-200 rounded-r-xl rounded-t-xl p-3 flex items-center space-x-2">
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
    </div>
  </div>
);

const Chatbot = () => {
  // Your original logic and state are preserved.
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await axios.get(`${backendUrl}/api/bot/chat/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        if (res.data.messages.length > 0) {
          setMessages(res.data.messages);
        } else {
          setMessages([
            {
              type: "bot",
              content:
                "Hello! I'm the PG Finder Bot. How can I help you find a PG today? You can ask me about locations, prices, or amenities.",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch chat history", err);
        setMessages([
          {
            type: "bot",
            content: "Welcome! I'm ready to help you find the perfect PG.",
          },
        ]);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchChatHistory();
  }, [backendUrl]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError("");
    const userMessage = { type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/bot/chat`,
        { message: input },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      const botMessage = { type: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        type: "bot",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleClearHistory = async () => {
  //   if (
  //     !window.confirm(
  //       "Are you sure you want to delete your chat history? This cannot be undone."
  //     )
  //   )
  //     return;
  //   try {
  //     await axios.delete(`${backendUrl}/api/bot/chat/history`, {
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //       withCredentials: true,
  //     });
  //     setMessages([
  //       {
  //         type: "bot",
  //         content: "Chat history cleared. How can I help you today?",
  //       },
  //     ]);
  //     toast.success("Chat history cleared!");
  //   } catch (err) {
  //     toast.error("Failed to clear chat history.");
  //     console.error("Clear History Error:", err);
  //   }
  // };

  const renderChatContent = () => {
    if (loadingHistory) {
      return (
        <div className="flex-1 flex justify-center items-center">
          <Loader />
        </div>
      );
    }
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.type === "bot" && (
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
                alt="bot"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`max-w-[75%] rounded-lg p-3 text-white ${
                message.type === "user"
                  ? "bg-blue-600 rounded-b-xl rounded-tl-xl"
                  : "bg-gray-700 rounded-b-xl rounded-tr-xl"
              }`}
            >
              {message.content.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {/* Display user avatar for user messages */}
            {message.type === "user" && (
              <Avatar
                src={user?.photoURL}
                name={user?.displayName}
                size="32"
                round={true}
              />
            )}
          </div>
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="max-w-4xl w-full mx-auto h-full flex flex-col bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white text-center flex-1">
            Chat with PG Bot
          </h1>
        </div>

        {renderChatContent()}

        <div className="p-4 bg-gray-900/50 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="Ask me anything about PGs..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading || loadingHistory}
              className="flex-1 min-w-0 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || loadingHistory || !input.trim()}
              aria-label="Send message"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPaperPlane />
            </button>
          </form>
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
      </div>
    </PageLayout>
  );
};

export default Chatbot;
