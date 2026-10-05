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
  const req = {
    params: { id: p._id.toString() },
    body: {
      ...p.toObject(),
      name: p.name + " updated",
      sizes: ["S", "M"],
      images: { default: ["test.jpg"] }
    }
  };
  const res = {
    status: (code) => ({
      json: (data) => console.log(code, JSON.stringify(data))
    }),
    json: (data) => console.log(200, "SUCCESS")
  };
  await updateProduct(req, res);
  process.exit(0);
}
test();
