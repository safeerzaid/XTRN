import {z} from 'zod'

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(50).regex(/^[a-zA-Z0-9\s\-_]+$/, "Invalid characters in name"),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100)
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required").max(100)
})

export const verifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  otp: z.string().length(6).regex(/^\d+$/, "OTP must be exactly 6 digits")
})

export const resendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email()
})