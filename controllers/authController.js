const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // 1. Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create and Save User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender
    });

    await newUser.save();

    res.status(201).json({
      message: "Registered successfully",
      userId: newUser._id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// Send OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // 3. Save to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // 4. Send Email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PhirseShadi - Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error while sending OTP", error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // 2. Check OTP and Expiry
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 3. Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error during OTP verification", error: error.message });
  }
};



