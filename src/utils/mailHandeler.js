import nodemailer from 'nodemailer';
import { ApiError } from './ApiError.js';

export async function sendMail({ recipientEmail, subject, emailBody }) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,      
      secure: false,  
      auth: {
        user: process.env.GMAIL_USER,      
        pass: process.env.GMAIL_APP_PASS,  
      },
    });

    const mailOptions = {
      from: `"Herlegal Support" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject,
      html: emailBody,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new ApiError('Failed to send email', 500);
  }
}