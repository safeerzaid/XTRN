import Cart from '../models/Cart.js'

// GET /api/cart — user-inte cart fetch cheyyuka
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product')

    if (!cart) {
      return res.status(200).json({ items: [] })
    }

    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message })
  }
}


// POST /api/cart — item add cheyyuka
export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body

    if (!productId || !size) {
      return res.status(400).json({ message: 'Product ID and size are required' })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size
    )

    if (existingItem) {
      existingItem.quantity += quantity || 1
    } else {
      cart.items.push({ product: productId, size, quantity: quantity || 1 })
    }

    await cart.save()

    const populatedCart = await cart.populate('items.product')
    res.status(200).json(populatedCart)
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message })
  }
}


// PATCH /api/cart/:itemId — quantity update cheyyuka
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' })
    }

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.id(itemId)

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    item.quantity = quantity
    await cart.save()

    const populatedCart = await cart.populate('items.product')
    res.status(200).json(populatedCart)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item', error: error.message })
  }
}


// DELETE /api/cart/:itemId — item remove cheyyuka
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)
    await cart.save()

    const populatedCart = await cart.populate('items.product')
    res.status(200).json(populatedCart)
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item', error: error.message })
  }
}