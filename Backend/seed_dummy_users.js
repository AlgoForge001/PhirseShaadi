const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const dummyUsers = [
  {
    name: 'Aditi Sharma',
    fullName: 'Aditi Sharma',
    email: 'aditi.sharma.demo1@example.com',
    password: 'password123',
    phone: '99010000001',
    gender: 'Female',
    dob: '1998-04-12',
    religion: 'Hindu',
    community: 'Brahmin',
    motherTongue: 'Hindi',
    city: 'Delhi',
    state: 'Delhi',
    height: '5\'3"',
    education: "Master's Degree",
    occupation: 'Software Engineer',
    annualIncome: '₹10L - ₹15L',
    isVerified: true,
    isPremium: true,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aditi-sharma', isPrimary: true }],
    bio: 'Software engineer who enjoys music, reading, and weekend getaways.'
  },


  
  {
    name: 'Priya Patel',
    fullName: 'Priya Patel',
    email: 'priya.patel.demo2@example.com',
    password: 'password123',
    phone: '99010000002',
    gender: 'Female',
    dob: '2000-09-21',
    religion: 'Hindu',
    community: 'Patel',
    motherTongue: 'Gujarati',
    city: 'Ahmedabad',
    state: 'Gujarat',
    height: '5\'2"',
    education: "Bachelor's Degree",
    occupation: 'Doctor',
    annualIncome: '₹15L - ₹20L',
    isVerified: false,
    isPremium: true,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-patel', isPrimary: true }],
    bio: 'Doctor by profession, calm and family-oriented by nature.'
  },
  {
    name: 'Sara Khan',
    fullName: 'Sara Khan',
    email: 'sara.khan.demo3@example.com',
    password: 'password123',
    phone: '99010000003',
    gender: 'Female',
    dob: '1997-02-08',
    religion: 'Muslim',
    community: 'Syed',
    motherTongue: 'Urdu',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    height: '5\'5"',
    education: "Master's Degree",
    occupation: 'Teacher',
    annualIncome: '₹5L - ₹10L',
    isVerified: true,
    isPremium: false,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara-khan', isPrimary: true }],
    bio: 'Teacher who values education, empathy, and strong family bonds.'
  },
  {
    name: 'Neha Verma',
    fullName: 'Neha Verma',
    email: 'neha.verma.demo4@example.com',
    password: 'password123',
    phone: '99010000004',
    gender: 'Female',
    dob: '1999-11-30',
    religion: 'Sikh',
    community: 'Khatri',
    motherTongue: 'Punjabi',
    city: 'Chandigarh',
    state: 'Punjab',
    height: '5\'4"',
    education: 'MBA',
    occupation: 'Product Manager',
    annualIncome: '₹20L - ₹30L',
    isVerified: false,
    isPremium: false,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha-verma', isPrimary: true }],
    bio: 'Product manager who enjoys travel, good food, and meaningful conversations.'
  },
  {
    name: 'Rahul Sharma',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma.demo1@example.com',
    password: 'password123',
    phone: '99010000005',
    gender: 'Male',
    dob: '1996-05-16',
    religion: 'Hindu',
    community: 'Brahmin',
    motherTongue: 'Hindi',
    city: 'Jaipur',
    state: 'Rajasthan',
    height: '5\'10"',
    education: 'Engineering',
    occupation: 'Software Engineer',
    annualIncome: '₹15L - ₹20L',
    isVerified: true,
    isPremium: true,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul-sharma', isPrimary: true }],
    bio: 'Engineer focused on building useful products and keeping life balanced.'
  },
  {
    name: 'Arjun Singh',
    fullName: 'Arjun Singh',
    email: 'arjun.singh.demo2@example.com',
    password: 'password123',
    phone: '99010000006',
    gender: 'Male',
    dob: '1994-12-04',
    religion: 'Sikh',
    community: 'Jat',
    motherTongue: 'Punjabi',
    city: 'Amritsar',
    state: 'Punjab',
    height: '6\'0"',
    education: 'MBA',
    occupation: 'Business Owner',
    annualIncome: '₹30L - ₹50L',
    isVerified: false,
    isPremium: true,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun-singh', isPrimary: true }],
    bio: 'Business owner who likes fitness, family values, and travel.'
  },
  {
    name: 'Ishaan Mehta',
    fullName: 'Ishaan Mehta',
    email: 'ishaan.mehta.demo3@example.com',
    password: 'password123',
    phone: '99010000007',
    gender: 'Male',
    dob: '1998-07-19',
    religion: 'Hindu',
    community: 'Gujarati',
    motherTongue: 'Gujarati',
    city: 'Mumbai',
    state: 'Maharashtra',
    height: '5\'9"',
    education: "Master's Degree",
    occupation: 'Doctor',
    annualIncome: '₹20L - ₹30L',
    isVerified: true,
    isPremium: false,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ishaan-mehta', isPrimary: true }],
    bio: 'Doctor who enjoys music, reading, and spending time with family.'
  },
  {
    name: 'Varun Reddy',
    fullName: 'Varun Reddy',
    email: 'varun.reddy.demo4@example.com',
    password: 'password123',
    phone: '99010000008',
    gender: 'Male',
    dob: '1995-10-27',
    religion: 'Hindu',
    community: 'Reddy',
    motherTongue: 'Telugu',
    city: 'Hyderabad',
    state: 'Telangana',
    height: '5\'11"',
    education: 'PhD',
    occupation: 'Data Scientist',
    annualIncome: 'Above ₹50L',
    isVerified: false,
    isPremium: true,
    photos: [{ url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=varun-reddy', isPrimary: true }],
    bio: 'Data scientist who loves solving problems and exploring new places.'
  }
];

async function seedDummyUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    const demoEmails = dummyUsers.map((user) => user.email);
    const deleted = await User.deleteMany({ email: { $in: demoEmails } });
    console.log(`Removed ${deleted.deletedCount} existing dummy users.`);

    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.insertMany(hashedUsers);
    console.log('Inserted 8 dummy users: 4 male and 4 female.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Dummy user seed failed:', error);
    process.exit(1);
  }
}

seedDummyUsers();