const express = require('express');
const router = express.Router();
const {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getGallery);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('gallery').single('image'), createGalleryItem);
router.put('/:id', authMiddleware, adminOnly, upload('gallery').single('image'), updateGalleryItem);
router.delete('/:id', authMiddleware, adminOnly, deleteGalleryItem);

module.exports = router;
