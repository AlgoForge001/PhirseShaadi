require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.log("❌ Please provide the email of the user you want to make admin.");
    console.log("Usage: node make_admin.js <user-email>");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("✅ Database connected.");

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ No user found with email: ${email}`);
      console.log("Please register this user normally through the app first.");
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`⚠️ User ${email} is already an admin.`);
    } else {
      user.role = 'admin';
      await user.save();
      console.log(`🎉 SUCCESS! User ${email} is now an Admin.`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

makeAdmin();
