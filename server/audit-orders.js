import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

async function testOrders() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  // fetch the first order
  const order = await db.collection('orders').findOne({});
  if (!order) {
    console.log("No orders in DB");
    process.exit(0);
  }
  
  const user = await db.collection('users').findOne({ _id: order.user });
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  const headers = { 'Authorization': `Bearer ${token}` };

  const resGet = await fetch(`http://localhost:5000/api/orders`, { headers });
  const getData = await resGet.json();
  
  console.log(JSON.stringify(getData, null, 2));
  process.exit(0);
}

testOrders().catch(console.error);
