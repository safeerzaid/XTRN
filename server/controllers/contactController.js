import ContactMessage from '../models/ContactMessage.js';
import { contactSchema } from '../validators/contactValidator.js';
import sendEmail from '../utils/sendEmail.js';

export const submitContact = async (req, res) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { name, email, topic, orderId, message, website } = parsed.data;

    // Honeypot check
    if (website && website.trim() !== '') {
      return res.status(201).json({ message: "Thanks for reaching out. We will get back to you soon." });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      topic,
      orderId,
      message
    });

    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };
    
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'xtrnstore@gmail.com';

    sendEmail({
      to: receiverEmail,
      subject: `[XTRN Contact] ${topic} from ${name}`,
      replyTo: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Topic:</strong> ${topic}</p>
        ${orderId ? `<p><strong>Order ID:</strong> ${orderId}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
          ${safeMessage}
        </div>
      `
    }).catch(err => {
      console.error('Failed to send contact notification email:', err);
    });

    sendEmail({
      to: email,
      subject: `We got your message - XTRN`,
      html: `<p>Hi ${name},</p><p>We got your message. Our team will get back to you soon.</p>`
    }).catch(err => {
      console.error('Failed to send contact auto-reply email:', err);
    });

    return res.status(201).json({ message: "Thanks for reaching out. We will get back to you soon." });
  } catch (error) {
    console.error('submitContact error:', error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
