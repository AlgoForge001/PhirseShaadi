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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add unique index: user can shortlist a profile only once
shortlistSchema.index({ user: 1, profile: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', shortlistSchema);
