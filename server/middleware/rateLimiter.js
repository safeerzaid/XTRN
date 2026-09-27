import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: {
    message: 'Too many attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
})

export const looseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skip: (req) => process.env.NODE_ENV !== 'production',
  message: {
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
})