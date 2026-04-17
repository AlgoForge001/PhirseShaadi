const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify JWT token
      console.log("DEBUG: Verifying token with secret length:", process.env.JWT_SECRET?.length);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DEBUG: Token decoded successfully. UserId:", decoded.userId);

      // Find user in MongoDB
      let user = await User.findById(decoded.userId);

      if (!user) {
        console.warn("DEBUG: User not found in database for ID:", decoded.userId);
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = { 
        userId: user._id.toString(), 
        email: user.email, 
        role: user.role
      };
      
      return next();
    } catch (error) {
      console.error("DEBUG: Token Verification Failed:", error.message);
      return res.status(401).json({ success: false, message: "Token is not valid" });
    }
  } catch (error) {
    console.error("Auth Middleware Global Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = auth;
