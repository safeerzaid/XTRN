import dotenv from "dotenv";
dotenv.config();
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

const app = express();

app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}));
app.use(helmet())
app.use(express.json());
app.use(cookieParser())
app.use(sanitizeInput)

connectDB();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});