"use client";

import { useState } from "react";
import { FaTimes, FaUser, FaLock, FaEnvelope, FaPhone, FaTruck, FaUserPlus } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onContinueAsGuest, onLoginSuccess }: LoginModalProps) => {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the login/signup data to your backend
    console.log("Form Data:", formData);
    onLoginSuccess();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      name: "",
      phone: "",
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Inline Theme Detection Script for Login Modal */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
        }}
      />
      
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 backdrop-blur-lg ${
          theme === 'light' ? 'bg-black/60' : 'bg-black/90'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-md rounded-3xl border-4 border-[#fe8002] shadow-2xl shadow-[#fe8002]/50 overflow-hidden transform transition-all duration-300 scale-100 ${
        theme === 'light'
          ? 'bg-white' 
          : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors z-10 ${
            theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-6 text-center relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {isLogin ? "CONNEXION" : "INSCRIPTION"}
            </h2>
            <p className="text-white/90 text-sm font-semibold">
              {isLogin ? "Connectez-vous pour bénéficier de la livraison gratuite" : "Créez un compte pour profiter de nos avantages"}
            </p>
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-4 flex items-center justify-center gap-3">
          <FaTruck className="text-white text-2xl" />
          <p className="text-white font-bold text-lg">
            Livraison GRATUITE pour les membres
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div>
              <label className={`block font-bold mb-2 flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <FaUser className="text-[#fe8002]" />
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#fe8002] focus:outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900' 
                    : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
                }`}
                placeholder="Votre nom complet"
              />
            </div>
          )}

          <div>
            <label className={`block font-bold mb-2 flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <FaEnvelope className="text-[#fe8002]" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#fe8002] focus:outline-none transition-all ${
                theme === 'light'
                  ? 'bg-gray-50 border-gray-300 text-gray-900' 
                  : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
              }`}
              placeholder="votre@email.com"
            />
          </div>

          {!isLogin && (
            <div>
              <label className={`block font-bold mb-2 flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <FaPhone className="text-[#fe8002]" />
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required={!isLogin}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#fe8002] focus:outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900' 
                    : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
                }`}
                placeholder="0555 12 34 56"
              />
            </div>
          )}

          <div>
            <label className={`block font-bold mb-2 flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              <FaLock className="text-[#fe8002]" />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-[#fe8002] focus:outline-none transition-all ${
                theme === 'light'
                  ? 'bg-gray-50 border-gray-300 text-gray-900' 
                  : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
              }`}
              placeholder="••••••••"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#fe8002] hover:text-[#ff4500] text-sm font-bold transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-4 rounded-xl shadow-2xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide flex items-center justify-center gap-3"
          >
            {isLogin ? (
              <>
                <FaUser />
                SE CONNECTER
              </>
            ) : (
              <>
                <FaUserPlus />
                S'INSCRIRE
              </>
            )}
          </button>

          {/* Toggle Mode */}
          <div className={`text-center pt-4 border-t-2 ${
            theme === 'light' ? 'border-gray-300' : 'border-[#2a2a2a]'
          }`}>
            <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-[#fe8002] hover:text-[#ff4500] font-bold transition-colors"
              >
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>

          {/* Continue as Guest */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className={`text-sm font-bold transition-colors underline ${
                theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
              }`}
            >
              Continuer sans compte (livraison payante)
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginModal;
