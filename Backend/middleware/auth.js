const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Try to get token from header
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (error) {
        console.log("Auth Bypass: Token verification failed, using fallback.");
      }
    }

    // 2. Bypass: Auto-login as the first user in the database for testing
    const defaultUser = await User.findOne();
    if (defaultUser) {
      req.user = { 
        userId: defaultUser._id.toString(), 
        email: defaultUser.email, 
        role: 'user' 
      };
      // console.log(`[DEVELOPMENT ONLY] Bypassing Auth: Acting as ${defaultUser.email}`);
    } else {
      console.warn("Auth Bypass: No users found in DB to auto-login.");
    }
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    next(); 
  }
};

module.exports = auth;

