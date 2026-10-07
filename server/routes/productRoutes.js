import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
const router = express.Router()


// GET /api/products
// Supports query params: sport, department, category, section, subcategory
// department is an array field in the schema — MongoDB automatically matches
// { department: 'men' } against documents where the array contains 'men'
router.get('/', async (req, res) => {
  try {
    const { sport, department, category, section, subcategory, featuredCategory } = req.query
    const stringParams = [sport, department, category, section, subcategory, featuredCategory];
    if (stringParams.some(p => p !== undefined && typeof p !== 'string')) {
      return res.status(400).json({ message: 'Invalid query parameter format' });
    }

    const filter = {} 
    
    if (sport) {
      const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const safeSport = escapeRegex(sport);
      
      if (sport.toLowerCase().endsWith('-shoes') && sport.length > 6) {
        const baseSport = sport.substring(0, sport.length - 6); // e.g. 'running'
        const safeBaseSport = escapeRegex(baseSport);
        
        filter.$or = [
          { sport: { $regex: new RegExp(`^${safeBaseSport}$`, 'i') }, section: 'Footwear' },
          { category: { $regex: new RegExp(`^${safeBaseSport} shoes$`, 'i') } }
        ];
      } else {
        filter.$or = [
          { sport: { $regex: new RegExp(`^${safeSport}$`, 'i') } },
          { category: { $regex: new RegExp(`^${safeSport} shoes$`, 'i') } }
        ];
      }
    }
    if (department) {
      filter.department = department
      if (department === 'men' || department === 'women') {
        filter.gender = { $in: [department, 'unisex'] } // Allow unisex products to show in men/women departments
      }
    }
    if (category)    filter.category    = category
    if (section)     filter.section     = section
    if (subcategory) filter.subcategory = subcategory

    // Featured Collection homepage cards — map to the right MongoDB filter
    if (featuredCategory) {
      const fc = featuredCategory.toLowerCase()
      if (fc === 'shoes') {
        filter.section = 'Footwear'
      } else if (fc === 'apparel') {
        filter.department = { $in: ['men', 'women'] }
        filter.section    = { $ne: 'Footwear' }
        filter.gender     = { $ne: 'unisex' } // Exclude unisex from general apparel
      } else if (fc === 'accessories') {
        filter.department = 'accessories'
      } else if (fc === 'men') {
        filter.department = 'men'
      } else if (fc === 'women') {
        filter.department = 'women'
      }
    }

    const products = await Product.find(filter)
    res.json(products)
  } catch (error) {
    console.error('Fetch products error:', error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})


// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (q !== undefined && typeof q !== 'string') {
      return res.status(400).json({ message: 'Invalid search parameter format' });
    }
    if (typeof q === 'string' && q.length > 100) {
      return res.status(400).json({ message: 'Search query too long' });
    }
    
    if (!q || q.trim() === '') {
      return res.status(200).json({
        products: [],
        page: 1,
        totalPages: 0,
        totalProducts: 0
      });
    }

    const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const sanitizedQuery = escapeRegex(q);
    const regex = new RegExp(sanitizedQuery, 'i');

    const filter = {
      $or: [
        { name: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
        { sport: regex }
      ]
    };

    let pageNum = parseInt(page, 10) || 1;
    if (pageNum < 1) pageNum = 1;
    
    let limitNum = parseInt(limit, 10) || 20;
    if (limitNum < 1) limitNum = 1;
    if (limitNum > 50) limitNum = 50;
    
    const skip = (pageNum - 1) * limitNum;

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).exec(),
      Product.countDocuments(filter).exec()
    ]);

    res.status(200).json({
      products,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalProducts
    });
  } catch (error) {
    console.error('Search products error:', error)
    res.status(500).json({ message: 'Search failed' });
  }
});


// GET /api/products/:id — single product detail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error('Fetch product detail error:', error)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})


// POST /api/products — create a new product
router.post('/', authMiddleware, adminMiddleware, createProduct)

// PUT /api/products/:id — update a product (admin only)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)

// DELETE /api/products/:id — delete a product (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)


export default router