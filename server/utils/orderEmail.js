import sendEmail from './sendEmail.js';
import User from '../models/User.js';

const escapeHTML = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

export const sendOrderConfirmationEmail = async (order) => {
  try {
    if (!order) return;

    let user = order.user;
    if (typeof user === 'string' || user instanceof String || (user._id && !user.email)) {
      user = await User.findById(order.user);
    }
    
    if (!user || !user.email) {
      console.error('Cannot send order email: User or email not found');
      return;
    }

    const { shippingAddress, items } = order;
    
    const addressHtml = `
      <p style="margin: 0; color: #555;">
        ${escapeHTML(shippingAddress.fullName)}<br>
        ${escapeHTML(shippingAddress.addressLine1)}<br>
        ${shippingAddress.addressLine2 ? escapeHTML(shippingAddress.addressLine2) + '<br>' : ''}
        ${escapeHTML(shippingAddress.city)}, ${escapeHTML(shippingAddress.state)} ${escapeHTML(shippingAddress.pincode)}<br>
        Phone: ${escapeHTML(shippingAddress.phone)}
      </p>
    `;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${escapeHTML(item.name)}</strong>
          ${item.size ? `<br><small style="color: #666;">Size: ${escapeHTML(item.size)}</small>` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      </tr>
    `).join('');

    const html = `
      <h3 style="color: #222;">Thank you for your order!</h3>
      <p>Your order <strong>#${order._id}</strong> has been successfully placed.</p>
      
      <h4 style="margin-top: 20px; color: #333;">Order Summary</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: left;">Item</th>
            <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: center;">Qty</th>
            <th style="padding: 10px; border-bottom: 2px solid #eee; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #e91e63;">₹${order.totalAmount}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h4 style="margin-top: 0; margin-bottom: 10px; color: #333;">Shipping Address</h4>
        ${addressHtml}
      </div>

      <p style="margin-bottom: 0;"><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay (Paid)'}</p>
    `;

    await sendEmail({
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html
    });

  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
};
