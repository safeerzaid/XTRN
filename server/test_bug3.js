import mongoose from 'mongoose';
import 'dotenv/config';
import { updateProduct } from './controllers/productController.js';
import Product from './models/Product.js';

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const p = await Product.findOne();
  if (!p) {
    console.log("No product");
    process.exit(0);
  }
  const originalName = p.name;
  
  const req = {
    params: { id: p._id.toString() },
    body: {
      ...JSON.parse(JSON.stringify(p)),
      name: originalName + " edited string ID",
    }
  };
  
  const res = {
    status: (code) => ({
      json: (data) => console.log(code, data)
    }),
    json: (data) => console.log(200, data)
  };
  
  await updateProduct(req, res);
  
  const updated = await Product.findById(p._id);
  console.log("Original:", originalName);
  console.log("After update in DB:", updated.name);
  
  process.exit(0);
}
test();
