"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { OTPSendScreen } from "./otp-send-screen";
import { OTPVerifyScreen } from "./otp-verify-screen";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (token?: string) => void;
  title?: string;
  description?: string;
}

export const OTPModal = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Verify Your Email",
  description = "We'll send you a verification code",
}: OTPModalProps) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<"email" | "verification">("email");
  const [email, setEmail] = useState("");
  const [globalError, setGlobalError] = useState("");

  if (!isOpen) return null;

  const handleSendSuccess = (sentEmail: string) => {
    setEmail(sentEmail);
    setStep("verification");
    setGlobalError("");
  };

  const handleVerifySuccess = (token?: string) => {
    setGlobalError("");
    onSuccess?.(token);
    setTimeout(() => {
      onClose();
      setStep("email");
      setEmail("");
    }, 1500);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setGlobalError("");
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setGlobalError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border transition-all duration-300 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-[#2a2a2a]"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === "light"
              ? "border-gray-200"
              : "border-[#2a2a2a]"
          }`}
        >
          <div>
            <h1
              className={`text-xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              {title}
            </h1>
            {description && (
              <p
                className={`text-xs mt-1 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {description}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all hover:scale-110 ${
              theme === "light"
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a]"
            }`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {globalError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm font-medium">
              {globalError}
            </div>
          )}

          {step === "email" ? (
            <OTPSendScreen
              onSuccess={handleSendSuccess}
              onError={setGlobalError}
            />
          ) : (
            <OTPVerifyScreen
              email={email}
              onSuccess={handleVerifySuccess}
              onError={setGlobalError}
              onBackToEmail={handleBackToEmail}
            />
          )}
        </div>

        {/* Footer - Step Indicator */}
        <div
          className={`flex justify-center gap-2 px-6 pb-6 ${
            step === "verification" ? "block" : "hidden"
          }`}
        >
          <div
            className={`h-1 w-12 rounded-full transition-all ${
              theme === "light" ? "bg-gray-200" : "bg-[#2a2a2a]"
            }`}
          />
          <div
            className={`h-1 w-12 rounded-full transition-all ${
              step === "verification"
                ? "bg-gradient-to-r from-[#fe8002] to-[#ff4500]"
                : theme === "light"
                  ? "bg-gray-200"
                  : "bg-[#2a2a2a]"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
