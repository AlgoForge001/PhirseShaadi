const User = require('../models/User');

// TASK 2 — PUT /api/privacy/settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const { privacySettings } = req.body;
    const userId = req.user.userId;

    if (!privacySettings) {
      return res.status(400).json({ success: false, message: "Privacy settings object is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { privacySettings } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Privacy settings updated",
      privacySettings: user.privacySettings
    });

  } catch (error) {
    console.error("Update Privacy Settings Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
