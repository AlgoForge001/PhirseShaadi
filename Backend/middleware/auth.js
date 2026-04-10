const { createClerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Verify Clerk token
      const decoded = await clerk.verifyToken(token);
      const clerkId = decoded.sub;

      // 2. Find user in MongoDB by clerkId
      let user = await User.findOne({ clerkId });

      if (!user) {
        // Option: If user doesn't exist in DB, we still pass clerkId
        // This allows the "Complete Profile" flow to pick it up
        req.user = { 
          userId: null, 
          clerkId: clerkId,
          needsProfileCompletion: true
        };
      } else {
        req.user = { 
          userId: user._id.toString(), 
          clerkId: clerkId,
          email: user.email, 
          role: user.role,
          needsProfileCompletion: false
        };
      }
      
      return next();
    } catch (error) {
      console.error("Clerk Token Verification Failed:", error.message);
      return res.status(401).json({ success: false, message: "Token is not valid" });
    }
  } catch (error) {
    console.error("Auth Middleware Global Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = auth;

