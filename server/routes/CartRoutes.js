import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from '../controllers/cartController.js'

const router = express.Router()

router.get('/', authMiddleware, getCart)
router.post('/', authMiddleware, addToCart)
router.patch('/:itemId', authMiddleware, updateCartItem)
router.delete('/:itemId', authMiddleware, removeCartItem)

export default router