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
    const newsItem = newsItems[0];
    
    // Fetch associated images
    const images = await query('SELECT id, image_url FROM news_images WHERE news_id = ?', [id]);
    newsItem.images = images.map(img => img.image_url);
    newsItem.galleryImages = images;
    
    res.json(newsItem);
  } catch (error) {
    console.error('getNewsById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create News (Admin)
const createNews = async (req, res) => {
  const { title, content, paragraph1, paragraph2, paragraph3, type } = req.body;
  let image_url = null;

  if (!title || !content || !type) {
    return res.status(400).json({ message: 'Required fields: title, content, type' });
  }

  // Cover image file is under req.files['image'][0]
  if (req.files && req.files['image'] && req.files['image'][0]) {
    image_url = `/uploads/news/${req.files['image'][0].filename}`;
  }

  try {
    // Insert base news item
    const result = await query(
      `INSERT INTO news (title, content, paragraph1, paragraph2, paragraph3, type, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, content, paragraph1 || null, paragraph2 || null, paragraph3 || null, type, image_url]
    );

    const newsId = result.insertId;

    // Handle additional images upload (under req.files['images'])
    if (req.files && req.files['images'] && req.files['images'].length > 0) {
      const imageInsertQueries = req.files['images'].map(file => {
        const path = `/uploads/news/${file.filename}`;
        return query('INSERT INTO news_images (news_id, image_url) VALUES (?, ?)', [newsId, path]);
      });
      await Promise.all(imageInsertQueries);
    }

    res.status(201).json({
      message: 'News item created successfully',
      newsId: newsId
    });
  } catch (error) {
    console.error('createNews error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update News (Admin)
const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, paragraph1, paragraph2, paragraph3, type } = req.body;

  try {
    const newsItems = await query('SELECT image_url FROM news WHERE id = ?', [id]);
    if (newsItems.length === 0) {
      return res.status(404).json({ message: 'News item not found' });
    }

    // Cover image update
    let image_url = newsItems[0].image_url;
    if (req.files && req.files['image'] && req.files['image'][0]) {
      image_url = `/uploads/news/${req.files['image'][0].filename}`;
    }

    // Update news record
    await query(
      `UPDATE news 
       SET title = ?, content = ?, paragraph1 = ?, paragraph2 = ?, paragraph3 = ?, type = ?, image_url = ?
       WHERE id = ?`,
      [title, content, paragraph1 || null, paragraph2 || null, paragraph3 || null, type, image_url, id]
    );

    // Handle additional images uploads
    if (req.files && req.files['images'] && req.files['images'].length > 0) {
      const imageInsertQueries = req.files['images'].map(file => {
        const path = `/uploads/news/${file.filename}`;
        return query('INSERT INTO news_images (news_id, image_url) VALUES (?, ?)', [id, path]);
      });
      await Promise.all(imageInsertQueries);
    }

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

// Delete News Gallery Image (Admin)
const deleteNewsImage = async (req, res) => {
  const { imageId } = req.params;

  try {
    const images = await query('SELECT image_url FROM news_images WHERE id = ?', [imageId]);
    if (images.length === 0) {
      return res.status(404).json({ message: 'News image not found' });
    }

    const imageUrl = images[0].image_url;

    // Delete database record
    await query('DELETE FROM news_images WHERE id = ?', [imageId]);

    // Delete file from disk
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not delete file from disk:', err.message);
      }
    }

    res.json({ message: 'News gallery image deleted successfully' });
  } catch (error) {
    console.error('deleteNewsImage error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  deleteNewsImage
};
