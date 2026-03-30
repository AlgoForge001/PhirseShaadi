const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const protect = require('../middleware/auth');

// TASK 3 — POST /api/user/block
router.post('/block', protect, userController.blockUser);

// TASK 4 — DELETE /api/user/block/:userId
router.delete('/block/:userId', protect, userController.unblockUser);

// TASK 5 — GET /api/user/blocked
router.get('/blocked', protect, userController.getBlockedUsers);

// TASK 6 — POST /api/user/report
router.post('/report', protect, userController.reportUser);

module.exports = router;
