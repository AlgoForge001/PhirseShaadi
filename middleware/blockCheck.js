const User = require('../models/User');

const blockCheck = async (req, res, next) => {
  try {
    const myId = req.user.userId;
    const targetUserId = req.params.id || req.params.userId || req.body.userId;

    if (!targetUserId) {
      return next();
    }

    const me = await User.findById(myId);
    if (me && me.blockedUsers.includes(targetUserId)) {
      return res.status(403).json({ success: false, message: "You have blocked this user" });
    }

    // Optional: Also check if the other user has blocked me
    const targetUser = await User.findById(targetUserId);
    if (targetUser && targetUser.blockedUsers.includes(myId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (error) {
    console.error("Block Check Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = blockCheck;
