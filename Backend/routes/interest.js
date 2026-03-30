const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interestController');
const protect = require('../middleware/auth');

// Task 2: POST /api/interest/send
router.post('/send', protect, interestController.sendInterest);

// Task 3: GET /api/interest/received
router.get('/received', protect, interestController.getReceivedInterests);

// Task 4: GET /api/interest/sent
router.get('/sent', protect, interestController.getSentInterests);

// Task 5: PUT /api/interest/respond
router.put('/respond', protect, interestController.respondInterest);

module.exports = router;
