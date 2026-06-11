const { query } = require('../config/db');

// Get all Office Bearers (Public, sorted by display_order)
const getOfficeBearers = async (req, res) => {
  try {
    const bearers = await query('SELECT * FROM office_bearers ORDER BY display_order ASC, name ASC');
    res.json(bearers);
  } catch (error) {
    console.error('getOfficeBearers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Office Bearer (Admin)
const createOfficeBearer = async (req, res) => {
  const { name, designation, organization, display_order, category } = req.body;
  let image_url = '/uploads/bearers/default_bearer.png'; // fallback default image

  if (!name || !designation || !organization || !category) {
    return res.status(400).json({ message: 'Required fields: name, designation, organization, category' });
  }

  if (req.file) {
    image_url = `/uploads/bearers/${req.file.filename}`;
  }

  try {
    const result = await query(
      `INSERT INTO office_bearers (name, designation, organization, image_url, display_order, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, designation, organization, image_url, parseInt(display_order) || 0, category]
    );

    res.status(201).json({
      message: 'Office bearer created successfully',
      bearerId: result.insertId
    });
  } catch (error) {
    console.error('createOfficeBearer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Office Bearer (Admin)
const updateOfficeBearer = async (req, res) => {
  const { id } = req.params;
  const { name, designation, organization, display_order, category } = req.body;

  try {
    const bearers = await query('SELECT image_url FROM office_bearers WHERE id = ?', [id]);
    if (bearers.length === 0) {
      return res.status(404).json({ message: 'Office bearer not found' });
    }

    let image_url = bearers[0].image_url;
    if (req.file) {
      image_url = `/uploads/bearers/${req.file.filename}`;
    }

    await query(
      `UPDATE office_bearers 
       SET name = ?, designation = ?, organization = ?, image_url = ?, display_order = ?, category = ?
       WHERE id = ?`,
      [name, designation, organization, image_url, parseInt(display_order) || 0, category, id]
    );

    res.json({ message: 'Office bearer updated successfully' });
  } catch (error) {
    console.error('updateOfficeBearer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Office Bearer (Admin)
const deleteOfficeBearer = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM office_bearers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Office bearer not found' });
    }
    res.json({ message: 'Office bearer deleted successfully' });
  } catch (error) {
    console.error('deleteOfficeBearer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getOfficeBearers,
  createOfficeBearer,
  updateOfficeBearer,
  deleteOfficeBearer
};
