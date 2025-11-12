"use client";

import { useState, useEffect, useRef } from "react";
import { FaSpinner, FaLock, FaRedoAlt, FaClock } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { otpApi } from "../services/api";

interface OTPVerifyScreenProps {
  email: string;
  onSuccess: (token?: string) => void;
  onError?: (error: string) => void;
  onBackToEmail: () => void;
}

export const OTPVerifyScreen = ({
  email,
  onSuccess,
  onError,
  onBackToEmail,
}: OTPVerifyScreenProps) => {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect for OTP expiry
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining]);

  // Timer effect for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown(resendCooldown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value) && value !== "") {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      onError?.("Invalid OTP length");
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

      const response = await otpApi.verifyOTP({
        user_id: userId,
        email,
        code,
      });

      if (response.verified) {
        setSuccess("Email verified successfully!");
        setTimeout(() => {
          onSuccess(response.token);
        }, 1000);
      } else {
        setError("Invalid OTP code");
        onError?.("Invalid OTP");
      }
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Verification failed";
      
      // Update remaining attempts if provided
      if (err.data?.remaining_attempts !== undefined) {
        setRemainingAttempts(err.data.remaining_attempts);
      }

      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      // Get user ID and token from localStorage
      let userData = localStorage.getItem('user_data');
      let userId: string | null = null;
      const token = localStorage.getItem('auth_token');
      
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
        setIsResending(false);
        return;
      }

      const response = await otpApi.resendOTP({ user_id: userId, email }, token || undefined);
      setSuccess("Code resent! Check your email.");
      setOtp(["", "", "", "", "", ""]);
      setTimeRemaining(600); // Reset timer to 10 minutes
      setResendCooldown(60); // 60 second cooldown
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || "Failed to resend OTP";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const isExpired = timeRemaining <= 0;
  const otpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className={`text-3xl font-bold mb-2 ${
          theme === 'light' ? 'text-gray-900' : 'text-white'
        }`}>
          Verify Your Email
        </h2>
        <p className={`text-sm ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        }`}>
          We sent a 6-digit code to {email}
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* Timer */}
        <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${
          isExpired
            ? theme === 'light'
              ? 'bg-red-50 border border-red-200'
              : 'bg-red-500/10 border border-red-500/30'
            : theme === 'light'
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-blue-500/10 border border-blue-500/30'
        }`}>
          <FaClock className={isExpired ? 'text-red-500' : 'text-blue-500'} />
          <span className={`font-bold ${
            isExpired
              ? 'text-red-500'
              : theme === 'light'
                ? 'text-blue-700'
                : 'text-blue-300'
          }`}>
            {isExpired ? 'Code expired' : `${formatTime(timeRemaining)} remaining`}
          </span>
        </div>

        {/* OTP Input Fields */}
        <div className="space-y-4">
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="0"
                maxLength={1}
                disabled={isLoading || isExpired}
                className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-lg border-2 transition-all focus:outline-none ${
                  digit
                    ? theme === 'light'
                      ? 'border-[#fe8002] bg-white'
                      : 'border-[#fe8002] bg-[#1a1a1a]'
                    : theme === 'light'
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-[#2a2a2a] bg-[#0f0f0f]'
                } ${
                  isExpired
                    ? 'opacity-50 cursor-not-allowed'
                    : 'focus:border-[#fe8002] focus:shadow-lg focus:shadow-[#fe8002]/30'
                } ${
                  theme === 'light'
                    ? 'text-gray-900 placeholder-gray-400'
                    : 'text-white placeholder-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Remaining Attempts */}
          <div className={`text-center text-xs font-medium ${
            remainingAttempts <= 2
              ? 'text-red-500'
              : theme === 'light'
                ? 'text-gray-600'
                : 'text-gray-400'
          }`}>
            {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
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

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading || !otpComplete || isExpired}
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading || !otpComplete || isExpired
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#fe8002] to-[#ff4500] hover:shadow-lg hover:shadow-[#fe8002]/50 active:scale-95'
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <FaLock className="text-sm" />
              Verify Code
            </>
          )}
        </button>
      </form>

      {/* Resend Code */}
      <div className="mt-6 text-center space-y-3">
        <button
          onClick={handleResend}
          disabled={isResending || resendCooldown > 0}
          className={`inline-flex items-center gap-2 font-medium text-sm transition-all ${
            isResending || resendCooldown > 0
              ? theme === 'light'
                ? 'text-gray-400'
                : 'text-gray-600'
              : 'text-[#fe8002] hover:text-[#ff4500]'
          }`}
        >
          <FaRedoAlt className={isResending ? 'animate-spin' : ''} />
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : 'Resend Code'}
        </button>

        {/* Back to Email */}
        <div>
          <button
            type="button"
            onClick={onBackToEmail}
            className={`text-xs font-medium transition-all ${
              theme === 'light'
                ? 'text-gray-500 hover:text-gray-700'
                : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            Use different email
          </button>
        </div>
      </div>
    </div>
  );
};
