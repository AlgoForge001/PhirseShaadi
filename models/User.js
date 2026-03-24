const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
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
  city: {
    type: String
  },
  state: {
    type: String
  },
  education: {
    type: String
  },
  profession: {
    type: String
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
