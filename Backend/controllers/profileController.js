const User = require('../models/User');
const Interest = require('../models/Interest');
const path = require('path');
const fs = require('fs');

// GET /api/profile/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -otp -otpExpiry');
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

    // Interest status between viewer and this profile
    let interestStatus = { sent: false, received: false, status: null, interestId: null };
    if (viewerId !== req.params.id) {
      const sentInterest = await Interest.findOne({ from: viewerId, to: req.params.id });
      const receivedInterest = await Interest.findOne({ from: req.params.id, to: viewerId });

      if (sentInterest) {
        interestStatus = { sent: true, received: false, status: sentInterest.status, interestId: sentInterest._id };
      } else if (receivedInterest) {
        interestStatus = { sent: false, received: true, status: receivedInterest.status, interestId: receivedInterest._id };
      }
    }

    res.status(200).json({ success: true, profile: user, interestStatus });
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
    const userId = req.user.userId;

    // Remove sensitive fields if present
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpiry;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", profile: user });
  } catch (error) {
    console.error("Update Full Profile Error:", error);
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};


// POST /api/profile/photo  — upload one photo (multipart/form-data, field: "photo")
exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user.userId;

    // Build a public URL so the frontend can display it
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    const publicId = req.file.filename; // e.g. "userId_timestamp.jpg"
    const url = `${BACKEND_URL}/uploads/${publicId}`;

    // Check if user already has 10 photos
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.photos && user.photos.length >= 10) {
      // Remove the just-uploaded file since we can't store it
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, message: "Maximum 10 photos allowed" });
    }

    // If no photos yet, make this one primary
    const isPrimary = !user.photos || user.photos.length === 0;

    await User.findByIdAndUpdate(userId, {
      $push: { photos: { url, isPrimary, publicId } }
    });

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      publicId,
      url
    });
  } catch (error) {
    console.error("Upload Photo Error:", error.message);
    return res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

// DELETE /api/profile/photo/:publicId  — delete a photo
exports.deletePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { publicId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const photoExists = user.photos.some(p => p.publicId === publicId || p.url?.endsWith(publicId));
    if (!photoExists) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '..', 'uploads', publicId);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("File delete error:", err.message);
      });
    }

    // Remove from DB
    await User.findByIdAndUpdate(userId, {
      $pull: { photos: { publicId } }
    });

    // If the deleted photo was primary and other photos exist, auto-set first as primary
    const updatedUser = await User.findById(userId);
    const hadPrimary = user.photos.find(p => p.publicId === publicId)?.isPrimary;
    if (hadPrimary && updatedUser.photos.length > 0) {
      const firstId = updatedUser.photos[0]._id;
      await User.updateOne(
        { _id: userId, 'photos._id': firstId },
        { $set: { 'photos.$.isPrimary': true } }
      );
    }

    return res.status(200).json({ success: true, message: "Photo deleted" });
  } catch (error) {
    console.error("Delete Photo Error:", error.message);
    return res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};

// POST /api/profile/photo/set-primary  — set a photo as primary
exports.setPrimaryPhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const photoExists = user.photos.some(p => p.publicId === publicId);
    if (!photoExists) {
      return res.status(404).json({ success: false, message: "Photo not found" });
    }

    // Clear all isPrimary flags first
    await User.updateMany(
      { _id: userId },
      { $set: { 'photos.$[].isPrimary': false } }
    );

    // Set the selected one as primary
    await User.updateOne(
      { _id: userId, 'photos.publicId': publicId },
      { $set: { 'photos.$.isPrimary': true } }
    );

    return res.status(200).json({ success: true, message: "Primary photo updated" });
  } catch (error) {
    console.error("Set Primary Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to set primary", error: error.message });
  }
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
// POST /api/profile/cv
exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No CV file uploaded" });
    }

    const userId = req.user.userId;
    const cvUrl = `/uploads/cvs/${req.file.filename}`;

    await User.findByIdAndUpdate(userId, { $set: { cvUrl } });

    res.status(200).json({ 
      success: true, 
      message: "CV uploaded successfully", 
      cvUrl 
    });
  } catch (error) {
    console.error("Upload CV Error:", error.message);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};
