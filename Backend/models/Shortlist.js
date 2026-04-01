const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is required"]
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Profile to shortlist is required"]
  },
  addedByFamilyMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Keep shortlist unique per actor (owner or specific family member)
shortlistSchema.index({ user: 1, profile: 1, addedByFamilyMember: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
