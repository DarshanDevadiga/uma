const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getNews);
router.get('/:id', getNewsById);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('news').single('image'), createNews);
router.put('/:id', authMiddleware, adminOnly, upload('news').single('image'), updateNews);
router.delete('/:id', authMiddleware, adminOnly, deleteNews);

module.exports = router;
