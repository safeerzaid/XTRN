import 'dotenv/config';
import helmet from "helmet"
import cookieParser from "cookie-parser";
import { sanitizeInput } from './middleware/sanitize.js'

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cartRoutes from "./routes/CartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { startCancelStaleOrdersJob } from "./jobs/cancelStaleOrders.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(helmet())

// Webhook: express.json()-inu MUNPE aayirikkanam (raw body venam)
app.use("/api/payments", paymentRoutes);

app.use(express.json());
app.use(cookieParser())
app.use(sanitizeInput)

connectDB();
startCancelStaleOrdersJob();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ 
    message: status < 500 ? 'Bad Request' : 'Internal Server Error' 
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});