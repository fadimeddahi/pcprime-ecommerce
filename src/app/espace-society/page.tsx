"use client";

import { useState } from "react";
import CompanyRegistrationModal from "../components/company-registration-modal";
import { useTheme } from "../context/ThemeContext";

export default function EspaceEntreprisePage() {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`min-h-screen py-12 px-4 relative overflow-hidden transition-all duration-300 ${
      theme === 'light' ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' : 'bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a1a1a]'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.02]'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #fe8002 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Subtle orange accent gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fe8002]/10 via-transparent to-[#ff4500]/10 pointer-events-none" />

      <div className="container mx-auto max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] bg-clip-text text-transparent tracking-tight mb-4">
            Espace Entreprise
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] mx-auto mb-6 shadow-lg shadow-[#fe8002]/50" />
          <p className={`text-lg md:text-xl font-bold ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Inscrivez votre entreprise pour accéder à nos services B2B
          </p>
        </div>

        {/* Registration Section */}
        <div className="text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 px-12 text-lg rounded-2xl hover:scale-110 transition-all duration-300 shadow-2xl shadow-[#fe8002]/60 uppercase tracking-wide border-2 border-white/30"
          >
            S'inscrire Maintenant
          </button>
        </div>

        {/* Modal */}
        <CompanyRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
