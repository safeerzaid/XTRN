import express from 'express'
import authmiddleWare from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', authmiddleWare, (req,res) => {
  res.json({
    message: 'profile accessed successfully',
    user:req.user
  })
})

export default router