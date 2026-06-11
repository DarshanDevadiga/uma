const { query } = require('../config/db');

// Get all Publications (Public, with optional type filter)
const getPublications = async (req, res) => {
  const { type } = req.query;

  try {
    let queryStr = 'SELECT * FROM publications';
    const params = [];

    if (type) {
      queryStr += ' WHERE type = ?';
      params.push(type);
    }

    queryStr += ' ORDER BY id DESC';
    const publications = await query(queryStr, params);
    res.json(publications);
  } catch (error) {
    console.error('getPublications error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Publication (Admin)
const createPublication = async (req, res) => {
  const { title, type, description, link_url } = req.body;
  let image_url = null;

  if (!title || !type || !description || !link_url) {
    return res.status(400).json({ message: 'Required fields: title, type, description, link_url' });
  }

  if (req.file) {
    image_url = `/uploads/publications/${req.file.filename}`;
  }

  try {
    const result = await query(
      `INSERT INTO publications (title, type, description, link_url, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [title, type, description, link_url, image_url]
    );

    res.status(201).json({
      message: 'Publication created successfully',
      publicationId: result.insertId
    });
  } catch (error) {
    console.error('createPublication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Publication (Admin)
const updatePublication = async (req, res) => {
  const { id } = req.params;
  const { title, type, description, link_url } = req.body;

  try {
    const publications = await query('SELECT image_url FROM publications WHERE id = ?', [id]);
    if (publications.length === 0) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    let image_url = publications[0].image_url;
    if (req.file) {
      image_url = `/uploads/publications/${req.file.filename}`;
    }

    await query(
      `UPDATE publications 
       SET title = ?, type = ?, description = ?, link_url = ?, image_url = ?
       WHERE id = ?`,
      [title, type, description, link_url, image_url, id]
    );

    res.json({ message: 'Publication updated successfully' });
  } catch (error) {
    console.error('updatePublication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Publication (Admin)
const deletePublication = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM publications WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Publication not found' });
    }
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('deletePublication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication
};
