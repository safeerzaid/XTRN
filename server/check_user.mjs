import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({ email: 'safeerzaid4@gmail.com' });
  console.log('--- USER RECORD ---');
  console.log(JSON.stringify(user, null, 2));
  await mongoose.disconnect();
}
run().catch(console.error);
