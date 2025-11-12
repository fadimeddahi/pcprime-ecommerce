"use client";

import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { authApi } from "../services/api";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number;
}

interface PasswordStrength {
  score: number; // 0-5
  messages: string[];
  isValid: boolean;
}

const ChangePasswordModal = ({ isOpen, onClose, userId }: ChangePasswordModalProps) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password validation requirements
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password
    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas tous les critères requis");
      return;
    }

    // Check passwords match
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.changePassword(userId, newPassword);
      setSuccess(response.message || "Mot de passe changé avec succès!");
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Erreur lors du changement de mot de passe";
      setError(errorMessage);
      console.error("Change password error:", err);
    } finally {
      setIsLoading(false);
    }
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
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl border-4 border-[#fe8002] shadow-2xl shadow-[#fe8002]/50 overflow-hidden transform transition-all duration-300 scale-100 ${
          theme === 'light'
            ? 'bg-white'
            : 'bg-gradient-to-br from-[#1a1a1a] via-[#181818] to-[#0f0f0f]'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fe8002] via-[#ff4500] to-[#fe8002] p-6 text-center relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center justify-center gap-3">
            <FaLock className="text-white text-3xl" />
            <h1 className="text-white font-extrabold text-2xl uppercase tracking-wider">
              Changer le Mot de Passe
            </h1>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 transition-colors z-10 ${
            theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* New Password */}
          <div>
            <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              <FaLock className="text-[#fe8002]" />
              Nouveau Mot de Passe
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'bg-white border-gray-200 focus-within:border-[#fe8002]'
                : 'bg-[#0f0f0f] border-[#2a2a2a] focus-within:border-[#fe8002]'
            }`}>
              <FaLock className={`text-lg ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-50 ${
                  theme === 'light'
                    ? 'text-gray-900 placeholder-gray-500'
                    : 'text-white placeholder-gray-600'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`transition-colors ${
                  theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className={`rounded-lg p-4 space-y-2 ${
            theme === 'light'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-blue-500/10 border border-blue-500/30'
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider ${
              theme === 'light' ? 'text-blue-700' : 'text-blue-300'
            }`}>
              Critères de sécurité:
            </p>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center gap-2 ${
                passwordRequirements.minLength
                  ? 'text-green-600'
                  : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {passwordRequirements.minLength ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />
                )}
                Au moins 8 caractères
              </div>
              <div className={`flex items-center gap-2 ${
                passwordRequirements.uppercase
                  ? 'text-green-600'
                  : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {passwordRequirements.uppercase ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />
                )}
                1 lettre majuscule
              </div>
              <div className={`flex items-center gap-2 ${
                passwordRequirements.lowercase
                  ? 'text-green-600'
                  : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {passwordRequirements.lowercase ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />
                )}
                1 lettre minuscule
              </div>
              <div className={`flex items-center gap-2 ${
                passwordRequirements.number
                  ? 'text-green-600'
                  : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {passwordRequirements.number ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />
                )}
                1 chiffre
              </div>
              <div className={`flex items-center gap-2 ${
                passwordRequirements.special
                  ? 'text-green-600'
                  : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {passwordRequirements.special ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className={theme === 'light' ? 'text-gray-400' : 'text-gray-600'} />
                )}
                1 caractère spécial (@$!%*?&)
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
              theme === 'light' ? 'text-gray-800' : 'text-white'
            }`}>
              <FaLock className="text-[#fe8002]" />
              Confirmer le Mot de Passe
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'bg-white border-gray-200 focus-within:border-[#fe8002]'
                : 'bg-[#0f0f0f] border-[#2a2a2a] focus-within:border-[#fe8002]'
            } ${
              confirmPassword && !passwordsMatch ? (theme === 'light' ? 'border-red-500' : 'border-red-600') : ''
            }`}>
              <FaLock className={`text-lg ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-50 ${
                  theme === 'light'
                    ? 'text-gray-900 placeholder-gray-500'
                    : 'text-white placeholder-gray-600'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`transition-colors ${
                  theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs font-semibold mt-2">
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isPasswordValid || !passwordsMatch}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 ${
              isLoading || !isPasswordValid || !passwordsMatch
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Changement en cours...
              </div>
            ) : (
              "Changer le Mot de Passe"
            )}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 border-2 ${
              theme === 'light'
                ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                : 'bg-[#0f0f0f] text-white border-gray-600 hover:bg-[#1a1a1a]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
