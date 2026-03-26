const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "From user is required"]
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "To user is required"]
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, { timestamps: false }); // We are manually handling createdAt and updatedAt

// Add unique index: one user can send only one interest to another user
interestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
