const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("phirseshaadi", salt);
    
    const result = await User.updateOne(
      { email: 'shaadi@gmail.com' },
      { $set: { password: hashedPassword, role: 'admin', isVerified: true } }
    );
    
    if (result.matchedCount > 0) {
      console.log('Admin password updated successfully');
    } else {
      console.log('Admin user not found, creating one...');
      const adminUser = new User({
        name: "PhirseShaadi Admin",
        email: "shaadi@gmail.com",
        phone: "0000000000",
        password: hashedPassword,
        role: "admin",
        isVerified: true
      });
      await adminUser.save();
      console.log('Admin user created');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateAdminPassword();
