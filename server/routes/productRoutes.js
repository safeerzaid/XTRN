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
    res.status(500).json({ message: 'Failed to fetch products', error: error.message })
  }
})


// GET /api/products/:id — single product detail
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message })
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
      message: 'Failed to create product',
      error: error.message
    })
  }
})


export default router