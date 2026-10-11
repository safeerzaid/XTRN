import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  topic: { 
    type: String, 
    required: true,
    enum: ['Order', 'Payment', 'Shipping', 'Returns', 'Account', 'Product', 'Other']
  },
  orderId: { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ['new', 'resolved'],
    default: 'new'
  }
}, { timestamps: true });

contactMessageSchema.index({ createdAt: -1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
