import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { productSchema } from '../validators/productValidator.js';

export const createProduct = async (req, res) => {
  try {
    const result = productSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid product data', errors: result.error.errors });
    }

    const product = new Product(result.data);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const result = productSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: 'Invalid product data', errors: result.error.errors });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      result.data,
      { returnDocument: 'after', runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
