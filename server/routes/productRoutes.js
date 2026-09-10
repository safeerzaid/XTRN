import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()


// GET /api/products
// Supports query params: sport, department, category, section, subcategory
// department is an array field in the schema — MongoDB automatically matches
// { department: 'men' } against documents where the array contains 'men'
router.get('/', async (req, res) => {
  try {
    const { sport, department, category, section, subcategory, featuredCategory } = req.query
    const filter = {}
    if (sport)       filter.sport       = { $regex: new RegExp(`^${sport}$`, 'i') }
    if (department)  filter.department  = department
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
      } else if (fc === 'accessories') {
        filter.department = 'accessories'
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
router.post('/', async (req, res) => {
  try {
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