const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middleware/auth');
const updateLastActive = require('../middleware/activity');

// Task 5: GET /api/chat/conversations
router.get('/conversations', protect, updateLastActive, chatController.getConversations);

// GET /api/chat/access/:userId — MUST be before /:userId to avoid route conflict
router.get('/access/:userId', protect, updateLastActive, chatController.checkChatAccess);

// Task 6: GET /api/chat/:userId — wildcard route MUST be last
router.get('/:userId', protect, updateLastActive, chatController.getChatHistory);

module.exports = router;
