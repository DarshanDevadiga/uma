const express = require('express');
const router = express.Router();
const {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication
} = require('../controllers/publicationController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getPublications);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('publications').single('image'), createPublication);
router.put('/:id', authMiddleware, adminOnly, upload('publications').single('image'), updatePublication);
router.delete('/:id', authMiddleware, adminOnly, deletePublication);

module.exports = router;
