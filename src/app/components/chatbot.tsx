"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaSpinner, FaTrash, FaRobot, FaUser } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import chatService from "../services/chatService";

interface ChatMessage {
  id?: string;
  message: string;
  timestamp?: number;
  isLoading?: boolean;
  error?: string;
  sender?: 'user' | 'bot';
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const history = chatService.loadHistory();
      setMessages(history);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      chatService.saveHistory(messages);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputValue,
      timestamp: Date.now(),
      sender: 'user', // Explicitly mark as user message
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError("");

    try {
      // Send to backend
      const response = await chatService.sendMessage(inputValue);

      // Add bot response
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        timestamp: Date.now(),
        sender: 'bot', // Explicitly mark as bot message
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      // Log the actual error for debugging but show generic message to user
      console.error("Chat error:", err);
      
      const genericErrorMessage = "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer dans quelques instants.";

      // Add generic error message to chat
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: genericErrorMessage,
        error: genericErrorMessage,
        timestamp: Date.now(),
        sender: 'bot', // Explicitly mark as bot error
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      chatService.clearHistory();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] flex flex-col ${
      theme === 'light' ? 'shadow-2xl' : 'shadow-2xl shadow-[#fe8002]/20'
    } rounded-2xl border-2 border-[#fe8002] overflow-hidden w-[90vw] sm:w-96 max-w-md h-[70vh] sm:h-[600px] max-h-[600px] transform transition-all duration-300`}
    style={{
      background: theme === 'light' 
        ? 'white' 
        : 'linear-gradient(135deg, #1a1a1a 0%, #181818 50%, #0f0f0f 100%)',
    }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRobot className="text-white text-2xl" />
          <div>
            <h3 className="text-white font-bold text-lg">PCPrime Assistant</h3>
            <p className="text-white/80 text-xs">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-white/80 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        theme === 'light' ? 'bg-gray-50' : 'bg-[#0f0f0f]/50'
      }`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <FaRobot className={`text-5xl ${
              theme === 'light' ? 'text-gray-300' : 'text-[#fe8002]/30'
            }`} />
            <p className={`text-center text-sm ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              👋 Hi! I'm here to help with product recommendations, orders, and more. What can I help you with?
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={msg.id || index} className={`flex ${msg.error ? 'justify-center' : 'gap-3'}`}>
                {/* User Message */}
                {msg.sender === 'user' && !msg.error && (
                  <div className="flex justify-end w-full">
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      theme === 'light'
                        ? 'bg-[#fe8002] text-white'
                        : 'bg-[#fe8002] text-white'
                    }`}>
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp || 0).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bot Message */}
                {msg.sender === 'bot' && !msg.error && (
                  <div className="flex gap-3 w-full">
                    <FaRobot className={`text-lg mt-1 flex-shrink-0 ${
                      theme === 'light' ? 'text-[#fe8002]' : 'text-[#fe8002]'
                    }`} />
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                      theme === 'light'
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-[#2a2a2a] text-white'
                    }`}>
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp || 0).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {msg.error && (
                  <div className={`w-full px-3 py-2 rounded-lg text-center text-xs ${
                    theme === 'light'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    ⚠️ {msg.error}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <FaRobot className={`text-lg mt-1 flex-shrink-0 ${
                  theme === 'light' ? 'text-[#fe8002]' : 'text-[#fe8002]'
                }`} />
                <div className={`px-4 py-3 rounded-2xl ${
                  theme === 'light'
                    ? 'bg-gray-200'
                    : 'bg-[#2a2a2a]'
                }`}>
                  <FaSpinner className="animate-spin text-[#fe8002]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className={`border-t ${
        theme === 'light' ? 'border-gray-200 bg-white' : 'border-[#2a2a2a] bg-[#1a1a1a]'
      } p-3`}>
        {error && (
          <div className={`text-xs mb-2 px-2 py-1 rounded ${
            theme === 'light'
              ? 'bg-red-100 text-red-600'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-full outline-none text-sm transition-all ${
              theme === 'light'
                ? 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50 focus:ring-2 focus:ring-[#fe8002]'
                : 'bg-[#2a2a2a] text-white placeholder-gray-500 focus:bg-[#3a3a3a] focus:ring-2 focus:ring-[#fe8002]'
            } disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
            } text-white`}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className={`p-2 rounded-full transition-all flex-shrink-0 ${
                theme === 'light'
                  ? 'hover:bg-gray-200 text-gray-600'
                  : 'hover:bg-[#2a2a2a] text-gray-400'
              }`}
              title="Clear chat history"
            >
              <FaTrash className="text-sm" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
