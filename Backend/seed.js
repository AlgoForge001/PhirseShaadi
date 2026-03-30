const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: "Aisha Khan",
    fullName: "Aisha Khan",
    email: "aisha@example.com",
    password: "password123",
    phone: "9876543210",
    gender: "Female",
    age: 26,
    dob: "1998-05-15",
    religion: "Muslim",
    community: "Sunni",
    motherTongue: "Urdu",
    city: "Mumbai",
    state: "Maharashtra",
    height: "5'4\"",
    education: "Master's Degree",
    occupation: "Software Engineer",
    annualIncome: "₹15L - ₹20L",
    isVerified: true,
    isPremium: true,
    photos: [{ url: "https://i.pinimg.com/736x/0c/5c/02/0c5c026703bc14a4ec4e557c0735308e.jpg", isPrimary: true }],
    bio: "Looking for a soulmate who values family and career. I love traveling and reading books."
  },
  {
    name: "Rahul Sharma",
    fullName: "Rahul Sharma",
    email: "rahul@example.com",
    password: "password123",
    phone: "9876543211",
    gender: "Male",
    age: 29,
    dob: "1995-08-22",
    religion: "Hindu",
    community: "Brahmin",
    motherTongue: "Hindi",
    city: "Delhi",
    state: "Delhi",
    height: "5'11\"",
    education: "MBA",
    occupation: "Business Owner",
    annualIncome: "Above ₹50L",
    isVerified: true,
    isPremium: false,
    photos: [{ url: "https://i.pinimg.com/736x/3e/c4/ea/3ec4ea08b3d46d507f6fb47aab1c7f79.jpg", isPrimary: true }],
    bio: "Tech entrepreneur, fitness enthusiast. Looking for someone progressive yet rooted in values."
  },
  {
    name: "Priya Patel",
    fullName: "Priya Patel",
    email: "priya@example.com",
    password: "password123",
    phone: "9876543212",
    gender: "Female",
    age: 24,
    dob: "2000-12-10",
    religion: "Hindu",
    community: "Patel",
    motherTongue: "Gujarati",
    city: "Ahmedabad",
    state: "Gujarat",
    height: "5'2\"",
    education: "Bachelor's Degree",
    occupation: "Doctor",
    annualIncome: "₹20L - ₹30L",
    isVerified: false,
    isPremium: true,
    photos: [{ url: "https://i.pinimg.com/1200x/cc/b2/f7/ccb2f7ac902231def2ea5e938ae1eca4.jpg", isPrimary: true }],
    bio: "Passionate about healthcare and social service. Love animals and classical music."
  },
  {
    name: "Zoya Ahmed",
    fullName: "Zoya Ahmed",
    email: "zoya@example.com",
    password: "password123",
    phone: "9876543213",
    gender: "Female",
    age: 27,
    dob: "1997-03-30",
    religion: "Muslim",
    community: "Syed",
    motherTongue: "Urdu",
    city: "Lucknow",
    state: "Uttar Pradesh",
    height: "5'5\"",
    education: "Master's Degree",
    occupation: "Teacher",
    annualIncome: "₹5L - ₹10L",
    isVerified: true,
    isPremium: false,
    photos: [{ url: "https://i.pinimg.com/736x/50/1f/04/501f04eef76531a1296714c6c9efb41d.jpg", isPrimary: true }],
    bio: "Dedicated educator. I believe in simple living and high thinking."
  },
  {
    name: "Arjun Singh",
    fullName: "Arjun Singh",
    email: "arjun@example.com",
    password: "password123",
    phone: "9876543214",
    gender: "Male",
    age: 31,
    dob: "1993-11-05",
    religion: "Sikh",
    community: "Jat",
    motherTongue: "Punjabi",
    city: "Chandigarh",
    state: "Punjab",
    height: "6'1\"",
    education: "Engineering",
    occupation: "Government Employee",
    annualIncome: "₹10L - ₹15L",
    isVerified: true,
    isPremium: true,
    photos: [{ url: "https://i.pinimg.com/736x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg", isPrimary: true }],
    bio: "Serving the nation. Looking for a partner who is adventurous and kind-hearted."
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clean up existing demo users to prevent duplicate key errors
    const demoEmails = users.map(u => u.email);
    const deleteResult = await User.deleteMany({ email: { $in: demoEmails } });
    console.log(`Cleaned up ${deleteResult.deletedCount} existing demo users.`);

    for (let u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = new User({
        ...u,
        password: hashedPassword
      });
      await user.save();
      console.log(`Seeded user: ${u.name}`);
    }

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
