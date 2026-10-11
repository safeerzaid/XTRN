import express from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { looseLimiter } from '../middleware/rateLimiter.js'
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


const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

function buildWordStartFilter(term) {
  const words = term.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return null;
  
  const wordConditions = words.map(word => {
    const escaped = escapeRegex(word);
    const regex = new RegExp('(^|[\\s\\-_/\\\\.,()&\'])' + escaped, 'i');
    return {
      $or: [
        { name: regex },
        { description: regex },
        { brand: regex },
        { category: regex },
        { sport: regex }
      ]
    };
  });
  
  return { $and: wordConditions };
}

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

    const filter = buildWordStartFilter(q) || {};

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


// GET /api/products/suggestions
router.get('/suggestions', looseLimiter, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(200).json({ suggestions: [], total: 0 });
    }
    
    const term = q.trim();
    if (term.length < 1 || term.length > 50) {
      return res.status(200).json({ suggestions: [], total: 0 });
    }

    const filter = buildWordStartFilter(term) || {};

    const products = await Product.find(filter).select('name category _id').lean().limit(30).exec();
    const total = await Product.countDocuments(filter).exec();

    const words = term.trim().split(/\s+/).filter(w => w.length > 0);
    const firstWordRegex = new RegExp('^' + escapeRegex(words[0]), 'i');
    
    const uniqueSuggestions = [];
    const seenNames = new Set();
    for (const p of products) {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        uniqueSuggestions.push({
          text: p.name,
          _id: p._id,
          category: p.category
        });
      }
    }

    uniqueSuggestions.sort((a, b) => {
      const aStarts = firstWordRegex.test(a.text);
      const bStarts = firstWordRegex.test(b.text);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.text.localeCompare(b.text);
    });

    res.status(200).json({
      suggestions: uniqueSuggestions.slice(0, 6),
      total
    });
  } catch (error) {
    console.error('Fetch suggestions error:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions' });
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