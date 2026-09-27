import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || process.env.EMAIL_FROM,
    pass: process.env.EMAIL_APP_PASSWORD,
  }
})

export default transporter;