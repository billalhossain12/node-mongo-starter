import { model, Schema } from 'mongoose';
import { TOTP, TOTPModel } from './otp.interface';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../../config';

const OTPSchema = new Schema<TOTP, TOTPModel>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    otpHashed: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['email-verification', 'password-reset', 'account-recovery'],
      default: 'email-verification',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    verifiedAt: Date,
  },
  { timestamps: true },
);

// Generate OTP
OTPSchema.statics.generateOTP = function () {
  return crypto.randomInt(100000, 999999).toString();
};

// Hash OTP using bcrypt
OTPSchema.statics.createHashedOTP = async function (
  email: string,
  otp: string,
): Promise<string> {
  // Combine email and OTP with timestamp for uniqueness
  const otpToHash = `${email}:${otp}`;

  // Use bcrypt with a reasonable salt rounds for OTPs
  const saltRounds = parseInt(config.otp_bcrypt_salt_rounds as string);
  const hashedOTP = await bcrypt.hash(otpToHash, saltRounds);

  return hashedOTP;
};

// Verify OTP using bcrypt
OTPSchema.methods.verifyOTP = async function (
  inputOTP: string,
): Promise<boolean> {
  const dataToVerify = `${this.email}:${inputOTP}`;
  const isValid = await bcrypt.compare(dataToVerify, this.otpHashed);
  return isValid;
};

// Check if OTP is expired
OTPSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

// Check if max attempts reached
OTPSchema.methods.hasExceededAttempts = function (): boolean {
  return this.attempts >= this.maxAttempts;
};

// Increment attempt count
OTPSchema.methods.incrementAttempts = async function (): Promise<void> {
  this.attempts += 1;
  await this.save();
};

export const OTP = model<TOTP, TOTPModel>('OTP', OTPSchema);
