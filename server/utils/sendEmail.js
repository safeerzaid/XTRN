import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER || process.env.EMAIL_FROM,
      pass: process.env.EMAIL_APP_PASSWORD
    },
    tls: { rejectUnauthorized: false }
  });

  const fromAddress = `"XTRN Store" <${process.env.EMAIL_FROM}>`;
  
  const textVersion = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim() + '\n\nThanks,\nThe XTRN Store Team\nsupport@xtrnstore.com';

  const htmlWrapper = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">
        <h2 style="color: #222;">XTRN Store</h2>
      </div>
      <div>
        ${html}
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
        <p>Best regards,<br>The XTRN Store Team</p>
        <p>Need help? Contact us at support@xtrnstore.com</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      replyTo: 'support@xtrnstore.com',
      to,
      subject,
      text: textVersion,
      html: htmlWrapper
    });
  } catch (err) {
    throw err;
  }
}

export default sendEmail