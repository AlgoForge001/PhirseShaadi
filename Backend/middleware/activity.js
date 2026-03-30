const User = require('../models/User');

const updateLastActive = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      await User.findByIdAndUpdate(req.user.userId, { lastActive: new Date() });
    }
    next();
  } catch (error) {
    console.error("Update Last Active Error:", error);
    next(); // Continue even if update fails
  }
};

module.exports = updateLastActive;
