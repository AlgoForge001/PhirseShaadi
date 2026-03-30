const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const protect = require('../middleware/auth');

router.get('/me', protect, profileController.getMe);
router.get('/:id', protect, profileController.getProfileById);
router.put('/basic', protect, profileController.updateBasic);
router.put('/education', protect, profileController.updateEducation);
router.put('/family', protect, profileController.updateFamily);
router.put('/horoscope', protect, profileController.updateHoroscope);
router.put('/update', protect, profileController.updateFullProfile);

// Photo routes (placeholders)
router.post('/photo', protect, profileController.uploadPhoto);

module.exports = router;
