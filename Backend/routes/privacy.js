const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacyController');
const protect = require('../middleware/auth');

// TASK 2 — PUT /api/privacy/settings
router.put('/settings', protect, privacyController.updatePrivacySettings);

module.exports = router;
