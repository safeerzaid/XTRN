import rateLimit from 'express-rate-limit'

const skipIfNonProd = (req) => process.env.NODE_ENV !== 'production';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  skip: skipIfNonProd,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skip: skipIfNonProd,
  message: { message: 'Too many signup attempts. Please try again after an hour.' },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  skip: skipIfNonProd,
  message: { message: 'Too many password reset requests. Please try again after an hour.' },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: skipIfNonProd,
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const changePasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: skipIfNonProd,
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const looseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: skipIfNonProd,
  message: {
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skip: skipIfNonProd,
  message: {
    message: 'Too many attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})