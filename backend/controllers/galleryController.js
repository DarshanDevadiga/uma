const { query } = require('../config/db');

// Get Gallery Items (Public)
const getGallery = async (req, res) => {
  const { type } = req.query; // photo, video
  const limit = parseInt(req.query.limit) || 24;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  try {
    let queryStr = 'SELECT * FROM gallery';
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
    console.error('getGallery error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Gallery Item (Admin)
const createGalleryItem = async (req, res) => {
  const { title, type, video_url } = req.body;
  let media_url = video_url || null;
  let thumbnail_url = null;

  if (!title || !type) {
    return res.status(400).json({ message: 'Required fields: title, type' });
  }

  if (type === 'photo') {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required for photo type' });
    }
    media_url = `/uploads/gallery/${req.file.filename}`;
  } else if (type === 'video') {
    if (!video_url) {
      return res.status(400).json({ message: 'Video URL link is required for video type' });
    }
    // Extract thumbnail if YouTube
    if (video_url.includes('youtube.com') || video_url.includes('youtu.be')) {
      let videoId = '';
      if (video_url.includes('youtu.be/')) {
        videoId = video_url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else {
        const parts = video_url.split('v=');
        if (parts.length > 1) {
          videoId = parts[1].split(/[&?#]/)[0];
        }
      }
      if (videoId) {
        thumbnail_url = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }
    }
  }

  try {
    const result = await query(
      `INSERT INTO gallery (title, type, media_url, thumbnail_url)
       VALUES (?, ?, ?, ?)`,
      [title, type, media_url, thumbnail_url]
    );

    res.status(201).json({
      message: 'Gallery item created successfully',
      galleryId: result.insertId
    });
  } catch (error) {
    console.error('createGalleryItem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Gallery Item (Admin)
const updateGalleryItem = async (req, res) => {
  const { id } = req.params;
  const { title, type, video_url } = req.body;

  try {
    const items = await query('SELECT media_url, thumbnail_url FROM gallery WHERE id = ?', [id]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    let media_url = items[0].media_url;
    let thumbnail_url = items[0].thumbnail_url;

    if (type === 'photo') {
      if (req.file) {
        media_url = `/uploads/gallery/${req.file.filename}`;
        thumbnail_url = null;
      }
    } else if (type === 'video') {
      if (video_url) {
        media_url = video_url;
        thumbnail_url = null;
        if (video_url.includes('youtube.com') || video_url.includes('youtu.be')) {
          let videoId = '';
          if (video_url.includes('youtu.be/')) {
            videoId = video_url.split('youtu.be/')[1].split(/[?#]/)[0];
          } else {
            const parts = video_url.split('v=');
            if (parts.length > 1) {
              videoId = parts[1].split(/[&?#]/)[0];
            }
          }
          if (videoId) {
            thumbnail_url = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        }
      }
    }

    await query(
      `UPDATE gallery 
       SET title = ?, type = ?, media_url = ?, thumbnail_url = ?
       WHERE id = ?`,
      [title, type, media_url, thumbnail_url, id]
    );

    res.json({ message: 'Gallery item updated successfully' });
  } catch (error) {
    console.error('updateGalleryItem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Gallery Item (Admin)
const deleteGalleryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM gallery WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('deleteGalleryItem error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};
