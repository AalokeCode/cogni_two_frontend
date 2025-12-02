"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/elements/loader";
import { mentorAPI } from "@/utils/api";
import { Send, Bot, UserIcon, Trash2, Sparkles } from "lucide-react";

function MentorChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setLoading(true);

    try {
      const response = await mentorAPI.chat({
        message: userMessage,
        conversationId,
      });

      setConversationId(response.data.conversationId);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.message,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
  };

  if (!user) {
    return <Loader />;
  }

  return (
    <Sidebar>
      <div className="flex flex-col h-screen">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 pt-16">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-teal-400/10 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-50 mb-2">
                Welcome to Cogni AI
              </h2>
              <p className="text-zinc-400 max-w-md mb-8">
                Your personal learning assistant. Ask questions about any topic,
                get explanations, or discuss concepts from your curricula.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                {[
                  "Explain machine learning in simple terms",
                  "What are the best practices for React?",
                  "Help me understand recursion",
                  "Quiz me on JavaScript basics",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm text-left hover:border-zinc-700 hover:text-zinc-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-teal-400/20 text-teal-400"
                        : message.isError
                        ? "bg-rose-400/20 text-rose-400"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserIcon className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-xl max-w-full ${
                        message.role === "user"
                          ? "bg-teal-400/20 text-zinc-50"
                          : message.isError
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-left">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-zinc-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-900">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Cogni AI anything..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-teal-400 resize-none"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "200px" }}
                disabled={loading}
              />
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-rose-400 hover:border-rose-400/50 transition-colors"
                  title="Clear chat"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-4 py-3 rounded-xl bg-teal-400 text-zinc-950 font-semibold hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-center">
              Cogni AI is free to use. Press Enter to send, Shift+Enter for new
              line.
            </p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default function MentorChat() {
  return (
    <ProtectedRoute>
      <MentorChatPage />
    </ProtectedRoute>
  );
}
