import crypto from 'crypto'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import { sendOrderConfirmationEmail } from '../utils/orderEmail.js'

export const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!signature || !secret) {
      return res.status(400).json({ message: 'Missing signature or secret' })
    }

    // req.body ivide raw Buffer aanu (express.raw kondu)
    const expected = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex')

    const a = Buffer.from(expected)
    const b = Buffer.from(signature)
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b)

    if (!valid) {
      return res.status(400).json({ message: 'Invalid signature' })
    }

    const event = JSON.parse(req.body.toString())

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id, paymentStatus: 'pending' },
        {
          paymentStatus: 'paid',
          razorpayPaymentId: payment.id,
          paidAt: new Date()
        },
        { returnDocument: 'after' }
      )

      if (order) {
        sendOrderConfirmationEmail(order).catch(console.error)

        const cart = await Cart.findOne({ user: order.user })
        if (cart) {
          cart.items = []
          await cart.save()
        }
      } else {
        console.warn(`Warning: Late payment captured for non-pending order! Order ID: ${payment.order_id}, Payment ID: ${payment.id}`)
      }
    }

    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      console.log(`Payment failed attempt: order id ${payment.order_id}, payment id ${payment.id}`)
    }

    // Razorpay-ku eppozhum vegam 200 kodukkanam
    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('webhook error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}