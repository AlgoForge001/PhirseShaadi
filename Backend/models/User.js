const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  fullName: {
    type: String
  },
  bio: {
    type: String
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  clerkId: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  gender: {
    type: String
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true
  },
  profileFor: {
    type: String
  },
  dob: {
    type: Date
  },
  religion: {
    type: String
  },
  community: {
    type: String
  },
  motherTongue: {
    type: String
  },
  maritalStatus: {
    type: String
  },
  height: {
    type: String
  },
  weight: {
    type: String
  },
  bodyType: {
    type: String
  },
  complexion: {
    type: String
  },
  physicalStatus: {
    type: String,
    default: 'normal'
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  education: {
    type: String
  },
  educationDetail: {
    type: String
  },
  profession: {
    type: String
  },
  occupation: {
    type: String
  },
  employedIn: {
    type: String
  },
  income: {
    type: String
  },
  annualIncome: {
    type: String
  },
  companyName: {
    type: String
  },
  familyType: {
    type: String
  },
  familyStatus: {
    type: String
  },
  familyValues: {
    type: String
  },
  fatherOccupation: {
    type: String
  },
  motherOccupation: {
    type: String
  },
  siblings: {
    type: String
  },
  aboutFamily: {
    type: String
  },
  birthTime: {
    type: String
  },
  birthPlace: {
    type: String
  },
  gotra: {
    type: String
  },
  nakshatra: {
    type: String
  },
  rashi: {
    type: String
  },
  photos: [
    {
      url: String,
      isPrimary: { type: Boolean, default: false }
    }
  ],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  income: {
    type: String
  },
  jobType: {
    type: String
  },
  manglik: {
    type: String
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  partnerPreferences: {
    religion: String,
    minAge: Number,
    maxAge: Number,
    city: String,
    state: String,
    education: String,
    income: String
  },
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  privacySettings: {
    showLastSeen: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    showProfileTo: { type: String, default: 'everyone' },
    photoVisibility: { type: String, default: 'everyone' },
    incognitoMode: { type: Boolean, default: false }
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  profileViewers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      viewedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
