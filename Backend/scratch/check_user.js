const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: 'shaadi@gmail.com' });
    if (user) {
      console.log('User found:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('User not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUser();
