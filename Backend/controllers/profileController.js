const User = require('../models/User');

// GET /api/profile/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.user.clerkId }).select('-password -otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, profile: user });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET /api/profile/:id
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp -otpExpiry -blockedUsers');
    if (!user) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    // Task 7: Record profile view (if viewer is different from profile owner)
    const viewerId = req.user.userId;
    if (viewerId !== req.params.id) {
      // Avoid duplicate recent views or just push? Task says "viewedAt time", implying a list.
      // I'll push new view.
      await User.findByIdAndUpdate(req.params.id, {
        $push: { 
          profileViewers: { 
            userId: viewerId, 
            viewedAt: new Date() 
          } 
        }
      });

      // Task 3: Notify profile owner
      const sendNotification = require('../utils/sendNotification');
      const io = req.app.get('io');
      const onlineUsers = req.app.get('onlineUsers');
      await sendNotification({
        userId: req.params.id,
        type: 'profile_viewed',
        message: "Someone viewed your profile",
        fromUser: viewerId,
        link: `/profile/${viewerId}`,
        io,
        onlineUsers
      });
    }

    res.status(200).json({ success: true, profile: user });
  } catch (error) {
    console.error("Get Profile By ID Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// PUT /api/profile/basic
exports.updateBasic = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: "Basic info updated", profile: user });
  } catch (error) {
    console.error("Update Basic Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// PUT /api/profile/education
exports.updateEducation = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: "Education info updated", profile: user });
  } catch (error) {
    console.error("Update Education Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// PUT /api/profile/family
exports.updateFamily = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: "Family info updated", profile: user });
  } catch (error) {
    console.error("Update Family Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// PUT /api/profile/horoscope
exports.updateHoroscope = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: "Horoscope info updated", profile: user });
  } catch (error) {
    console.error("Update Horoscope Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// PUT /api/profile/update
exports.updateFullProfile = async (req, res) => {
  try {
    const updates = req.body;
    const clerkId = req.user.clerkId;

    // Remove sensitive fields if present
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpiry;

    // Use findOneAndUpdate with upsert: true to create the user if they don't exist
    // This handles the transition from Clerk SignUp -> Profile Creation
    const user = await User.findOneAndUpdate(
      { clerkId: clerkId },
      { 
        $set: {
          ...updates,
          clerkId: clerkId,
          // Only set email if it's a new document or not provided in updates
          ...(req.user.email ? { email: req.user.email } : {})
        } 
      },
      { new: true, upsert: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, message: "Profile updated successfully", profile: user });
  } catch (error) {
    console.error("Update Full Profile Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// Placeholder for photo upload (to be implemented with multer/cloudinary if requested)
exports.uploadPhoto = async (req, res) => {
  res.status(501).json({ success: false, message: "Photo upload not yet implemented on server" });
};

// GET /api/profile/viewers
exports.getProfileViewers = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('profileViewers')
      .populate('profileViewers.userId', 'name city photos');

    if (!user) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return latest 50 viewers, sorted by most recent
    const viewers = (user.profileViewers || [])
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .slice(0, 50);

    res.status(200).json({ success: true, data: viewers });
  } catch (error) {
    console.error("Get Profile Viewers Error:", error.message);
    res.status(200).json({ success: true, data: [] });
  }
};
