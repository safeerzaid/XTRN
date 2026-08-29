const mongoose = require('mongoose')
require('dotenv').config()
const fs = require('fs')
const csv = require('csv-parser')          // npm install csv-parser
const Product = require('./models/product') // lowercase 'p' — matches your actual file name

const csvPath = process.argv[2]
if (!csvPath) {
  console.error("Usage: node seedProduct.js path/to/your.csv")
  process.exit(1)
}

const rows = []

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => rows.push(row))
  .on('end', () => {
    const products = rows.map((row) => ({
      name: row.name,
      brand: row.brand,
      description: row.description,
      price: Number(row.price),
      gender: row.gender,
      department: row.department ? row.department.split('|') : [],
      section: row.section,
      category: row.category,
      subcategory: row.subcategory || '',
      sport: row.sport || '',
      sizes: row.sizes ? row.sizes.split('|') : [],
      stock: Number(row.stock),
      images: {
        default: row.images_default ? row.images_default.split('|') : (row.images ? row.images.split('|') : []),
        men: row.images_men ? row.images_men.split('|') : [],
        women: row.images_women ? row.images_women.split('|') : []
      },
      discount: Number(row.discount) || 0,
      rating: Number(row.rating) || 0,
      featured: row.featured === 'true'
    }))

    mongoose.connect(process.env.MONGO_URI).then(async () => {
      try {
        // Wipe all existing products so re-running never creates duplicates
        const deleted = await Product.deleteMany({})
        console.log(` Cleared ${deleted.deletedCount} existing products.`)

        const result = await Product.insertMany(products)
        console.log(` ${result.length} products seeded successfully!`)
      } catch (err) {
        console.error(" Error:", err.message)
      } finally {
        process.exit()
      }
    }).catch((err) => {
      console.error("Connection error:", err)
      process.exit(1)
    })
  })