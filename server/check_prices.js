import mongoose from 'mongoose';
import 'dotenv/config';

async function checkPrices() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  const products = await db.collection('products').find({}).toArray();
  const prices = products.map(p => p.price).filter(p => p != null);
  
  if (prices.length === 0) {
    console.log("No prices found.");
    process.exit(0);
  }
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const countWithDecimals = prices.filter(p => !Number.isInteger(p)).length;
  
  console.log(`Count: ${prices.length}`);
  console.log(`Min: ${min}`);
  console.log(`Max: ${max}`);
  console.log(`With decimals: ${countWithDecimals}`);
  console.log(`Samples: ${prices.slice(0, 10).join(', ')}`);
  
  process.exit(0);
}
checkPrices();
