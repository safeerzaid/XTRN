import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

async function testProfile() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const baseUrl = 'http://localhost:5000/api';
  
  // 1. Fetch user from DB
  const user = await db.collection('users').findOne({ isVerified: true });
  if (!user) {
    console.log("No verified user found");
    process.exit(1);
  }
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  
  // 3. Fetch profile with auth
  const resAuth = await fetch(`${baseUrl}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const authData = await resAuth.json();
  console.log(`GET /profile auth -> Status: ${resAuth.status}, Name: ${authData.user?.name}, Pass exposed: ${!!authData.user?.password}`);
  
  // 4. Update profile
  const resUpdate = await fetch(`${baseUrl}/profile`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Updated Name', role: 'admin', email: 'hacked@hack.com' }) // malicious attempt
  });
  const updateData = await resUpdate.json();
  console.log(`PATCH /profile -> Status: ${resUpdate.status}, Name: ${updateData.user?.name}, Role: ${updateData.user?.role}, Email: ${updateData.user?.email}`);
  
  process.exit(0);
}

testProfile().catch(console.error);
