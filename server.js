require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/passport'); // Import passport config

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Session for Passport (Required for OAuth even if we use JWT)
app.use(session({
  secret: process.env.SESSION_SECRET || 'phirseshadi_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {


  res.json({ message: "PhirseShadi backend chal raha hai!" });
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server port ${PORT} pe chal raha hai!`);
});
