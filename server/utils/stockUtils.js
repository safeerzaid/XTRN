import Product from '../models/Product.js';

/**
 * Restores stock for an order's items.
 * Uses atomic $inc to safely add back the reserved quantity.
 */
export const restoreOrderStock = async (order) => {
  if (!order || !order.items || !Array.isArray(order.items)) return;
  
  for (const item of order.items) {
    if (item.product && item.quantity) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }
  }
};
