const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function checkAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    const user = await User.findOne({ email: 'shaadi@gmail.com' });
    console.log(user);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkAdminUser();
