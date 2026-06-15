const { query } = require('../config/db');

// Get all Activities (Public, sorted by display_order)
const getActivities = async (req, res) => {
  try {
    const activities = await query('SELECT * FROM activities ORDER BY display_order ASC, title ASC');
    
    // Normalize row keys to lowercase to avoid issues with capitalized fields (like Id or Icon) in the database
    const normalized = (activities || []).map(row => {
      const normRow = {};
      for (const key of Object.keys(row)) {
        normRow[key.toLowerCase()] = row[key];
      }
      return normRow;
    });

    res.json(normalized);
  } catch (error) {
    console.error('getActivities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Activity (Admin)
const createActivity = async (req, res) => {
  const { title, subtitle, description, icon, color, display_order } = req.body;

  if (!title || !subtitle || !description) {
    return res.status(400).json({ message: 'Required fields: title, subtitle, description' });
  }

  try {
    const result = await query(
      `INSERT INTO activities (title, subtitle, description, icon, color, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title, 
        subtitle, 
        description, 
        icon || 'Calendar', 
        color || 'text-brand-primary', 
        parseInt(display_order) || 0
      ]
    );

    res.status(201).json({
      message: 'Activity created successfully',
      activityId: result.insertId
    });
  } catch (error) {
    console.error('createActivity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Activity (Admin)
const updateActivity = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, description, icon, color, display_order } = req.body;

  if (!title || !subtitle || !description) {
    return res.status(400).json({ message: 'Required fields: title, subtitle, description' });
  }

  try {
    const checkExist = await query('SELECT id FROM activities WHERE id = ?', [id]);
    if (checkExist.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await query(
      `UPDATE activities 
       SET title = ?, subtitle = ?, description = ?, icon = ?, color = ?, display_order = ?
       WHERE id = ?`,
      [
        title, 
        subtitle, 
        description, 
        icon || 'Calendar', 
        color || 'text-brand-primary', 
        parseInt(display_order) || 0, 
        id
      ]
    );

    res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    console.error('updateActivity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Activity (Admin)
const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM activities WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('deleteActivity error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity
};
