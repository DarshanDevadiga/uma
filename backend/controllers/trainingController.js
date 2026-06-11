const { query } = require('../config/db');

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

module.exports = {
  getTrainingPrograms,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram
};
