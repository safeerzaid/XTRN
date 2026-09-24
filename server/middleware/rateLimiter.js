import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Too many attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false,  
})