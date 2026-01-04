"use client";

import { useState } from "react";
import { FaTimes, FaUser, FaLock, FaEnvelope, FaTruck, FaUserPlus } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { authApi } from "../services/api";
import ForgotPasswordModal from "./forgot-password-modal";
import { extractUserIdFromJWT } from "../utils/jwt";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
  onLoginSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onContinueAsGuest, onLoginSuccess }: LoginModalProps) => {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });
        
        console.log("Login response (raw):", response);
        console.log("Login response keys:", Object.keys(response || {}));
        console.log("Login response.id:", response?.id);
        console.log("Login response.uuid:", response?.uuid);
        console.log("Login response.user_id:", response?.user_id);
        console.log("Login response.user:", response?.user);
        if (response?.user) {
          console.log("Login response.user keys:", Object.keys(response.user));
          console.log("Login response.user.id:", response.user.id);
          console.log("Login response.user.uuid:", response.user.uuid);
          console.log("Login response.user.user_id:", response.user.user_id);
        }
        
        // Store token first
        if (response?.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // Fetch full user profile to get UUID user_id
        // Note: /users/me endpoint may return 403 Forbidden - skip if it does
        let userProfile = null;
        try {
          userProfile = await authApi.getProfile();
          console.log("User profile fetched:", userProfile);
          console.log("Profile ID field (number):", userProfile?.id);
          console.log("Profile user_id field:", userProfile?.user_id);
        } catch (err: any) {
          if (err.status === 403) {
            console.log("Profile endpoint requires admin privileges - skipping, will use JWT");
          } else {
            console.error("Could not fetch user profile:", err);
          }
        }
        
        // Extract user data from response and profile
        // Priority order: response fields (uuid/user_id/id), then profile fields, then JWT, then email fallback
        let extractedId = response?.uuid || response?.user_id || response?.id || 
                         response?.user?.uuid || response?.user?.user_id || response?.user?.id;
        
        console.log("Extracted ID from response:", extractedId);
        
        // If not found in response, try profile
        if (!extractedId && userProfile) {
          extractedId = userProfile.uuid || userProfile.user_id || userProfile.id;
          console.log("Extracted ID from profile:", extractedId);
        }
        
        // If still not found, try JWT token
        if (!extractedId && response?.token) {
          console.log("Attempting to extract user_id from JWT token...");
          const jwtUserId = extractUserIdFromJWT(response.token);
          console.log("Extracted user_id from JWT:", jwtUserId);
          if (jwtUserId) {
            extractedId = jwtUserId;
          }
        }
        
        // Final fallback: Use email as identifier
        const finalUserEmail = response?.user?.email || response?.email || userProfile?.email || formData.email;
        if (!extractedId) {
          console.log("No UUID found in response or JWT. Using email as identifier for OTP...");
          extractedId = finalUserEmail;
        } else {
          console.log("Using extracted UUID:", extractedId);
        }
        
        const userData = {
          id: extractedId,
          email: finalUserEmail,
          username: response?.user?.username || response?.username || userProfile?.username,
          user_id: extractedId, // UUID/user_id for OTP endpoints
        };
        
        console.log("Final extracted user data:", userData);
        
        // Validate we have token and email
        if (response?.token && userData.email && userData.user_id) {
          // Store user data in localStorage
          localStorage.setItem('user_data', JSON.stringify({ ...userData, verified: true }));
          localStorage.setItem('authToken', response.token);
          console.log("Stored to localStorage - user_data:", userData);
          
          // Direct login success - no OTP required
          setFormData({ email: "", password: "", username: "" });
          onLoginSuccess();
          onClose();
        } else {
          console.error("Invalid response structure or missing required fields:", response);
          throw new Error("Réponse invalide du serveur");
        }
      } else {
        // Register
        const response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        
        console.log("Register response (raw):", response);
        console.log("Register response keys:", Object.keys(response || {}));
        console.log("Register response.id:", response?.id);
        console.log("Register response.uuid:", response?.uuid);
        console.log("Register response.user_id:", response?.user_id);
        console.log("Register response.user:", response?.user);
        if (response?.user) {
          console.log("Register response.user keys:", Object.keys(response.user));
          console.log("Register response.user.id:", response.user.id);
          console.log("Register response.user.uuid:", response.user.uuid);
          console.log("Register response.user.user_id:", response.user.user_id);
        }
        
        // Store token first
        if (response?.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // Fetch full user profile to get UUID user_id
        // Note: /users/me endpoint may return 403 Forbidden - skip if it does
        let userProfile = null;
        try {
          userProfile = await authApi.getProfile();
          console.log("User profile fetched:", userProfile);
          console.log("Profile ID field (number):", userProfile?.id);
          console.log("Profile user_id field:", userProfile?.user_id);
        } catch (err: any) {
          if (err.status === 403) {
            console.log("Profile endpoint requires admin privileges - skipping, will use JWT");
          } else {
            console.error("Could not fetch user profile:", err);
          }
        }
        
        // Extract user data from response and profile
        // Priority order: response fields (uuid/user_id/id), then profile fields, then JWT, then email fallback
        let extractedId = response?.uuid || response?.user_id || response?.id || 
                         response?.user?.uuid || response?.user?.user_id || response?.user?.id;
        
        console.log("Extracted ID from response:", extractedId);
        
        // If not found in response, try profile
        if (!extractedId && userProfile) {
          extractedId = userProfile.uuid || userProfile.user_id || userProfile.id;
          console.log("Extracted ID from profile:", extractedId);
        }
        
        // If still not found, try JWT token
        if (!extractedId && response?.token) {
          console.log("Attempting to extract user_id from JWT token...");
          const jwtUserId = extractUserIdFromJWT(response.token);
          console.log("Extracted user_id from JWT:", jwtUserId);
          if (jwtUserId) {
            extractedId = jwtUserId;
          }
        }
        
        // Final fallback: Use email as identifier
        const finalUserEmail = response?.user?.email || response?.email || userProfile?.email || formData.email;
        if (!extractedId) {
          console.log("No UUID found in response or JWT. Using email as identifier for OTP...");
          extractedId = finalUserEmail;
        } else {
          console.log("Using extracted UUID:", extractedId);
        }
        
        const userData = {
          id: extractedId,
          email: finalUserEmail,
          username: response?.user?.username || response?.username || userProfile?.username,
          user_id: extractedId, // This will be email if no ID was found
        };
        
        console.log("Final extracted user data:", userData);
        
        if (response?.token && userData.email && userData.user_id) {
          // Store user data in localStorage
          localStorage.setItem('user_data', JSON.stringify({ ...userData, verified: true }));
          localStorage.setItem('authToken', response.token);
          console.log("Stored to localStorage - user_data:", userData);
          
          // Direct registration success - no OTP required
          setFormData({ email: "", password: "", username: "" });
          onLoginSuccess();
          onClose();
        } else {
          console.error("Invalid response structure or missing required fields:", response);
          throw new Error("Réponse invalide du serveur");
        }
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      username: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 backdrop-blur-lg ${
          theme === 'light' ? 'bg-black/60' : 'bg-black/90'
        }`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative z-10 w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-[#fe8002] shadow-2xl shadow-[#fe8002]/50 transform transition-all duration-300 scale-100 ${
        theme === 'light'
          ? 'bg-white' 
          : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
      }`}>
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`absolute top-4 right-4 transition-colors z-50 p-2 rounded-lg hover:bg-opacity-10 ${
            theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-900' : 'text-gray-400 hover:text-white hover:bg-white'
          }`}
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-4 text-center relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-xl font-extrabold text-white mb-1">
              {isLogin ? "CONNEXION" : "INSCRIPTION"}
            </h2>
            <p className="text-white/90 text-xs font-semibold">
              {isLogin ? "Connectez-vous pour la livraison gratuite" : "Créez un compte pour profiter de nos avantages"}
            </p>
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 flex items-center justify-center gap-2">
          <FaTruck className="text-white text-lg" />
          <p className="text-white font-bold text-sm">
            Livraison GRATUITE pour les membres
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border-2 border-red-500 text-red-500 px-4 py-3 rounded-xl font-bold text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className={`block font-bold mb-1 text-sm flex items-center gap-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                <FaUser className="text-[#fe8002]" />
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required={!isLogin}
                className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:border-[#fe8002] focus:outline-none transition-all ${
                  theme === 'light'
                    ? 'bg-gray-50 border-gray-300 text-gray-900' 
                    : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
                }`}
                placeholder="Votre nom d'utilisateur"
              />
            </div>
          )}

          <div>
            <label className={`block font-bold mb-1 text-sm flex items-center gap-2 ${
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
              className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:border-[#fe8002] focus:outline-none transition-all ${
                theme === 'light'
                  ? 'bg-gray-50 border-gray-300 text-gray-900' 
                  : 'bg-[#0f0f0f] border-[#2a2a2a] text-white'
              }`}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 text-sm flex items-center gap-2 ${
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
              className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:border-[#fe8002] focus:outline-none transition-all ${
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
                onClick={() => setShowForgotPassword(true)}
                className="text-[#fe8002] hover:text-[#ff4500] text-sm font-bold transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] text-white font-extrabold py-3 rounded-xl shadow-xl shadow-[#fe8002]/50 hover:shadow-[#fe8002]/70 transition-all duration-300 transform hover:scale-105 uppercase tracking-wide text-sm flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                CHARGEMENT...
              </>
            ) : isLogin ? (
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

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={() => {
          setShowForgotPassword(false);
          setIsLogin(true);
        }}
      />
    </div>
  );
};

export default LoginModal;
