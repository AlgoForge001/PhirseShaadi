const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const protect = require('../middleware/auth'); // JWT Middleware

// Task 1: GET /api/search
router.get('/', protect, searchController.searchUsers);

// Task 2: GET /api/matches/recommended
router.get('/recommended', protect, searchController.getRecommendedMatches);

// AI Powered Smart Matches
router.get('/smart-match', protect, searchController.getSmartMatches);


// Same-city opposite-gender matching
router.get('/same-city', protect, searchController.getSameCityMatches);

// Task 4: GET /api/matches/new-joins
router.get('/new-joins', protect, searchController.getNewJoins);

// Task 5: GET /api/matches/recently-active
router.get('/recently-active', protect, searchController.getRecentlyActive);

module.exports = router;
