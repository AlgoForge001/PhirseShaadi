const Shortlist = require('../models/Shortlist');
const FamilyMember = require('../models/FamilyMember');
const FamilyShortlist = require('../models/FamilyShortlist');

// Task 7: POST /api/shortlist
exports.addToShortlist = async (req, res) => {
  try {
    const { profileId, familyMemberId } = req.body;
    const userId = req.user.userId;

    // 1. Check: cant shortlist yourself
    if (userId === profileId) {
      return res.status(400).json({ success: false, message: "You cannot shortlist yourself" });
    }

    let targetModel = Shortlist;
    let createPayload = {
      user: userId,
      profile: profileId
    };

    if (familyMemberId) {
      const familyMember = await FamilyMember.findOne({
        _id: familyMemberId,
        owner: userId,
        isActive: true
      });

      if (!familyMember) {
        return res.status(404).json({ success: false, message: 'Family member not found' });
      }

      targetModel = FamilyShortlist;
      createPayload.familyMember = familyMemberId;
    }

    // 2. Check: already shortlisted?
    const existingShortlist = await targetModel.findOne(createPayload);
    if (existingShortlist) {
      return res.status(400).json({ success: false, message: "Profile already in shortlist" });
    }

    // 3. Create shortlist document
    const newShortlist = new targetModel(createPayload);

    await newShortlist.save();

    res.status(201).json({
      success: true,
      message: "Added to shortlist",
      data: newShortlist
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
      .populate('profile', 'name age city state education profession bio photos');

    const data = shortlists.map((entry) => entry.profile).filter(Boolean);

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error("Get Shortlist Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET /api/shortlist/all
exports.getAllShortlists = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [myDocs, familyMembers, familyDocs] = await Promise.all([
      Shortlist.find({ user: userId })
        .populate('profile', 'name age city state education profession bio photos'),
      FamilyMember.find({ owner: userId, isActive: true }).select('name'),
      FamilyShortlist.find({ user: userId })
        .populate('profile', 'name age city state education profession bio photos')
        .populate('familyMember', 'name')
    ]);

    const myShortlist = myDocs.map((entry) => entry.profile).filter(Boolean);

    const familyMap = new Map();
    familyMembers.forEach((member) => {
      familyMap.set(member._id.toString(), {
        _id: member._id,
        createdByName: member.name,
        profiles: []
      });
    });

    familyDocs.forEach((entry) => {
      if (!entry.familyMember || !entry.profile) return;
      const key = entry.familyMember._id.toString();
      if (!familyMap.has(key)) {
        familyMap.set(key, {
          _id: entry.familyMember._id,
          createdByName: entry.familyMember.name || 'Family Member',
          profiles: []
        });
      }
      familyMap.get(key).profiles.push(entry.profile);
    });

    const familyShortlists = Array.from(familyMap.values());

    res.status(200).json({
      success: true,
      myShortlist,
      familyShortlists
    });
  } catch (error) {
    console.error('Get All Shortlists Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// DELETE /api/shortlist/:profileId
exports.removeFromShortlist = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { familyMemberId } = req.query;
    const userId = req.user.userId;

    const query = {
      user: userId,
      profile: profileId
    };

    let targetModel = Shortlist;

    if (familyMemberId) {
      const familyMember = await FamilyMember.findOne({ _id: familyMemberId, owner: userId, isActive: true });
      if (!familyMember) {
        return res.status(404).json({ success: false, message: 'Family member not found' });
      }
      targetModel = FamilyShortlist;
      query.familyMember = familyMemberId;
    }

    const result = await targetModel.findOneAndDelete(query);

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
