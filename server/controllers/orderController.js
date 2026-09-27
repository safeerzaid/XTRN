import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import User from '../models/User.js'

export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before placing an order.' });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

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

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount
    })

    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' })
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