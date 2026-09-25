import express from 'express';
import mongoose from 'mongoose';
import authmiddleWare from '../middleware/authMiddleware.js';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/wishlist
router.get('/', authmiddleWare, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'products',
        select: 'name price originalPrice images discount brand'
      });

    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }

    // Filter out null products in case they were deleted from the database
    const validProducts = wishlist.products.filter(p => p != null);

    return res.status(200).json({ products: validProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/wishlist/:productId
router.post('/:productId', authmiddleWare, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }

    if (wishlist.products.length >= 100 && !wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Wishlist cannot exceed 100 items' });
    }

    await Wishlist.updateOne(
      { user: req.user.id },
      { $addToSet: { products: productId } },
      { upsert: true }
    );

    return res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', authmiddleWare, async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    await Wishlist.updateOne(
      { user: req.user.id },
      { $pull: { products: productId } }
    );

    return res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
