import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongooseInstance) => {
      console.log('DataBase is connected');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB connection failed: ', error.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }

  return cached.conn;
};

export default connectDB;