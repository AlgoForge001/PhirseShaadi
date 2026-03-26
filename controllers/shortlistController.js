const Shortlist = require('../models/Shortlist');

// Task 7: POST /api/shortlist
exports.addToShortlist = async (req, res) => {
  try {
    const { profileId } = req.body;
    const userId = req.user.userId;

    // 1. Check: cant shortlist yourself
    if (userId === profileId) {
      return res.status(400).json({ success: false, message: "You cannot shortlist yourself" });
    }

    // 2. Check: already shortlisted?
    const existingShortlist = await Shortlist.findOne({ user: userId, profile: profileId });
    if (existingShortlist) {
      return res.status(400).json({ success: false, message: "Profile already in shortlist" });
    }

    // 3. Create shortlist document
    const newShortlist = new Shortlist({
      user: userId,
      profile: profileId
    });

    await newShortlist.save();

    res.status(201).json({
      success: true,
      message: "Added to shortlist"
    });

  } catch (error) {
    console.error("Add to Shortlist Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Task 8: GET /api/shortlist
exports.getShortlist = async (req, res) => {
  try {
    const shortlists = await Shortlist.find({ user: req.user.userId })
      .populate('profile', 'name city state education profession');

    res.status(200).json({
      success: true,
      count: shortlists.length,
      data: shortlists
    });
  } catch (error) {
    console.error("Get Shortlist Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// DELETE /api/shortlist/:profileId
exports.removeFromShortlist = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.userId;

    const result = await Shortlist.findOneAndDelete({ user: userId, profile: profileId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Profile not found in shortlist" });
    }

    res.status(200).json({
      success: true,
      message: "Removed from shortlist"
    });
  } catch (error) {
    console.error("Remove from Shortlist Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
