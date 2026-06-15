const { query } = require('../config/db');
const { sendMail, sendRichMail } = require('../config/mailer');

// Get Training Programs (Public, optional type filter)
const getTrainingPrograms = async (req, res) => {
  const { type } = req.query;

  try {
    let queryStr = 'SELECT * FROM training_programs';
    const params = [];

    if (type) {
      queryStr += ' WHERE type = ?';
      params.push(type);
    }

    queryStr += ' ORDER BY date DESC, id DESC';
    const programs = await query(queryStr, params);
    res.json(programs);
  } catch (error) {
    console.error('getTrainingPrograms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Training Program (Admin)
const createTrainingProgram = async (req, res) => {
  const { title, description, type, content, date, duration } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({ message: 'Required fields: title, description, type' });
  }

  try {
    const result = await query(
      `INSERT INTO training_programs (title, description, type, content, date, duration)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, type, content || null, date || null, duration || null]
    );

    res.status(201).json({
      message: 'Training program created successfully',
      programId: result.insertId
    });
  } catch (error) {
    console.error('createTrainingProgram error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Training Program (Admin)
const updateTrainingProgram = async (req, res) => {
  const { id } = req.params;
  const { title, description, type, content, date, duration } = req.body;

  try {
    const result = await query(
      `UPDATE training_programs 
       SET title = ?, description = ?, type = ?, content = ?, date = ?, duration = ?
       WHERE id = ?`,
      [title, description, type, content || null, date || null, duration || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    res.json({ message: 'Training program updated successfully' });
  } catch (error) {
    console.error('updateTrainingProgram error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Training Program (Admin)
const deleteTrainingProgram = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM training_programs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    console.error('deleteTrainingProgram error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Register/Book seat for Training Program (Public)
const registerForTraining = async (req, res) => {
  const { id } = req.params; // program_id
  const { name, email, phone, organization } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Required fields: name, email, phone' });
  }

  try {
    // Check if training program exists
    const programs = await query('SELECT * FROM training_programs WHERE id = ?', [id]);
    if (programs.length === 0) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    const program = programs[0];

    // Insert registration
    const result = await query(
      `INSERT INTO training_registrations (program_id, name, email, phone, organization)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, phone, organization || null]
    );

    // Send confirmation email to enrollee
    try {
      await sendRichMail({
        to: email,
        subject: `UMA Booking Confirmation: ${program.title}`,
        text: `Dear ${name},\n\nThank you for registering! Thank you for enrolling in the training program "${program.title}" organized by Udupi Management Association (UMA).\n\nDetails:\n- Program: ${program.title}\n- Duration: ${program.duration || 'N/A'}\n- Start Date: ${program.date ? new Date(program.date).toLocaleDateString('en-IN') : 'N/A'}\n\nOur training coordinator will reach out to you with access links or venue details prior to the session.\n\nBest regards,\nUdupi Management Association`,
        bodyHtml: `<p>Dear <strong>${name}</strong>,</p>
                   <p>Thank you for registering! Thank you for enrolling in the training program "<strong>${program.title}</strong>" organized by the <strong>Udupi Management Association (UMA)</strong>.</p>
                   <p><strong>Program Details:</strong></p>
                   <table style="margin: 20px 0; font-size: 14px; color: #4b5563;">
                     <tr><td style="padding-right: 15px; font-weight: bold;">Program:</td><td>${program.title}</td></tr>
                     <tr><td style="padding-right: 15px; font-weight: bold;">Duration:</td><td>${program.duration || 'N/A'}</td></tr>
                     <tr><td style="padding-right: 15px; font-weight: bold;">Start Date:</td><td>${program.date ? new Date(program.date).toLocaleDateString('en-IN') : 'N/A'}</td></tr>
                   </table>
                   <p>Our training coordinator will reach out to you with session access details prior to the start date.</p>`
      }, req);

      // Send alert email to admin
      await sendMail({
        to: process.env.SMTP_FROM || 'info@udupimanagement.org',
        subject: `New Enrollment: ${program.title}`,
        text: `New booking registration for upskilling program:\n\nProgram: ${program.title}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nOrganization: ${organization || 'N/A'}`,
        html: `<h3>New Upskilling Program Enrollment</h3>
               <p><strong>Program:</strong> ${program.title}</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Organization:</strong> ${organization || 'N/A'}</p>`
      });
    } catch (mailError) {
      console.warn('Mail send failed, but registration was saved:', mailError.message);
    }

    res.status(201).json({
      message: 'Successfully enrolled for the upskilling program!',
      registrationId: result.insertId
    });
  } catch (error) {
    console.error('registerForTraining error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Training Registrations (Admin)
const getTrainingRegistrations = async (req, res) => {
  const { programId } = req.query;

  try {
    let queryStr = `
      SELECT tr.*, tp.title as program_title, tp.type as program_type
      FROM training_registrations tr
      JOIN training_programs tp ON tr.program_id = tp.id
    `;
    const params = [];

    if (programId) {
      queryStr += ' WHERE tr.program_id = ?';
      params.push(programId);
    }

    queryStr += ' ORDER BY tr.created_at DESC';
    const registrations = await query(queryStr, params);
    res.json(registrations);
  } catch (error) {
    console.error('getTrainingRegistrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Training Registration (Admin)
const deleteTrainingRegistration = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM training_registrations WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('deleteTrainingRegistration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTrainingPrograms,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  registerForTraining,
  getTrainingRegistrations,
  deleteTrainingRegistration
};
