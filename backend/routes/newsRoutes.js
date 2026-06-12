const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  deleteNewsImage
} = require('../controllers/newsController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('news').fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 15 }]), createNews);
router.put('/:id', authMiddleware, adminOnly, upload('news').fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 15 }]), updateNews);
router.delete('/:id', authMiddleware, adminOnly, deleteNews);
router.delete('/images/:imageId', authMiddleware, adminOnly, deleteNewsImage);

module.exports = router;
