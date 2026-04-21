const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const protect = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/me', protect, profileController.getMe);
router.get('/viewers', protect, profileController.getProfileViewers);
router.get('/:id', protect, profileController.getProfileById);
router.put('/basic', protect, profileController.updateBasic);
router.put('/education', protect, profileController.updateEducation);
router.put('/family', protect, profileController.updateFamily);
router.put('/horoscope', protect, profileController.updateHoroscope);
router.put('/update', protect, profileController.updateFullProfile);

// Photo routes
router.post('/photo', protect, upload.single('photo'), profileController.uploadPhoto);
router.post('/photo/set-primary', protect, profileController.setPrimaryPhoto);
router.delete('/photo/:publicId', protect, profileController.deletePhoto);

module.exports = router;

