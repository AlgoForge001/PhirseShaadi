const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const protect = require('../middleware/auth');
const { photoUpload, cvUpload } = require('../config/multer');

router.get('/me', protect, profileController.getMe);
router.get('/viewers', protect, profileController.getProfileViewers);
router.get('/:id', protect, profileController.getProfileById);
router.put('/basic', protect, profileController.updateBasic);
router.put('/education', protect, profileController.updateEducation);
router.put('/family', protect, profileController.updateFamily);
router.put('/horoscope', protect, profileController.updateHoroscope);
router.put('/update', protect, profileController.updateFullProfile);

// Photo routes
router.post('/photo', protect, photoUpload.single('photo'), profileController.uploadPhoto);
router.post('/photo/set-primary', protect, profileController.setPrimaryPhoto);
router.delete('/photo/:publicId', protect, profileController.deletePhoto);

// CV route
router.post('/cv', protect, cvUpload.single('cvFile'), profileController.uploadCV);

module.exports = router;
