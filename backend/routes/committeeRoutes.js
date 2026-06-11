const express = require('express');
const router = express.Router();
const {
  getCommittees,
  createCommittee,
  updateCommittee,
  deleteCommittee
} = require('../controllers/committeeController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getCommittees);

// Admin endpoints (Protected)
router.post('/', authMiddleware, adminOnly, upload('committees').single('image'), createCommittee);
router.put('/:id', authMiddleware, adminOnly, upload('committees').single('image'), updateCommittee);
router.delete('/:id', authMiddleware, adminOnly, deleteCommittee);

module.exports = router;
