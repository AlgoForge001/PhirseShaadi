const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



// Register User
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, gender, profileFor, dob, religion, community, motherTongue, maritalStatus, height, city, state, education, profession } = req.body;
    const name = fullName;
    
    // 1. Check if email or phone already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
      return res.status(400).json({ success: false, message: "Phone number already registered" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 4. Create and Save User
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      gender,
      profileFor,
      dob,
      religion,
      community,
      motherTongue,
      maritalStatus,
      height,
      city,
      state,
      education,
      profession,
      otp,
      otpExpiry
    });

    await newUser.save();

    // 5. Send Email using Nodemailer (Non-blocking for speed)
    // Send Email using Nodemailer (Optimized for Render/IPv4)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // This helps avoid issues with Render's network configuration
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'PhirseShadi - Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`
    };

    // Fire and forget - don't await so registration is instant
    transporter.sendMail(mailOptions).catch(err => {
      console.error("Background Email Error (Register):", err.message);
    });
    
    console.log(`[DEV] OTP for ${email}: ${otp}`);

    // 4. Generate Token (Optional, but frontend expects it for immediate context login)
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      userId: newUser._id,
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Find user by email or phone
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }] 
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email or Phone not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Wrong password" });
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
    const { email, phone } = req.body;
    const identifier = email || phone;

    // 1. Find user
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // 3. Save to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // 4. Send Email using Nodemailer (Non-blocking)
    // Send Email using Nodemailer (Optimized for Render/IPv4)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        // This helps avoid issues with Render's network configuration
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'PhirseShadi - Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`
    };

    // Fire and forget
    transporter.sendMail(mailOptions).catch(err => {
      console.error("Background Email Error (sendOTP):", err.message);
    });

    console.log(`[DEV] OTP for ${identifier}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error while sending OTP", error: error.message });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;

    // 1. Find user by phone OR email
    const query = phone ? { phone } : { email };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Check OTP and Expiry
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // 3. Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Verified successfully",
      token: jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      ),
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during OTP verification", error: error.message });
  }
};

