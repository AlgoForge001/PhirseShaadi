const User = require('../models/User');

// GET /api/search
// Logic for searching users with dynamic filters and pagination
exports.searchUsers = async (req, res) => {
  try {
    const {
      minAge, maxAge, religion, city, state, 
      education, jobType, income, gender, manglik,
      page = 1, limit = 10
    } = req.query;

    const query = { _id: { $ne: req.user.userId } };

    // 1. Age to Date of Birth range conversion
    if (minAge || maxAge) {
      const currentYear = new Date().getFullYear();
      const birthQuery = {};
      
      if (minAge) {
        const maxBirthDate = new Date();
        maxBirthDate.setFullYear(currentYear - parseInt(minAge));
        birthQuery.$lte = maxBirthDate;
      }
      
      if (maxAge) {
        const minBirthDate = new Date();
        minBirthDate.setFullYear(currentYear - parseInt(maxAge) - 1);
        birthQuery.$gte = minBirthDate;
      }
      
      query.dob = birthQuery;
    }

    // 2. Dynamic filter building
    if (religion) query.religion = religion;
    if (city) query.city = city;
    if (state) query.state = state;
    if (education) query.education = education;
    if (jobType) query.jobType = jobType;
    if (income) query.income = income;
    if (gender) query.gender = gender;
    if (manglik) query.manglik = manglik;

    // 3. Exclude blocked users
    const currentUser = await User.findById(req.user.userId).select('blockedUsers');
    if (currentUser && currentUser.blockedUsers.length > 0) {
      query._id.$nin = currentUser.blockedUsers;
    }

    // 4. Pagination & Execution
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Helper: Calculate age from DOB
const calculateAge = (dob) => {
  if (!dob) return 0;
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Helper: Match Score Logic
const calculateMatchScore = (user, candidate) => {
  let score = 0;
  const prefs = user.partnerPreferences || {};

  // 1. Religion (20%)
  if (prefs.religion && candidate.religion === prefs.religion) score += 20;

  // 2. Age (20%)
  const age = calculateAge(candidate.dob);
  if (prefs.minAge && prefs.maxAge) {
    if (age >= prefs.minAge && age <= prefs.maxAge) score += 20;
    else if (age >= prefs.minAge - 2 && age <= prefs.maxAge + 2) score += 10;
  }

  // 3. Location (20%)
  if (prefs.city && candidate.city === prefs.city) score += 20;
  else if (prefs.state && candidate.state === prefs.state) score += 10;

  // 4. Education (20%)
  if (prefs.education && candidate.education === prefs.education) score += 20;

  // 5. Income (20%)
  if (prefs.income && candidate.income === prefs.income) score += 20;

  return score;
};

// GET /api/matches/recommended
exports.getRecommendedMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('partnerPreferences blockedUsers gender religion city state education income');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { partnerPreferences, blockedUsers, gender } = user;
    
    // Base Query: Opposite Gender & Not Blocked
    const query = { 
      _id: { $ne: req.user.userId },
      gender: gender === 'male' ? 'female' : 'male' 
    };

    if (blockedUsers && blockedUsers.length > 0) {
      query._id = { ...query._id, $nin: blockedUsers };
    }

    // Fetch potential candidates (limit 100 for ranking)
    const candidates = await User.find(query)
      .select('-password -otp -otpExpiry')
      .limit(100);

    // Calculate scores and sort
    const matchedUsers = candidates.map(candidate => {
      const score = calculateMatchScore(user, candidate);
      return { 
        ...candidate.toObject(), 
        matchPercentage: score 
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Return top 20
    const finalMatches = matchedUsers.slice(0, 20);

    res.status(200).json({
      success: true,
      count: finalMatches.length,
      data: finalMatches
    });

  } catch (error) {
    console.error("Recommended Matches Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


// GET /api/matches/near-you
exports.getNearYouMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('city state blockedUsers');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { city, state, blockedUsers } = user;
    const baseQuery = { _id: { $ne: req.user.userId } };
    if (blockedUsers && blockedUsers.length > 0) baseQuery._id.$nin = blockedUsers;

    let query = { ...baseQuery, city };
    let matches = await User.find(query).select('-password -otp -otpExpiry').limit(20);

    if (matches.length < 10) {
      const stateQuery = { ...baseQuery, state, city: { $ne: city } };
      const stateMatches = await User.find(stateQuery).select('-password -otp -otpExpiry').limit(20 - matches.length);
      matches = [...matches, ...stateMatches];
    }

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error("Near You Matches Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET /api/matches/new-joins
exports.getNewJoins = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const user = await User.findById(req.user.userId).select('blockedUsers');
    const query = { _id: { $ne: req.user.userId }, createdAt: { $gte: sevenDaysAgo } };
    if (user && user.blockedUsers.length > 0) query._id.$nin = user.blockedUsers;

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error("New Joins Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET /api/matches/recently-active
exports.getRecentlyActive = async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const user = await User.findById(req.user.userId).select('blockedUsers');
    const query = { _id: { $ne: req.user.userId }, lastActive: { $gte: oneDayAgo } };
    if (user && user.blockedUsers.length > 0) query._id.$nin = user.blockedUsers;

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ lastActive: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error("Recently Active Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
