const mongoose = require('mongoose');
const uri = 'mongodb+srv://ansarimnashit_db_user:Nashit123456@cluster0.y2nnwrm.mongodb.net/phirseshadi?appName=Cluster0';

async function run() {
  try {
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB successfully!");
    
    // Perform a basic read
    const collections = await mongoose.connection.db.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
    
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
}

run();
