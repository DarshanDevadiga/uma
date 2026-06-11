const { query } = require('../config/db');
const { sendMail } = require('../config/mailer');

// Get Membership Types
const getMembershipTypes = async (req, res) => {
  try {
    const types = await query('SELECT * FROM membership_types ORDER BY fee ASC');
    res.json(types);
  } catch (error) {
    console.error('getMembershipTypes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register for Membership (Public Form)
const registerMembership = async (req, res) => {
  const { name, email, phone, address, occupation, membershipTypeId } = req.body;

  if (!name || !email || !phone || !address || !occupation || !membershipTypeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if membership type exists
    const types = await query('SELECT name FROM membership_types WHERE id = ?', [membershipTypeId]);
    if (types.length === 0) {
      return res.status(400).json({ message: 'Invalid membership type selected' });
    }

    // Insert membership record
    const result = await query(
      `INSERT INTO memberships (name, email, phone, address, occupation, membership_type_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [name, email, phone, address, occupation, membershipTypeId]
    );

    // Send confirmation email
    await sendMail({
      to: email,
      subject: 'UMA Membership Application Received',
      text: `Dear ${name},\n\nThank you for applying for the ${types[0].name} at Udupi Management Association (UMA).\n\nYour application has been received and is currently under review by our administration team. You will receive an update once it is approved.\n\nBest regards,\nUdupi Management Association`,
      html: `<p>Dear <strong>${name}</strong>,</p>
             <p>Thank you for applying for the <strong>${types[0].name}</strong> at Udupi Management Association (UMA).</p>
             <p>Your application has been received and is currently under review by our administration team. You will receive an email update once it is approved.</p>
             <p>Best regards,<br/><strong>Udupi Management Association</strong></p>`
    });

    res.status(201).json({
      message: 'Membership application submitted successfully. Admin review pending.',
      membershipId: result.insertId
    });
  } catch (error) {
    console.error('registerMembership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all Memberships (Admin Dashboard with pagination, filter, search)
const getMemberships = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status; // pending, approved, rejected
  const typeId = req.query.typeId;
  const search = req.query.search || '';

  try {
    let queryStr = `
      SELECT m.*, mt.name as membership_type_name, mt.fee as membership_type_fee
      FROM memberships m
      JOIN membership_types mt ON m.membership_type_id = mt.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      queryStr += ' AND m.status = ?';
      params.push(status);
    }

    if (typeId) {
      queryStr += ' AND m.membership_type_id = ?';
      params.push(typeId);
    }

    if (search) {
      queryStr += ' AND (m.name LIKE ? OR m.email LIKE ? OR m.phone LIKE ? OR m.occupation LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count for pagination
    const countQueryStr = `SELECT COUNT(*) as total FROM (${queryStr}) as count_table`;
    const countResult = await query(countQueryStr, params);
    const total = countResult[0].total;

    // Add ordering and pagination
    queryStr += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
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
    console.error('getMemberships error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Membership details (Admin)
const updateMembership = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, occupation, membership_type_id } = req.body;

  try {
    await query(
      `UPDATE memberships 
       SET name = ?, email = ?, phone = ?, address = ?, occupation = ?, membership_type_id = ?
       WHERE id = ?`,
      [name, email, phone, address, occupation, membership_type_id, id]
    );

    res.json({ message: 'Membership details updated successfully' });
  } catch (error) {
    console.error('updateMembership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Approve or Reject Membership (Admin Approval Flow)
const updateMembershipStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // approved, rejected

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const membershipsList = await query(
      'SELECT m.*, mt.name as type_name FROM memberships m JOIN membership_types mt ON m.membership_type_id = mt.id WHERE m.id = ?',
      [id]
    );

    if (membershipsList.length === 0) {
      return res.status(404).json({ message: 'Membership application not found' });
    }

    const member = membershipsList[0];

    // Update status
    await query('UPDATE memberships SET status = ? WHERE id = ?', [status, id]);

    // Send email alert to user
    const isApproved = status === 'approved';
    const emailSubject = isApproved ? 'UMA Membership Approved!' : 'UMA Membership Application Update';
    const emailText = isApproved
      ? `Dear ${member.name},\n\nWe are pleased to inform you that your application for ${member.type_name} at Udupi Management Association (UMA) has been approved!\n\nWelcome aboard.\n\nBest regards,\nUdupi Management Association`
      : `Dear ${member.name},\n\nThank you for your interest in Udupi Management Association (UMA).\n\nWe regret to inform you that your application for ${member.type_name} could not be approved at this time.\n\nBest regards,\nUdupi Management Association`;

    await sendMail({
      to: member.email,
      subject: emailSubject,
      text: emailText,
      html: `<p>Dear <strong>${member.name}</strong>,</p>
             <p>${isApproved 
                ? `We are pleased to inform you that your application for <strong>${member.type_name}</strong> at Udupi Management Association (UMA) has been <strong>approved</strong>! Welcome aboard.`
                : `Thank you for your interest in Udupi Management Association (UMA). We regret to inform you that your application for <strong>${member.type_name}</strong> could not be approved at this time.`
             }</p>
             <br/>
             <p>Best regards,<br/><strong>Udupi Management Association</strong></p>`
    });

    res.json({ message: `Membership status successfully updated to ${status}` });
  } catch (error) {
    console.error('updateMembershipStatus error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Membership
const deleteMembership = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM memberships WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Membership not found' });
    }
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('deleteMembership error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getMembershipTypes,
  registerMembership,
  getMemberships,
  updateMembership,
  updateMembershipStatus,
  deleteMembership
};
