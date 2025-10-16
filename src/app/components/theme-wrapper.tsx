"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-white text-gray-900 light-scrollbar' 
        : 'bg-[#0a0a0a] text-[#ededed] dark-scrollbar'
    }`}>
      {children}
    </div>
  );
}
