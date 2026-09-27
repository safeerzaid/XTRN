import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

async function testWishlist() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const baseUrl = 'http://localhost:5000/api';
  
  const user = await db.collection('users').findOne({ isVerified: true });
  if (!user) process.exit(1);
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const headers = { 'Authorization': `Bearer ${token}` };

  const product = await db.collection('products').findOne({});
  const productId = product._id.toString();

  // Add to wishlist
  const resAdd = await fetch(`${baseUrl}/wishlist/${productId}`, { method: 'POST', headers });
  console.log(`Add -> Status: ${resAdd.status}`);
  
  // Get wishlist
  const resGet = await fetch(`${baseUrl}/wishlist`, { headers });
  const getData = await resGet.json();
  console.log(`Get -> Count: ${getData.products?.length}, ID matches: ${getData.products?.[0]?._id === productId}`);
  
  // Remove
  const resRm = await fetch(`${baseUrl}/wishlist/${productId}`, { method: 'DELETE', headers });
  console.log(`Remove -> Status: ${resRm.status}`);
  
  // Get again
  const resGet2 = await fetch(`${baseUrl}/wishlist`, { headers });
  const getData2 = await resGet2.json();
  console.log(`Get again -> Count: ${getData2.products?.length}`);

  process.exit(0);
}

testWishlist().catch(console.error);
