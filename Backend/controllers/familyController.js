const FamilyMember = require('../models/FamilyMember');

// POST /api/family/add
exports.addFamilyMember = async (req, res) => {
  try {
    const { name, relationship, contactInfo, accessLevel } = req.body;
    const owner = req.user.userId;

    const familyMember = await FamilyMember.create({
      owner,
      name,
      relationship,
      contactInfo,
      accessLevel
    });

    res.status(201).json({
      success: true,
      message: 'Family member added',
      familyMember
    });
  } catch (error) {
    console.error('Add Family Member Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// GET /api/family/members
exports.getFamilyMembers = async (req, res) => {
  try {
    const owner = req.user.userId;

    const familyMembers = await FamilyMember.find({ owner, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: familyMembers.length,
      familyMembers
    });
  } catch (error) {
    console.error('Get Family Members Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// PUT /api/family/:id
exports.updateFamilyMember = async (req, res) => {
  try {
    const owner = req.user.userId;
    const { id } = req.params;

    const familyMember = await FamilyMember.findOneAndUpdate(
      { _id: id, owner, isActive: true },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!familyMember) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Family member updated',
      familyMember
    });
  } catch (error) {
    console.error('Update Family Member Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};

// DELETE /api/family/:id
exports.deleteFamilyMember = async (req, res) => {
  try {
    const owner = req.user.userId;
    const { id } = req.params;

    const familyMember = await FamilyMember.findOneAndUpdate(
      { _id: id, owner, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!familyMember) {
      return res.status(404).json({ success: false, message: 'Family member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Family member deleted'
    });
  } catch (error) {
    console.error('Delete Family Member Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
};