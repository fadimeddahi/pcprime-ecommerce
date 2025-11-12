"use client";

import { useState } from "react";
import { FaEnvelope, FaSpinner, FaArrowRight } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { otpApi } from "../services/api";

interface OTPSendScreenProps {
  onSuccess: (email: string) => void;
  onError?: (error: string) => void;
}

export const OTPSendScreen = ({ onSuccess, onError }: OTPSendScreenProps) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate email
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      onError?.("Invalid email");
      return;
    }

    setIsLoading(true);

    try {
      // Get user ID from localStorage
      let userData = localStorage.getItem('user_data');
      let userId: string | null = null;
      
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          // Try to get UUID format user_id first, fallback to id
          userId = parsed.user_id || parsed.id;
          console.log("Extracted userId from storage:", userId, "from parsed data:", parsed);
        } catch (e) {
          console.warn("Failed to parse user_data from localStorage", e);
        }
      }

      if (!userId) {
        setError("User not properly authenticated. Please log in again.");
        onError?.("User not authenticated");
        setIsLoading(false);
        return;
      }

      console.log("Sending OTP with user_id:", userId, "email:", email);
      const response = await otpApi.sendOTP({ user_id: userId, email });
      console.log("OTP send response:", response);
      console.log("OTP send response message:", response?.message);
      setSuccess("OTP sent successfully! Check your email for the 6-digit code.");
      setTimeout(() => {
        onSuccess(email);
      }, 1000);
    } catch (err: any) {
      console.error("OTP send error:", err);
      console.error("OTP send error full details:", err);
      console.error("OTP send error.data:", err.data);
      console.error("OTP send error.status:", err.status);
      const errorMessage = err.data?.message || err.message || "Failed to send OTP";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className={`text-3xl font-bold mb-2 ${
          theme === 'light'
            ? 'text-gray-900'
            : 'text-white'
        }`}>
          Email Verification
        </h2>
        <p className={`text-sm ${
          theme === 'light'
            ? 'text-gray-600'
            : 'text-gray-400'
        }`}>
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="relative">
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
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              className={`flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-50 ${
                theme === 'light'
                  ? 'text-gray-900 placeholder-gray-500'
                  : 'text-white placeholder-gray-600'
              }`}
              disabled={isLoading}
            />
          </div>
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
          disabled={isLoading || !email}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading || !email
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Code
              <FaArrowRight className="text-sm" />
            </>
          )}
        </button>
      </form>

      {/* Info Message */}
      <div className={`mt-6 p-4 rounded-lg ${
        theme === 'light'
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-blue-500/10 border border-blue-500/30'
      }`}>
        <p className={`text-xs ${
          theme === 'light'
            ? 'text-blue-700'
            : 'text-blue-300'
        }`}>
          💡 We'll send you a 6-digit code. This code will expire in 10 minutes.
        </p>
      </div>
    </div>
  );
};
