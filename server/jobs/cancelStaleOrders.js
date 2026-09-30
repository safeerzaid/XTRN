import cron from 'node-cron';
import Order from '../models/Order.js';
import { restoreOrderStock } from '../utils/stockUtils.js';

export const startCancelStaleOrdersJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      const staleOrders = await Order.find({
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        createdAt: { $lt: thirtyMinutesAgo }
      });
      
      let cancelledCount = 0;

      for (const o of staleOrders) {
        try {
          const order = await Order.findOneAndUpdate(
            { _id: o._id, paymentStatus: 'pending' },
            { paymentStatus: 'cancelled', status: 'cancelled' },
            { returnDocument: 'after' }
          );
          
          if (order) {
            await restoreOrderStock(order);
            cancelledCount++;
          }
        } catch (innerError) {
          console.error(`Failed to cancel stale order ${o._id}:`, innerError);
        }
      }

      if (cancelledCount > 0) {
        console.log(`Cron: Cancelled ${cancelledCount} stale Razorpay orders and restored stock.`);
      }
    } catch (error) {
      console.error('Error in cancelStaleOrders cron job:', error);
    }
  });
};
