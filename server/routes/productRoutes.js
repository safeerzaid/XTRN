import express from 'express'
import Product from '../models/Product.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()


// GET /api/products
// Supports query params: sport, department, category, section, subcategory
// department is an array field in the schema — MongoDB automatically matches
// { department: 'men' } against documents where the array contains 'men'
router.get('/', async (req, res) => {
  try {
    const { sport, department, category, section, subcategory, featuredCategory } = req.query
    const filter = {} 
    
    if (sport) {
      if (sport.toLowerCase().endsWith('-shoes')) {
        const baseSport = sport.substring(0, sport.length - 6) // e.g. 'running'
        filter.$or = [
          { sport: { $regex: new RegExp(`^${baseSport}$`, 'i') }, section: 'Footwear' },
          { category: { $regex: new RegExp(`^${baseSport} shoes$`, 'i') } }
        ]
      } else {
        filter.$or = [
          { sport: { $regex: new RegExp(`^${sport}$`, 'i') } },
          { category: { $regex: new RegExp(`^${sport} shoes$`, 'i') } }
        ]
      }
    }
    if (department) {
      filter.department = department
      if (department === 'men' || department === 'women') {
        filter.gender = department // Strictly only men or women
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
    res.status(500).json({ message: 'Failed to fetch products' })
  }
})


// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({
        products: [],
        page: 1,
        totalPages: 0,
        totalProducts: 0
      });
    }

    // Escape regex characters from user input
    const sanitizedQuery = q.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
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
    res.status(500).json({ message: 'Search failed' });
  }
});


// GET /api/products/:id — single product detail
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' })
  }
})


// POST /api/products — create a new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' })
    }

    const product = new Product(req.body)
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create product'
    })
  }
})


export default router