import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 120,
  },
  phone: {
    type: String,
    trim: true,
  },
  sport: {
    type: String,
    required: true,
    enum: ['Running', 'Hiking', 'Gym', 'Football', 'Cricket', 'Other'],
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Competitive'],
  },
  consent: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Member = mongoose.model('Member', memberSchema);

export default Member;
