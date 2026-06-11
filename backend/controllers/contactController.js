const { query } = require('../config/db');
const { sendMail } = require('../config/mailer');

// Submit Contact Form (Public)
const submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Required fields: name, email, subject, message' });
  }

  try {
    // Save to DB
    const result = await query(
      `INSERT INTO contacts (name, email, phone, subject, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || null, subject, message]
    );

    // Send notification email to admin
    await sendMail({
      to: process.env.SMTP_FROM || 'info@udupimanagement.org',
      subject: `New Contact Form Query: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `<h3>New Contact Query Received</h3>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`
    });

    // Send confirmation receipt to sender
    await sendMail({
      to: email,
      subject: 'UMA: Contact Message Received',
      text: `Dear ${name},\n\nThank you for contacting the Udupi Management Association (UMA).\n\nWe have received your message regarding "${subject}" and our office will get back to you shortly.\n\nBest regards,\nUdupi Management Association`,
      html: `<p>Dear <strong>${name}</strong>,</p>
             <p>Thank you for contacting the <strong>Udupi Management Association (UMA)</strong>.</p>
             <p>We have received your message regarding "<strong>${subject}</strong>" and our office will get back to you shortly.</p>
             <p>Best regards,<br/><strong>Udupi Management Association</strong></p>`
    });

    res.status(201).json({
      message: 'Your message has been submitted successfully. We will contact you soon.',
      contactId: result.insertId
    });
  } catch (error) {
    console.error('submitContact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Contact Messages (Admin, searchable & paginated)
const getMessages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    let queryStr = 'SELECT * FROM contacts';
    const params = [];

    if (search) {
      queryStr += ' WHERE name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    queryStr += ' ORDER BY created_at DESC';

    // Count
    const countRes = await query(`SELECT COUNT(*) as total FROM (${queryStr}) as cnt`, params);
    const total = countRes[0].total;

    queryStr += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const data = await query(queryStr, params);

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Contact Message (Admin)
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM contacts WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('deleteMessage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitContact,
  getMessages,
  deleteMessage
};
