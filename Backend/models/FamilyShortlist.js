const mongoose = require('mongoose');

const familyShortlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  familyMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    required: [true, 'Family member is required'],
    index: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Profile to shortlist is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Each family member can shortlist the same profile only once.
familyShortlistSchema.index({ user: 1, familyMember: 1, profile: 1 }, { unique: true });

module.exports = mongoose.model('FamilyShortlist', familyShortlistSchema);