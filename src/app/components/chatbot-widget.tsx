"use client";

import { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Chatbot from "./chatbot";

const ChatbotWidget = () => {
  const { theme } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Chatbot Component */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />

      {/* Floating Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className={`fixed bottom-4 right-4 z-[9998] w-16 h-16 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center font-bold text-white text-2xl ${
            theme === 'light'
              ? 'bg-gradient-to-br from-[#fe8002] to-[#ff4500] shadow-[#fe8002]/40'
              : 'bg-gradient-to-br from-[#fe8002] to-[#ff4500] shadow-[#fe8002]/60'
          }`}
          aria-label="Open chatbot"
        >
          <FaRobot />
        </button>
      )}
    </>
  );
};

export default ChatbotWidget;
