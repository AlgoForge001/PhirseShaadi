const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for CV uploads
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'cvs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only PDF/DOC files allowed'));
  }
});

// Task 2: Registration (with optional CV upload)
router.post('/register', uploadCV.single('cvFile'), authController.register);

// Task 3: Login
router.post('/login', authController.login);

// Task 4: Send/Resend OTP
router.post('/resend-otp', authController.sendOTP);

// Task 5: Verify OTP
router.post('/verify-otp', authController.verifyOTP);



// Task 7: Google OAuth Routes
// 1. Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback
router.get('/google/callback', 
  (req, res, next) => {
    const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : 'http://localhost:5173';
    passport.authenticate('google', { failureRedirect: `${frontendUrl}/login`, session: false })(req, res, next);
  },
  (req, res) => {
    // Generate JWT for the logged in user
    console.log("DEBUG: Signing token for UserID:", req.user._id);
    const token = jwt.sign(
      { userId: req.user._id.toString(), email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    res.redirect(`${frontendUrl}/google-success?token=${token}`);
  }
);





module.exports = router;
