const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middleware/auth');

// Task 5: GET /api/chat/conversations
router.get('/conversations', protect, chatController.getConversations);

// GET /api/chat/access/:userId
router.get('/access/:userId', protect, chatController.checkChatAccess);

// Task 6: GET /api/chat/:userId
router.get('/:userId', protect, chatController.getChatHistory);

module.exports = router;
