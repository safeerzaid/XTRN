import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    name: String,
    price: Number,
    size: String,
    quantity: Number
  }],

  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order