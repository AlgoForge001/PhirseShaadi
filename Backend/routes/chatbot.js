const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { chat } = require('../controllers/chatbotController');

// POST /api/chatbot/chat
router.post('/chat', protect, chat);

module.exports = router;
