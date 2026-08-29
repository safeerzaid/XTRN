require('dotenv').config()
const express = require('express')
const app = express()
const connectDB = require('./config/db')
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')

app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.use('/api/products', productRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})