const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const protect = require('../middleware/auth');

// TASK 4 — GET /api/notifications
router.get('/', protect, notificationController.getNotifications);

// TASK 5 — PUT /api/notifications/read-all
router.put('/read-all', protect, notificationController.markAllRead);

// TASK 6 — PUT /api/notifications/read/:id
router.put('/read/:id', protect, notificationController.markOneRead);

module.exports = router;
