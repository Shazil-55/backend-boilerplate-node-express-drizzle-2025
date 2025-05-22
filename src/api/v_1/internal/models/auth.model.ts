import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users, verifyTokens } from '../../../../database/v_1/schema';
import { z } from 'zod';

// Base schemas
export const zodPasswordValidation = z.string().min(8);

// Authentication Interfaces
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GoogleLoginCredentials extends LoginCredentials {
  confirmPassword: string;
  profileImage?: string;
  socialLogin?: boolean;
}

// Authentication Schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: zodPasswordValidation,
});

export const RequestOTPSchema = z.object({
  email: z.string().email(),
});

export const RecoverPasswordSchema = z.object({
  sessionToken: z.string(),
  password: zodPasswordValidation,
});

export const LoginWithRefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Database Schemas
export const UserRegistrationSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertVerifyTokenSchema = createInsertSchema(verifyTokens);
export const selectVerifyTokenSchema = createSelectSchema(verifyTokens);

// Type exports
export type LoginBody = z.infer<typeof LoginSchema>;
export type RequestOTPBody = z.infer<typeof RequestOTPSchema>;
export type RecoverPassword = z.infer<typeof RecoverPasswordSchema>;
export type LoginWithRefreshToken = z.infer<typeof LoginWithRefreshTokenSchema>;
export type InsertUser = z.infer<typeof UserRegistrationSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type InsertVerifyToken = z.infer<typeof insertVerifyTokenSchema>;
export type SelectVerifyToken = z.infer<typeof selectVerifyTokenSchema>;
