import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { createOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus, verifyPayment } from '../controllers/orderController.js'

const router = express.Router()

router.post('/', authMiddleware, createOrder)
router.get('/', authMiddleware, getOrders)

router.post('/verify-payment', authMiddleware, verifyPayment)

router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders)
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, updateOrderStatus)

router.get('/:id', authMiddleware, getOrderById)

export default router