const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const protect = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + '-' + unique + ext);
	}
});
const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
		if (allowed.includes(file.mimetype)) cb(null, true);
		else cb(new Error('Only JPG, PNG, and WEBP images allowed'));
	}
});

router.get('/me', protect, profileController.getMe);
router.get('/viewers', protect, profileController.getProfileViewers);
router.get('/:id', protect, profileController.getProfileById);
router.put('/basic', protect, profileController.updateBasic);
router.put('/education', protect, profileController.updateEducation);
router.put('/family', protect, profileController.updateFamily);
router.put('/horoscope', protect, profileController.updateHoroscope);
router.put('/update', protect, profileController.updateFullProfile);

// Photo upload route
router.post('/photo', protect, upload.single('photo'), profileController.uploadPhoto);

module.exports = router;
