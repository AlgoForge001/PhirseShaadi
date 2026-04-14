const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const backendBaseUrl = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
<<<<<<< HEAD
    callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/auth/google/callback` : "/api/auth/google/callback",
    proxy: true
=======
    callbackURL: `${backendBaseUrl}/api/auth/google/callback`
>>>>>>> 13735f5c9c5a10f24f7dcf90b7320c2a3b9d3aef
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // 1. Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        const randomPassword = Math.random().toString(36).slice(-12);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // 2. If new user, create account (generate random password since it's OAuth)
        user = new User({
          name: name,
          fullName: name,
          email: email,
          phone: `google-${profile.id}`,
          password: hashedPassword,
          isVerified: true // Google accounts are usually verified
        });
        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// These are required by passport even if we use JWT
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
