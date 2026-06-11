const express = require('express');
const router = express.Router();
const {
  getMembershipTypes,
  registerMembership,
  getMemberships,
  updateMembership,
  updateMembershipStatus,
  deleteMembership
} = require('../controllers/memberController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// Public endpoints
router.get('/types', getMembershipTypes);
router.post('/register', registerMembership);

// Admin endpoints (Protected)
router.get('/', authMiddleware, adminOnly, getMemberships);
router.put('/:id', authMiddleware, adminOnly, updateMembership);
router.patch('/:id/status', authMiddleware, adminOnly, updateMembershipStatus);
router.delete('/:id', authMiddleware, adminOnly, deleteMembership);

module.exports = router;
