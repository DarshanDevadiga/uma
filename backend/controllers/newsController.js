const { query } = require('../config/db');

// Get News and Press Releases (Public)
const getNews = async (req, res) => {
  const { type } = req.query; // news, press_release
  const limit = parseInt(req.query.limit) || 12;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    let queryStr = 'SELECT * FROM news';
    const params = [];

    if (type) {
      queryStr += ' WHERE type = ?';
      params.push(type);
    }

    queryStr += ' ORDER BY created_at DESC';

    // Get count
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
    console.error('getNews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get News by ID
const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const newsItems = await query('SELECT * FROM news WHERE id = ?', [id]);
    if (newsItems.length === 0) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json(newsItems[0]);
  } catch (error) {
    console.error('getNewsById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create News (Admin)
const createNews = async (req, res) => {
  const { title, content, type } = req.body;
  let image_url = null;

  if (!title || !content || !type) {
    return res.status(400).json({ message: 'Required fields: title, content, type' });
  }

  if (req.file) {
    image_url = `/uploads/news/${req.file.filename}`;
  }

  try {
    const result = await query(
      `INSERT INTO news (title, content, type, image_url)
       VALUES (?, ?, ?, ?)`,
      [title, content, type, image_url]
    );

    res.status(201).json({
      message: 'News item created successfully',
      newsId: result.insertId
    });
  } catch (error) {
    console.error('createNews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update News (Admin)
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, type } = req.body;

  try {
    const newsItems = await query('SELECT image_url FROM news WHERE id = ?', [id]);
    if (newsItems.length === 0) {
      return res.status(404).json({ message: 'News item not found' });
    }

    let image_url = newsItems[0].image_url;
    if (req.file) {
      image_url = `/uploads/news/${req.file.filename}`;
    }

    await query(
      `UPDATE news 
       SET title = ?, content = ?, type = ?, image_url = ?
       WHERE id = ?`,
      [title, content, type, image_url, id]
    );

    res.json({ message: 'News item updated successfully' });
  } catch (error) {
    console.error('updateNews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete News (Admin)
const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM news WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'News item not found' });
    }
    res.json({ message: 'News item deleted successfully' });
  } catch (error) {
    console.error('deleteNews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
};
