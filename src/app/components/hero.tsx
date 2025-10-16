"use client";

import Image from "next/image";
import { useTheme } from "../context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden transition-all duration-300 ${
      theme === 'light'
        ? 'bg-gradient-to-b from-gray-50 to-white'
        : 'bg-gradient-to-b from-[#0a0a0a] to-black'
    }`}>
      <Image
        src={theme === 'light' ? '/white_hero.jpeg' : '/hero.png'}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className={theme === 'light' ? 'opacity-20' : 'opacity-40'}
        priority
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/20 via-transparent to-[#ff4500]/20 animate-pulse" />
      <div className={`absolute inset-0 ${
        theme === 'light'
          ? 'bg-gradient-to-t from-white via-white/50 to-transparent'
          : 'bg-gradient-to-t from-black via-black/50 to-transparent'
      }`} />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <div className="mb-8">
          <h1 className={`text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent mb-4 ${
            theme === 'light' ? 'drop-shadow-sm' : ''
          }`}>
            Prime Computer
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#fe8002] to-transparent mx-auto" />
        </div>
        
        <p className={`text-lg md:text-2xl font-bold mb-4 max-w-2xl ${
          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
        }`}>
          Découvrez la <span className="text-[#fe8002]">puissance</span>, la fiabilité et le style
        </p>
        <p className={`text-md md:text-xl mb-8 max-w-xl ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          Solutions informatiques premium pour professionnels et gamers
        </p>
        
        <a href="#products" className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold px-10 py-4 rounded-xl shadow-2xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide">
          Découvrir nos produits
        </a>
      </div>
    </section>
  );
};

export default Hero;
