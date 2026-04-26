const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function checkPhone() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ phone: '0000000000' });
    if (user) {
      console.log('User found with phone 0000000000:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log('No user found with phone 0000000000');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkPhone();
