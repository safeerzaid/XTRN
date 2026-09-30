import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import { createOrderSchema } from '../validators/orderValidator.js'
import razorpay from '../config/razorpay.js'
import crypto from 'crypto'
import { sendOrderConfirmationEmail } from '../utils/orderEmail.js'

export const createOrder = async (req, res) => {
  const decremented = [] // { productId, quantity } — rollback-inu vendi track cheyyunnu

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before placing an order.' });
    }

    const result = createOrderSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message
      })
    }

    const { shippingAddress, paymentMethod } = result.data

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    // ⭐ STEP 1: Stock ellam parishodhichu, atomic aayi kurakkuka
    for (const item of cart.items) {
      if (!item.product) {
        await rollbackStock(decremented)
        return res.status(400).json({
          message: 'One of the items in your cart is no longer available'
        })
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { returnDocument: 'after' }
      )

      if (!updatedProduct) {
        await rollbackStock(decremented)

        const currentProduct = await Product.findById(item.product._id)
        const available = currentProduct ? currentProduct.stock : 0

        return res.status(400).json({
          message: `${item.product.name} (Size ${item.size}): only ${available} left in stock`
        })
      }

      decremented.push({ productId: item.product._id, quantity: item.quantity })
    }

    // ⭐ STEP 2: Ella stock-um kurachu kazhinjal, order create cheyyuka
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      size: item.size,
      quantity: item.quantity
    }))

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // ⭐ Razorpay flow: order create cheythittu, cart clear cheyyathe
    // Razorpay session details thirike kodukkuka
    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100), // paise-il venam
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      })

      const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod,
        razorpayOrderId: razorpayOrder.id,
      })

      return res.status(201).json({
        order,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      })
    }

    // ⭐ COD flow: nilavilullath thanne
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod
    })

    sendOrderConfirmationEmail(order).catch(console.error)

    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    await rollbackStock(decremented)
    res.status(500).json({ message: 'Failed to create order' })
  }
}

// Helper: stock decrement cheytha products-inte stock thirike koottuka
async function rollbackStock(decremented) {
  for (const { productId, quantity } of decremented) {
    await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
  }
}

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'images image')
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}

// GET /api/orders/:id — single order fetch cheyyuka (own order maathram)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' })
    }

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'images image name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: 'after', runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' })
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Ee order ee user-inte thanne aano
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' })
    }



    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const a = Buffer.from(expected)
    const b = Buffer.from(razorpay_signature)
    const valid = a.length === b.length && crypto.timingSafeEqual(a, b)

    if (!valid) {
      order.paymentStatus = 'failed'
      await order.save()
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    let justPaid = false
    let finalOrder = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, paymentStatus: 'pending' },
      { 
        paymentStatus: 'paid', 
        razorpayPaymentId: razorpay_payment_id, 
        razorpaySignature: razorpay_signature, 
        paidAt: new Date() 
      },
      { returnDocument: 'after' }
    )

    if (!finalOrder) {
      finalOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id })
      if (finalOrder && finalOrder.paymentStatus !== 'paid') {
        return res.status(409).json({ message: 'Order is no longer pending and cannot be paid. Please contact support.' })
      }
    } else {
      justPaid = true
    }
    
    if (justPaid) {
      sendOrderConfirmationEmail(finalOrder).catch(console.error)
    }

    // Razorpay order-il cart clear cheythirunnilla, ippo clear cheyyunnu
    const cart = await Cart.findOne({ user: req.user.id })
    if (cart) {
      cart.items = []
      await cart.save()
    }

    return res.status(200).json({ message: 'Payment verified', order: finalOrder })
  } catch (error) {
    console.error('verifyPayment error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}