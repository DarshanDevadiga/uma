const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Create transporter
let transporter = null;

const isSmtpConfigured = () => {
  return (
    process.env.SMTP_USER &&
    process.env.SMTP_USER !== 'your_smtp_username' &&
    process.env.SMTP_PASS &&
    process.env.SMTP_PASS !== 'your_smtp_password'
  );
};

if (isSmtpConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false // Avoid certificate validation failures on local/custom SMTP setups
    }
  });

  // Test the SMTP connection asynchronously on boot
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Verification Failed:', error.message);
      console.log('SMTP Diagnostics (No secrets exposed):');
      console.log({
        SMTP_HOST: process.env.SMTP_HOST || 'Not Set',
        SMTP_PORT: process.env.SMTP_PORT || 'Not Set',
        SMTP_SECURE: parseInt(process.env.SMTP_PORT) === 465,
        SMTP_USER_SET: !!process.env.SMTP_USER,
        SMTP_USER_LENGTH: process.env.SMTP_USER ? process.env.SMTP_USER.length : 0,
        SMTP_PASS_SET: !!process.env.SMTP_PASS,
        SMTP_PASS_LENGTH: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
        SMTP_FROM: process.env.SMTP_FROM || 'Not Set'
      });
    } else {
      console.log('SMTP Server connection successfully verified. Ready to deliver messages!');
    }
  });
} else {
  console.log('SMTP is not configured in .env (or using default placeholders). Emails will run in MOCK mode.');
}

/**
 * Send an email
 * @param {Object} options - { to, subject, text, html }
 */
const sendMail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@udupimanagement.org',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments || []
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('SMTP Email sending failed:', error.message);
      // Fail silently or print error, but do not block user flows
      return { mock: true, error: error.message };
    }
  } else {
    console.log('--- MOCK EMAIL SENT (SMTP NOT CONFIGURED) ---');
    console.log(`To: ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Text: ${mailOptions.text}`);
    console.log('---------------------------------------------');
    return { mock: true };
  }
};

/**
 * Send a rich HTML email with the UMA branded layout (header, logo, body, and footer)
 * @param {Object} options - { to, subject, title, bodyHtml, text }
 * @param {Object} req - Express request object (optional, used to resolve host/protocol dynamically)
 */
const sendRichMail = async ({ to, subject, title, bodyHtml, text }, req) => {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const hasLogo = fs.existsSync(logoPath);

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px 20px; color: #374151; background-color: #ffffff; border: 1px solid #f3f4f6; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f3f4f6; margin-bottom: 24px;">
        <img src="${hasLogo ? 'cid:umalogo' : 'https://raw.githubusercontent.com/DarshanDevadiga/uma/main/backend/public/logo.png'}" alt="UMA Logo" style="height: 70px; object-fit: contain; margin-bottom: 12px;" />
        <h2 style="margin: 0; color: #111827; font-size: 16px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Udupi Management Association</h2>
      </div>
      
      <!-- Content -->
      <div style="font-size: 15px; line-height: 1.6; color: #4b5563; padding: 0 10px;">
        ${bodyHtml}
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0 0 6px 0;">This is an automated notification from the UMA Portal.</p>
        <p style="margin: 0 0 16px 0;">&copy; ${new Date().getFullYear()} Udupi Management Association. All rights reserved.</p>
        <div style="display: inline-block; padding: 8px 16px; border-radius: 8px; background-color: #1f2937; color: #f9fafb; font-weight: 700; font-size: 10px; letter-spacing: 1px; text-transform: uppercase;">
          UMA | Building Leadership Excellence
        </div>
      </div>
    </div>
  `;

  const attachments = [];
  if (hasLogo) {
    attachments.push({
      filename: 'logo.png',
      path: logoPath,
      cid: 'umalogo'
    });
  }

  return sendMail({ to, subject, text, html, attachments });
};

module.exports = {
  sendMail,
  sendRichMail
};
