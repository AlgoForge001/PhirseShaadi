const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Relationship is required'],
      enum: [
        'mother',
        'father',
        'sister',
        'brother',
        'grandmother',
        'grandfather',
        'aunt',
        'uncle',
        'cousin',
        'other'
      ]
    },
    contactInfo: {
      type: String,
      default: '',
      trim: true
    },
    accessLevel: {
      type: String,
      enum: ['view-only', 'shortlist-only', 'full-access'],
      default: 'view-only'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyMember', familyMemberSchema);