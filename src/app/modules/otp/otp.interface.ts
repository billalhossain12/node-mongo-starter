import { Model } from 'mongoose';

export interface TOTP {
  email: string;
  otp: string;
  verifiedAt: Date;
  expiresAt: Date;
  otpHashed: string;
  purpose: 'email-verification' | 'password-reset' | 'account-recovery';
  attempts: number;
  maxAttempts: number;
  createdAt: string;

  // Instance methods
  verifyOTP(inputOTP: string): Promise<boolean>;
  isExpired(): boolean;
  hasExceededAttempts(): boolean;
  incrementAttempts(): Promise<void>;
}

export interface TOTPModel extends Model<TOTP> {
  // Static methods
  generateOTP(): string;
  createHashedOTP(email: string, otp: string): Promise<string>;
  createHashedOTP(email: string, otp: string): Promise<string>;
}
