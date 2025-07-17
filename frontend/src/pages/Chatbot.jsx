import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Input cannot be Empty");
      return;
    }
    setError("");

    const userMessage = { type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: input,
      });
      const botMessage = { type: "bot", content: res.data.message };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while processing your request."
      );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-4 md:p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Chat with PG Bot
          </h1>

          <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden h-[calc(100vh-300px)]">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-gray-750">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Send
                  </button>
                </form>
                {error && (
                  <div className="mt-2 text-red-500 text-sm">{error}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
