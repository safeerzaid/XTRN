const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  brand: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    required: true,
  },

  // CHANGED: array instead of single string
  department: [{
    type: String,
    enum: ['men', 'women', 'sports', 'accessories'],
    required: true
  }],

  section: {
    type: String,
    trim: true
  },

  category: {
    type: String,
    trim: true
  },

  subcategory: {
    type: String,
    trim: true
  },

  sport: {
    type: String,
    trim: true
  },

  sizes: [{
    type: String,
    trim: true
  }],

  stock: {
    type: Number,
    default: 0,
    min: 0
  },

 images: {
    default: [{ type: String, trim: true }],
    men: [{ type: String, trim: true }],
    women: [{ type: String, trim: true }]
  },

  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  featured: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  }
)

const Product = mongoose.model('product', productSchema)
module.exports = Product;