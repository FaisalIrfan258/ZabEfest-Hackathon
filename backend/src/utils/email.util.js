const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send password reset email
 * @param {String} to - Recipient email
 * @param {String} resetToken - Password reset token
 * @param {String} name - User name
 * @returns {Promise} Nodemailer send mail promise
 */
exports.sendPasswordResetEmail = async (to, resetToken, name) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <h1>Hello ${name}</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  const transporter = createTransporter();
  return await transporter.sendMail(message);
};

/**
 * Send password reset success email
 * @param {String} to - Recipient email
 * @param {String} name - User name
 * @returns {Promise} Nodemailer send mail promise
 */
exports.sendPasswordResetSuccessEmail = async (to, name) => {
  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Successful',
    html: `
      <h1>Hello ${name}</h1>
      <p>Your password has been successfully reset.</p>
      <p>If you did not perform this action, please contact our support team immediately.</p>
    `,
  };

  const transporter = createTransporter();
  return await transporter.sendMail(message);
}; 