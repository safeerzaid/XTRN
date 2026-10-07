import express from 'express'
import {login, signup, refresh, logout, forgotPassword, resetPassword, verifyOtp, resendOtp, changePassword} from '../controllers/authController.js'
import { loginLimiter, signupLimiter, forgotPasswordLimiter, resetPasswordLimiter, changePasswordLimiter, looseLimiter, otpLimiter } from '../middleware/rateLimiter.js'
import verifyToken from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/signup', signupLimiter, signup)
router.post('/login', loginLimiter, login)
router.post('/refresh', looseLimiter, refresh)
router.post('/logout', looseLimiter, logout)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)
router.post('/reset-password/:token', resetPasswordLimiter, resetPassword)
router.post('/change-password', changePasswordLimiter, verifyToken, changePassword)
router.post('/verify-otp', otpLimiter, verifyOtp)
router.post('/resend-otp', otpLimiter, resendOtp)

export default router;