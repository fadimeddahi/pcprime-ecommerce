"use client";

import { useState } from "react";
import { FaEnvelope, FaLock, FaTimes, FaSpinner, FaCheck } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { otpApi, authApi } from "../services/api";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);

    try {
      // Send OTP to email for password reset
      await otpApi.sendOTP({ user_id: email, email });
      setSuccess("Un code OTP a été envoyé à votre email");
      setTimeout(() => {
        setStep("otp");
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Erreur lors de l'envoi du code OTP";
      setError(errorMessage);
      console.error("Send OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value) && value !== "") {
      return;
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setError("");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const code = otpCode.join("");
    if (code.length !== 6) {
      setError("Veuillez entrer tous les 6 chiffres");
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP
      const response = await otpApi.verifyOTP({
        user_id: email,
        email,
        code,
      });

      if (response.verified) {
        setSuccess("Code OTP vérifié avec succès!");
        setTimeout(() => {
          setStep("reset");
          setSuccess("");
        }, 1500);
      } else {
        setError("Code OTP invalide");
      }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Erreur lors de la vérification du code";
      setError(errorMessage);
      console.error("Verify OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isPasswordValid) {
      setError("Le mot de passe ne respecte pas tous les critères requis");
      return;
    }

    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      // Use the changePassword API to update password after OTP verification
      // Since OTP is already verified, we can use the email as identifier
      const userId = email; // Using email as identifier
      await authApi.changePassword(userId, newPassword);

      setSuccess("Mot de passe réinitialisé avec succès!");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Erreur lors de la réinitialisation";
      setError(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("email");
    setOtpCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
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
              Réinitialiser le Mot de Passe
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
        <div className="p-8">
          {step === "email" ? (
            // Step 1: Email Input
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className={`rounded-lg p-4 ${
                theme === 'light'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                }`}>
                  Entrez votre adresse email pour recevoir un code de réinitialisation
                </p>
              </div>

              <div>
                <label className={`text-sm font-bold mb-2 block uppercase tracking-wide flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  <FaEnvelope className="text-[#fe8002]" />
                  Email
                </label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'bg-white border-gray-200 focus-within:border-[#fe8002]'
                    : 'bg-[#0f0f0f] border-[#2a2a2a] focus-within:border-[#fe8002]'
                }`}>
                  <FaEnvelope className={`text-lg ${
                    theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-50 ${
                      theme === 'light'
                        ? 'text-gray-900 placeholder-gray-500'
                        : 'text-white placeholder-gray-600'
                    }`}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 ${
                  isLoading || !email
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Envoi en cours...
                  </div>
                ) : (
                  "Envoyer le Code"
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                  theme === 'light'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-[#0f0f0f] text-white border-gray-600 hover:bg-[#1a1a1a]'
                }`}
              >
                Annuler
              </button>
            </form>
          ) : step === "otp" ? (
            // Step 2: OTP Verification
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className={`rounded-lg p-4 ${
                theme === 'light'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                }`}>
                  Un code OTP à 6 chiffres a été envoyé à <strong>{email}</strong>
                </p>
              </div>

              <div>
                <label className={`text-sm font-bold mb-3 block uppercase tracking-wide flex items-center gap-2 ${
                  theme === 'light' ? 'text-gray-800' : 'text-white'
                }`}>
                  <FaLock className="text-[#fe8002]" />
                  Code OTP
                </label>
                <div className="flex gap-2 justify-center">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          const inputs = document.querySelectorAll('input[maxLength="1"]');
                          (inputs[index - 1] as HTMLInputElement)?.focus();
                        } else if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                        const newOtp = [...otpCode];
                        for (let i = 0; i < pasteData.length; i++) {
                          newOtp[i] = pasteData[i] || '';
                        }
                        setOtpCode(newOtp);
                      }}
                      className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-[#fe8002]'
                          : 'bg-[#0f0f0f] border-[#2a2a2a] text-white focus:border-[#fe8002]'
                      } outline-none`}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otpCode.join("").length !== 6}
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 ${
                  isLoading || otpCode.join("").length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Vérification...
                  </div>
                ) : (
                  "Vérifier le Code"
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                  theme === 'light'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-[#0f0f0f] text-white border-gray-600 hover:bg-[#1a1a1a]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Retour
              </button>
            </form>
          ) : (
            // Step 3: New Password
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className={`rounded-lg p-4 ${
                theme === 'light'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-green-500/10 border border-green-500/30'
              }`}>
                <p className={`text-sm ${
                  theme === 'light' ? 'text-green-700' : 'text-green-300'
                }`}>
                  <FaCheck className="inline mr-2" />
                  Votre code OTP a été vérifié avec succès!
                </p>
              </div>

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
                    className={`text-lg transition-colors ${
                      theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className={`rounded-lg p-4 space-y-2 text-xs ${
                theme === 'light'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-blue-500/10 border border-blue-500/30'
              }`}>
                <p className={`font-bold uppercase tracking-wider ${
                  theme === 'light' ? 'text-blue-700' : 'text-blue-300'
                }`}>
                  Critères:
                </p>
                <div className={passwordRequirements.minLength ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {passwordRequirements.minLength ? '✓' : '○'} Au moins 8 caractères
                </div>
                <div className={passwordRequirements.uppercase ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {passwordRequirements.uppercase ? '✓' : '○'} 1 lettre majuscule
                </div>
                <div className={passwordRequirements.lowercase ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {passwordRequirements.lowercase ? '✓' : '○'} 1 lettre minuscule
                </div>
                <div className={passwordRequirements.number ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {passwordRequirements.number ? '✓' : '○'} 1 chiffre
                </div>
                <div className={passwordRequirements.special ? 'text-green-600' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                  {passwordRequirements.special ? '✓' : '○'} 1 caractère spécial (@$!%*?&)
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
                    className={`text-lg transition-colors ${
                      theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {confirmPassword && !passwordsMatch && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
                  Les mots de passe ne correspondent pas
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-lg text-sm font-medium animate-pulse">
                  {success}
                </div>
              )}

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
                    <FaSpinner className="animate-spin" />
                    Réinitialisation...
                  </div>
                ) : (
                  "Réinitialiser le Mot de Passe"
                )}
              </button>

              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 border-2 ${
                  theme === 'light'
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-[#0f0f0f] text-white border-gray-600 hover:bg-[#1a1a1a]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Retour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
