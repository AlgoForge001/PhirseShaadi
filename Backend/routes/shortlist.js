const express = require('express');
const router = express.Router();
const shortlistController = require('../controllers/shortlistController');
const protect = require('../middleware/auth');

// Task 7: POST /api/shortlist
router.post('/', protect, shortlistController.addToShortlist);

// Task 8: GET /api/shortlist & DELETE /api/shortlist/:profileId
router.get('/all', protect, shortlistController.getAllShortlists);
router.get('/', protect, shortlistController.getShortlist);
router.delete('/:profileId', protect, shortlistController.removeFromShortlist);

module.exports = router;
