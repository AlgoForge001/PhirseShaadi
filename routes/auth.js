const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Task 2: Registration
// ... existing routes
router.post('/register', authController.register);

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
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Generate JWT for the logged in user
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/google-success?token=${token}`);
  }
);





module.exports = router;
