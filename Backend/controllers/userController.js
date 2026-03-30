const User = require('../models/User');
const Report = require('../models/Report');

// TASK 3 — POST /api/user/block
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user.userId;

    // 1. Cannot block yourself
    if (myId === userId) {
      return res.status(400).json({ success: false, message: "You cannot block yourself" });
    }

    const user = await User.findById(myId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Current user not found" });
    }

    // 2. If already blocked
    if (user.blockedUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already blocked" });
    }

    // 3. Add to blockedUsers array
    user.blockedUsers.push(userId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User blocked successfully"
    });

  } catch (error) {
    console.error("Block User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 4 — DELETE /api/user/block/:userId
exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user.userId;

    const user = await User.findById(myId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Current user not found" });
    }

    // Remove userId from blockedUsers array
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "User unblocked"
    });

  } catch (error) {
    console.error("Unblock User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 5 — GET /api/user/blocked
exports.getBlockedUsers = async (req, res) => {
  try {
    const myId = req.user.userId;

    const user = await User.findById(myId)
      .populate('blockedUsers', 'name photos');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.blockedUsers.length,
      data: user.blockedUsers
    });

  } catch (error) {
    console.error("Get Blocked Users Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 6 — POST /api/user/report
exports.reportUser = async (req, res) => {
  try {
    const { userId, reason, description } = req.body;
    const myId = req.user.userId;

    if (myId === userId) {
      return res.status(400).json({ success: false, message: "You cannot report yourself" });
    }

    // 1. Create Report
    const newReport = new Report({
      reportedBy: myId,
      reportedUser: userId,
      reason,
      description
    });
    await newReport.save();

    // 2. Add reporter ID to reported user's reports array (Task 1 requirement)
    await User.findByIdAndUpdate(userId, {
      $push: { reports: myId }
    });

    res.status(201).json({
      success: true,
      message: "Report submitted"
    });

  } catch (error) {
    console.error("Report User Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 7 — GET /api/profile/viewers (Premium only)
exports.getProfileViewers = async (req, res) => {
  try {
    const myId = req.user.userId;

    const user = await User.findById(myId)
      .populate('profileViewers.userId', 'name photos city');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check: if user.isPremium is false
    if (!user.isPremium) {
      return res.status(403).json({ 
        success: false, 
        message: "Upgrade to premium to see profile viewers" 
      });
    }

    res.status(200).json({
      success: true,
      count: user.profileViewers.length,
      data: user.profileViewers
    });

  } catch (error) {
    console.error("Get Profile Viewers Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

