const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { verifyToken, createClerkClient } = require('@clerk/backend');



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

    // 5. Send Email using Nodemailer
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

    // We don't await here to avoid slowing down registration, or we can await for reliability
    await transporter.sendMail(mailOptions);
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
      to: user.email,
      subject: 'PhirseShadi - Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}. This OTP is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
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

// Clerk OAuth -> App JWT bridge
exports.clerkLogin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing Clerk token' });
    }

    if (!process.env.CLERK_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'CLERK_SECRET_KEY is not configured' });
    }

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkUserId = verified?.sub;
    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: 'Invalid Clerk token' });
    }

    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const primaryEmailObj = clerkUser.emailAddresses.find(
      (item) => item.id === clerkUser.primaryEmailAddressId
    );
    const email = primaryEmailObj?.emailAddress;

    if (!email) {
      return res.status(400).json({ success: false, message: 'No primary email found on Clerk account' });
    }

    const first = (clerkUser.firstName || '').trim();
    const last = (clerkUser.lastName || '').trim();
    const fullName = `${first} ${last}`.trim() || email.split('@')[0];
    const fallbackPhone = `clerk-${clerkUser.id}`;

    let user = await User.findOne({
      $or: [{ clerkId: clerkUser.id }, { email }],
    });

    if (!user) {
      const generatedPassword = await bcrypt.hash(`clerk-${clerkUser.id}-${Date.now()}`, 10);
      user = await User.create({
        name: fullName,
        fullName,
        email,
        clerkId: clerkUser.id,
        phone: fallbackPhone,
        password: generatedPassword,
        isVerified: true,
      });
    } else if (!user.clerkId) {
      user.clerkId = clerkUser.id;
      if (!user.name) user.name = fullName;
      if (!user.fullName) user.fullName = fullName;
      await user.save();
    }

    const appToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token: appToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Clerk login bridge error:', error.message);
    return res.status(500).json({ success: false, message: 'Clerk login failed' });
  }
};



