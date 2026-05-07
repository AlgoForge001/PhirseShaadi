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
    required: false
  },
  gender: {
    type: String
  },
  phone: {
    type: String,
    sparse: true,
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
  // ── Second Marriage ──
  isSecondMarriage: {
    type: Boolean,
    default: false
  },
  secondMarriageReason: {
    type: String
  },
  divorceReason: {
    type: String
  },
  hasChildren: {
    type: String
  },
  childrenCount: {
    type: Number
  },
  childrenLivingWith: {
    type: String
  },
  childrenAfterMarriage: {
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
  country: {
    type: String
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
  // ── Employment ──
  employmentType: {
    type: String
  },
  jobTitle: {
    type: String
  },
  cvUrl: {
    type: String
  },
  // ── Business ──
  businessName: {
    type: String
  },
  businessType: {
    type: String
  },
  annualTurnover: {
    type: String
  },
  // ── Female Work Status ──
  femaleWorkStatus: {
    type: String
  },
  workingCompany: {
    type: String
  },
  workingRole: {
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
  fatherName: {
    type: String
  },
  fatherOccupation: {
    type: String
  },
  motherName: {
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
  diet: {
    type: String
  },
  smoking: {
    type: String,
    default: 'No'
  },
  drinking: {
    type: String,
    default: 'No'
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
      publicId: String,
      isPrimary: { type: Boolean, default: false }
    }
  ],

  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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
  isActive: {
    type: Boolean,
    default: true
  },
  banReason: {
    type: String,
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
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
