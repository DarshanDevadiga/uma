const express = require('express');
const router = express.Router();
const {
  getAwards,
  nominateAward,
  getNominations,
  updateNominationStatus,
  createAward,
  updateAward,
  deleteAward,
  deleteNomination
} = require('../controllers/awardController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', getAwards);
router.post('/nominate', upload('awards').single('document'), nominateAward);

// Admin endpoints (Protected)
router.get('/admin/nominations', authMiddleware, adminOnly, getNominations);
router.patch('/admin/nominations/:id/status', authMiddleware, adminOnly, updateNominationStatus);
router.delete('/admin/nominations/:id', authMiddleware, adminOnly, deleteNomination);
router.post('/', authMiddleware, adminOnly, createAward);
router.put('/:id', authMiddleware, adminOnly, updateAward);
router.delete('/:id', authMiddleware, adminOnly, deleteAward);

module.exports = router;
