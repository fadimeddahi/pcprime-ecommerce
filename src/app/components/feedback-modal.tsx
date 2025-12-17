"use client";

import { useState } from "react";
import { FaXmark, FaCheck, FaSpinner } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext";
import { feedbackApi } from "../services/feedbackApi";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
  userEmail?: string;
}

const FeedbackModal = ({ isOpen, onClose, userId, userEmail }: FeedbackModalProps) => {
  const { theme } = useTheme();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!subject.trim()) {
      setErrorMessage("Subject is required");
      return;
    }
    if (subject.trim().length < 5) {
      setErrorMessage("Subject must be at least 5 characters");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Message is required");
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage("Message must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await feedbackApi.submitFeedback({
        user_id: userId,
        subject: subject.trim(),
        message: message.trim(),
        email: userEmail,
      });

      setSuccessMessage("Thank you! Your feedback has been submitted.");
      setSubject("");
      setMessage("");

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (err: any) {
      const errorMsg = err.error || "Failed to submit feedback. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center z-[9999] p-4 pt-28 md:pt-32"
      onClick={onClose}
    >
      <div
        className={`${
          theme === "light"
            ? "bg-white"
            : "bg-[#1a1a1a] border border-gray-700"
        } rounded-lg shadow-xl max-w-md w-full p-6 transition-all max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Send Feedback
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-gray-200 ${
              theme === "light" ? "text-gray-600" : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            <FaXmark size={18} />
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded flex items-center gap-2">
            <FaCheck className="text-green-600" />
            <span className="text-green-700 text-sm">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className={`mb-4 p-3 rounded text-sm ${
            theme === "light"
              ? "bg-red-100 border border-red-300 text-red-700"
              : "bg-red-900/30 border border-red-800 text-red-400"
          }`}>
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this feedback about?"
              className={`w-full px-3 py-2 rounded border transition ${
                theme === "light"
                  ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
              disabled={isSubmitting}
            />
            <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
              Minimum 5 characters
            </p>
          </div>

          {/* Message */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === "light" ? "text-gray-700" : "text-gray-300"
            }`}>
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              rows={5}
              className={`w-full px-3 py-2 rounded border transition resize-none ${
                theme === "light"
                  ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "border-gray-600 bg-[#2a2a2a] text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              }`}
              disabled={isSubmitting}
            />
            <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
              Minimum 10 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 rounded font-medium transition ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              } disabled:opacity-50`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  Submitting...
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
