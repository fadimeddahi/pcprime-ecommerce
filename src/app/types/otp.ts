// OTP Types

export interface OTPSendRequest {
  user_id: string | number;
  email: string;
}

export interface OTPSendResponse {
  message: string;
  email: string;
}

export interface OTPVerifyRequest {
  user_id: string | number;
  email: string;
  code: string;
}

export interface OTPVerifyResponse {
  message: string;
  verified: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    username?: string;
  };
}

export interface OTPResendRequest {
  user_id: string | number;
  email: string;
}

export interface OTPResendResponse {
  message: string;
  email: string;
}

export interface OTPState {
  step: 'email' | 'verification';
  email: string;
  isLoading: boolean;
  error: string;
  success: string;
  remainingAttempts: number;
  resendCooldown: number;
  timeRemaining: number;
}
