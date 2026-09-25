import express from 'express'
import authmiddleWare from '../middleware/authMiddleware.js'
import User from '../models/User.js'
import { updateProfileSchema } from '../validators/profileValidator.js'
const router = express.Router()

router.get('/', authmiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server Error' })
  }
})

// PATCH /api/profile
router.patch('/', authmiddleWare, async (req, res) => {
  try {
    const result = updateProfileSchema.safeParse(req.body)
    
    if (!result.success) {
      let errorMessage = 'Invalid update data'
      try {
        errorMessage = JSON.parse(result.error.message)[0].message
      } catch (e) {
        errorMessage = result.error.issues?.[0]?.message || 'Invalid update data'
      }
      return res.status(400).json({ message: errorMessage })
    }

    const { name } = result.data

    const user = await User.findById(req.user.id).select('-password -refreshTokens')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = name
    await user.save()

    return res.json({ user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server Error' })
  }
})

export default router