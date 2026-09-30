import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  phone: { type: String, trim: true, required: true },
  addressLine1: { type: String, trim: true, required: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, trim: true, required: true },
  state: { type: String, trim: true, required: true },
  pincode: { type: String, trim: true, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: {
    type: [orderItemSchema],
    validate: [v => Array.isArray(v) && v.length > 0, 'Order must contain at least one item']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'razorpay'],
    required: true,
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  // Gateway specific tracking
  razorpayOrderId: { 
    type: String, 
    index: true,
    sparse: true 
  },
  razorpayPaymentId: { 
    type: String, 
    index: true,
    sparse: true
  },
  razorpaySignature: { type: String },
  paidAt: { type: Date }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order