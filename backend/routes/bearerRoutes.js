const express = require('express');
const router = express.Router();
const {
  getOfficeBearers,
  createOfficeBearer,
  updateOfficeBearer,
  deleteOfficeBearer
} = require('../controllers/bearerController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getOfficeBearers);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('bearers').single('image'), createOfficeBearer);
router.put('/:id', authMiddleware, adminOnly, upload('bearers').single('image'), updateOfficeBearer);
router.delete('/:id', authMiddleware, adminOnly, deleteOfficeBearer);

module.exports = router;
