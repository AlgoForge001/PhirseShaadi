const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const religions = ["Hindu", "Muslim", "Sikh", "Christian", "Jain", "Buddhist"];
const femaleNames = ["Aditi", "Ishani", "Kavya", "Meera", "Niharika", "Pooja", "Riya", "Sanya", "Tanvi", "Vaidehi"];
const maleNames = ["Abhishek", "Deepak", "Gautam", "Harsh", "Ishaan", "Kartik", "Manav", "Pranav", "Rohan", "Siddharth"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Pune", "Chennai", "Kolkata"];
const communities = ["Brahmin", "Maratha", "Sunni", "Jat", "Patel", "Reddy", "Nair", "Lingayat"];
const occupations = ["Software Engineer", "Doctor", "Data Scientist", "Architect", "Manager", "Physicist", "Writer", "Designer"];
const education = ["Master's Degree", "Bachelor's Degree", "PhD", "MBA", "MBBS", "B.Tech"];

const generateUsers = async () => {
    const extraUsers = [];
    const password = await bcrypt.hash("password123", 10);
    const surnames = ["Sharma", "Patel", "Iyer", "Khan", "Gill", "Malhotra", "Reddy", "Verma", "Das", "Joshi", "Chawla", "Mehta", "Bhasin", "Tiwari", "Rawat", "Kulkarni", "Deshmukh", "Pillai", "Menon", "Bose"];

    for (let i = 1; i <= 40; i++) {
        const isFemale = i <= 20;
        const name = isFemale ? femaleNames[(i-1) % femaleNames.length] : maleNames[(i-21) % maleNames.length];
        const surname = surnames[i % surnames.length];
        const fullName = `${name} ${surname}`;
        const email = `${name.toLowerCase()}.${surname.toLowerCase()}${i}@demo.com`;
        
        // Image logic: DiceBear Avatar (SVG)
        const photoSeed = `seed-${i}-${Date.now()}`;
        const photoUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${photoSeed}`;

        extraUsers.push({
            name: fullName,
            fullName: fullName,
            email: email,
            password: password,
            phone: `9${(100000000 + i + Math.floor(Math.random() * 900000000)).toString().substring(0, 9)}`,
            gender: isFemale ? "Female" : "Male",
            age: 22 + (i % 15),
            dob: new Date(1990 + (i % 12), i % 12, 1),
            religion: religions[i % religions.length],
            community: communities[i % communities.length],
            motherTongue: ["Hindi", "English", "Marathi", "Punjabi", "Gujarati", "Bengali"][i % 6],
            city: cities[i % cities.length],
            state: "Various",
            height: `${5 + (i % 2)}'${2 + (i % 10)}\"`,
            education: education[i % education.length],
            occupation: occupations[i % occupations.length],
            annualIncome: ["₹5L - ₹10L", "₹10L - ₹15L", "₹15L - ₹20L", "₹20L - ₹30L", "Above ₹30L"][i % 5],
            isVerified: i % 3 === 0,
            isPremium: i % 4 === 0,
            photos: [{ url: photoUrl, isPrimary: true }],
            bio: `Hello! I am ${fullName}, a ${occupations[i % occupations.length]} looking for a companion who shares similar values and interests.`,
            lastActive: new Date()
        });
    }
    return extraUsers;
};

const seedExtra = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const extraUsersData = await generateUsers();
        
        // Clean up previous demo users
        const deleteResult = await User.deleteMany({ email: /.*@demo\.com/ });
        console.log(`Cleaned up ${deleteResult.deletedCount} previous demo users.`);

        await User.insertMany(extraUsersData);
        console.log(`Successfully seeded ${extraUsersData.length} total extra dummy profiles!`);
        
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};


seedExtra();
