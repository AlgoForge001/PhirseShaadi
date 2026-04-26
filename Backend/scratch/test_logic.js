const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock req and res
const req = {
  body: {
    identifier: 'shaadi@gmail.com',
    password: 'phirseshaadi'
  }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Status Code:', this.statusCode);
    console.log('Response Body:', JSON.stringify(data, null, 2));
  }
};

async function testLoginLogic() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB');

    const { identifier, password } = req.body;

    // Admin Override (Special case for site owner)
    if (identifier === "shaadi@gmail.com" && password === "phirseshaadi") {
      let adminUser = await User.findOne({ email: identifier });
      if (!adminUser) {
        console.log('Creating admin user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("shaad", salt);
        adminUser = new User({
          name: "PhirseShaadi Admin",
          email: "shaadi@gmail.com",
          phone: "0000000000",
          password: hashedPassword,
          role: "admin",
          isVerified: true
        });
        await adminUser.save();
        console.log('Admin user created');
      } else if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('User updated to admin');
      }

      const token = jwt.sign(
        { userId: adminUser._id.toString(), email: adminUser.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: "Admin Login successful",
        token,
        user: { name: "Admin", email: adminUser.email, role: 'admin' }
      });
      process.exit(0);
    }
    
    console.log('Did not hit admin override');
    process.exit(0);

  } catch (error) {
    console.error('Logic Error:', error);
    process.exit(1);
  }
}

testLoginLogic();
