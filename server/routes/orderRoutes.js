import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { createOrder, getOrders, getOrderById } from '../controllers/orderController.js'

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getOrders)
router.get('/:id', authMiddleware, getOrderById)

export default router