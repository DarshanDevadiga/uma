const { query } = require('../config/db');

// Get all Committees (Public)
const getCommittees = async (req, res) => {
  try {
    const committees = await query('SELECT * FROM committees ORDER BY display_order ASC, name ASC');
    res.json(committees);
  } catch (error) {
    console.error('getCommittees error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Committee (Admin)
const createCommittee = async (req, res) => {
  const { name, description, icon, display_order } = req.body;
  let image_url = null;

  if (!name || !description) {
    return res.status(400).json({ message: 'Required fields: name, description' });
  }

  if (req.file) {
    image_url = `/uploads/committees/${req.file.filename}`;
  }

  try {
    const result = await query(
      `INSERT INTO committees (name, description, icon, image_url, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, icon || 'BookOpen', image_url, parseInt(display_order) || 0]
    );

    res.status(201).json({
      message: 'Committee created successfully',
      committeeId: result.insertId
    });
  } catch (error) {
    console.error('createCommittee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Committee (Admin)
const updateCommittee = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, display_order } = req.body;

  try {
    const committees = await query('SELECT image_url FROM committees WHERE id = ?', [id]);
    if (committees.length === 0) {
      return res.status(404).json({ message: 'Committee not found' });
    }

    let image_url = committees[0].image_url;
    if (req.file) {
      image_url = `/uploads/committees/${req.file.filename}`;
    }

    await query(
      `UPDATE committees 
       SET name = ?, description = ?, icon = ?, image_url = ?, display_order = ?
       WHERE id = ?`,
      [name, description, icon || 'BookOpen', image_url, parseInt(display_order) || 0, id]
    );

    res.json({ message: 'Committee updated successfully' });
  } catch (error) {
    console.error('updateCommittee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Committee (Admin)
const deleteCommittee = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM committees WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Committee not found' });
    }
    res.json({ message: 'Committee deleted successfully' });
  } catch (error) {
    console.error('deleteCommittee error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee
};
