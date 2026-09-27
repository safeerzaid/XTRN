import express from 'express'
import {login, signup, refresh, logout, forgotPassword, resetPassword, verifyEmail, resendVerification, changePassword} from '../controllers/authController.js'
import { authLimiter, looseLimiter } from '../middleware/rateLimiter.js'
import verifyToken from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', authLimiter, signup)
router.post('/login', authLimiter, login)
router.post('/refresh', looseLimiter, refresh)
router.post('/logout', looseLimiter, logout)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', authLimiter, resetPassword)
router.post('/change-password', authLimiter, verifyToken, changePassword)
router.get('/verify-email/:token', looseLimiter, verifyEmail)
router.post('/resend-verification', authLimiter, resendVerification)

export default router;