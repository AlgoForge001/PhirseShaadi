const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'email phone role').limit(20);
    console.log('Users:');
    console.log(JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

listUsers();
