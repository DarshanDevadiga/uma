const { query } = require('../config/db');
const { sendMail, sendRichMail } = require('../config/mailer');

// Get Awards Categories (Public)
const getAwards = async (req, res) => {
  try {
    const awards = await query('SELECT * FROM awards ORDER BY id ASC');
    res.json(awards);
  } catch (error) {
    console.error('getAwards error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Nominate for Award (Public Form with Document Upload)
const nominateAward = async (req, res) => {
  const { award_id, nominee_name, organization, email, phone } = req.body;

  if (!award_id || !nominee_name || !organization || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Nomination document file is required' });
  }

  const document_url = `/uploads/awards/${req.file.filename}`;

  try {
    const awards = await query('SELECT name FROM awards WHERE id = ?', [award_id]);
    if (awards.length === 0) {
      return res.status(404).json({ message: 'Award category not found' });
    }
    const award = awards[0];

    const result = await query(
      `INSERT INTO award_nominations (award_id, nominee_name, organization, email, phone, document_url, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [award_id, nominee_name, organization, email, phone, document_url]
    );

    // Send confirmation email
    await sendRichMail({
      to: email,
      subject: `Award Nomination Received: ${award.name}`,
      text: `Dear ${nominee_name},\n\nThank you for applying! We have received your nomination for the "${award.name}" under the organization "${organization}".\n\nOur awards review committee will evaluate your nomination, and we will contact you if any further details are required.\n\nBest regards,\nUdupi Management Association`,
      bodyHtml: `<p>Dear <strong>${nominee_name}</strong>,</p>
                 <p>Thank you for applying! We have received your nomination for the <strong>"${award.name}"</strong> under the organization <strong>"${organization}"</strong>.</p>
                 <p>Our awards review committee will evaluate your nomination, and we will contact you if any further details are required.</p>`
    }, req);

    res.status(201).json({
      message: 'Nomination submitted successfully.',
      nominationId: result.insertId
    });
  } catch (error) {
    console.error('nominateAward error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Nominations (Admin Dashboard)
const getNominations = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const awardId = req.query.awardId;
  const status = req.query.status;
  const search = req.query.search || '';

  try {
    let queryStr = `
      SELECT an.*, a.name as award_name 
      FROM award_nominations an
      JOIN awards a ON an.award_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (awardId) {
      queryStr += ' AND an.award_id = ?';
      params.push(awardId);
    }

    if (status) {
      queryStr += ' AND an.status = ?';
      params.push(status);
    }

    if (search) {
      queryStr += ' AND (an.nominee_name LIKE ? OR an.organization LIKE ? OR an.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get count
    const countRes = await query(`SELECT COUNT(*) as total FROM (${queryStr}) as cnt`, params);
    const total = countRes[0].total;

    queryStr += ' ORDER BY an.created_at DESC LIMIT ? OFFSET ?';
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
    console.error('getNominations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Nomination Status (Admin)
const updateNominationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // pending, reviewed

  if (!status || !['pending', 'reviewed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const nominations = await query('SELECT * FROM award_nominations WHERE id = ?', [id]);
    if (nominations.length === 0) {
      return res.status(404).json({ message: 'Nomination not found' });
    }

    await query('UPDATE award_nominations SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Nomination status updated to ${status}` });
  } catch (error) {
    console.error('updateNominationStatus error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Award Category
const createAward = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  try {
    const result = await query(
      'INSERT INTO awards (name, description) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({
      message: 'Award category created successfully',
      awardId: result.insertId
    });
  } catch (error) {
    console.error('createAward error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Award Category
const updateAward = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await query(
      'UPDATE awards SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Award not found' });
    }

    res.json({ message: 'Award category updated successfully' });
  } catch (error) {
    console.error('updateAward error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Award Category
const deleteAward = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM awards WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Award not found' });
    }
    res.json({ message: 'Award category deleted successfully' });
  } catch (error) {
    console.error('deleteAward error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Nomination
const deleteNomination = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM award_nominations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Nomination not found' });
    }
    res.json({ message: 'Nomination deleted successfully' });
  } catch (error) {
    console.error('deleteNomination error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAwards,
  nominateAward,
  getNominations,
  updateNominationStatus,
  createAward,
  updateAward,
  deleteAward,
  deleteNomination
};
