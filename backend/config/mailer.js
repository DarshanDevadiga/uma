const nodemailer = require('nodemailer');
require('dotenv').config();

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
    html: options.html
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

module.exports = {
  sendMail
};
