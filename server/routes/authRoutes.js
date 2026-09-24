import express from 'express'
import {login, signup, refresh, logout} from '../controllers/authController.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

router.post('/signup', authLimiter, signup)
router.post('/login', authLimiter, login)
router.post('/refresh', refresh)
router.post('/logout', logout)


export default router;