import { useState, useCallback } from 'react';
import { otpApi } from '../services/api';

interface UseOTPOptions {
  onSuccess?: (token?: string) => void;
  onError?: (error: string) => void;
}

export const useOTP = (options?: UseOTPOptions) => {
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);

  const sendOTP = useCallback(
    async (sendEmail: string) => {
      setError('');
      setSuccess('');
      setIsLoading(true);

      try {
        // Get user ID from localStorage
        const userData = localStorage.getItem('user_data');
        const userId = userData ? JSON.parse(userData).id : null;

        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await otpApi.sendOTP({ user_id: userId, email: sendEmail });
        setEmail(sendEmail);
        setStep('verification');
        setSuccess('OTP sent successfully!');
        setTimeRemaining(600);
        return true;
      } catch (err: any) {
        const errorMessage = err.data?.message || err.message || 'Failed to send OTP';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const verifyOTP = useCallback(
    async (code: string) => {
      setError('');
      setSuccess('');
      setIsLoading(true);

      try {
        // Get user ID from localStorage
        const userData = localStorage.getItem('user_data');
        const userId = userData ? JSON.parse(userData).id : null;

        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await otpApi.verifyOTP({ user_id: userId, email, code });

        if (response.verified) {
          setSuccess('Email verified successfully!');
          options?.onSuccess?.(response.token);
          return true;
        } else {
          setError('Invalid OTP code');
          options?.onError?.('Invalid OTP');
          return false;
        }
      } catch (err: any) {
        const errorMessage = err.data?.message || err.message || 'Verification failed';
        
        if (err.data?.remaining_attempts !== undefined) {
          setRemainingAttempts(err.data.remaining_attempts);
        }

        setError(errorMessage);
        options?.onError?.(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [email, options]
  );

  const resendOTP = useCallback(async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Get user ID and token from localStorage
      const userData = localStorage.getItem('user_data');
      const token = localStorage.getItem('auth_token');
      const userId = userData ? JSON.parse(userData).id : null;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await otpApi.resendOTP({ user_id: userId, email }, token || undefined);
      setSuccess('Code resent! Check your email.');
      setTimeRemaining(600);
      setResendCooldown(60);
      return true;
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to resend OTP';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [email, options]);

  const reset = useCallback(() => {
    setStep('email');
    setEmail('');
    setError('');
    setSuccess('');
    setRemainingAttempts(5);
    setTimeRemaining(600);
    setResendCooldown(0);
  }, []);

  return {
    step,
    email,
    isLoading,
    error,
    success,
    remainingAttempts,
    timeRemaining,
    resendCooldown,
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
    setStep,
    setEmail,
    setTimeRemaining,
    setResendCooldown,
  };
};
