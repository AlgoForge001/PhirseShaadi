const User = require('../models/User');
const { analyzeCompatibility } = require('../utils/geminiAI');

const getOppositeGenderRegex = (genderValue) => {
  const value = (genderValue || '').toString().trim().toLowerCase();
  if (value === 'male') return /^female$/i;
  if (value === 'female') return /^male$/i;
  return null;
};

// GET /api/search
exports.searchUsers = async (req, res) => {
  try {
    const {
      minAge, maxAge, religion, city, state,
      education, jobType, income, gender, manglik,
      page = 1, limit = 10
    } = req.query;

    const currentUser = await User.findById(req.user.userId).select('blockedUsers gender');
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✅ FIX: Build _id query correctly so $ne and $nin don't overwrite each other
    const idQuery = { $ne: req.user.userId };
    if (currentUser.blockedUsers && currentUser.blockedUsers.length > 0) {
      idQuery.$nin = currentUser.blockedUsers;
    }

    const query = { _id: idQuery };

    // Age to Date of Birth range conversion
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

    // Dynamic filter building
    if (religion) query.religion = religion;
    if (city) query.city = city;
    if (state) query.state = state;
    if (education) query.education = education;
    if (jobType) query.jobType = jobType;
    if (income) query.income = income;
    
    // Gender Filter: Use provided gender OR default to opposite
    if (gender) {
      query.gender = new RegExp(`^${gender}$`, 'i');
    } else {
      const oppositeGenderRegex = getOppositeGenderRegex(currentUser.gender);
      if (oppositeGenderRegex) query.gender = oppositeGenderRegex;
    }

    if (manglik) query.manglik = manglik;

    // Pagination & Execution
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
    console.error("Search Error:", error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
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

  // 1. Religion (15%)
  if (prefs.religion && candidate.religion === prefs.religion) score += 15;
  else if (!prefs.religion && candidate.religion === user.religion) score += 10;

  // 2. Age (15%)
  const age = calculateAge(candidate.dob);
  const minAge = prefs.minAge || 18;
  const maxAge = prefs.maxAge || 60;
  if (age >= minAge && age <= maxAge) score += 15;
  else if (age >= minAge - 2 && age <= maxAge + 2) score += 7;

  // 3. Location (10%)
  if (prefs.city && candidate.city === prefs.city) score += 10;
  else if (candidate.city === user.city) score += 8;
  else if (candidate.state === user.state) score += 5;

  // 4. Education & Profession (10%)
  if (prefs.education && candidate.education === prefs.education) score += 10;
  else if (candidate.education === user.education) score += 5;

  // 5. Income (10%)
  if (prefs.income && candidate.income === prefs.income) score += 10;

  // 6. Mother Tongue (10%)
  if (candidate.motherTongue === user.motherTongue) score += 10;

  // 7. Marital Status (10%)
  if (candidate.maritalStatus === user.maritalStatus) score += 10;
  else if (user.maritalStatus === 'Never Married' && candidate.maritalStatus === 'Never Married') score += 10;

  // 8. Diet (10%)
  if (candidate.diet && user.diet && candidate.diet === user.diet) score += 10;
  else if (!candidate.diet || !user.diet) score += 5;

  // 9. Smoking & Drinking (10%)
  if (candidate.smoking === user.smoking) score += 5;
  if (candidate.drinking === user.drinking) score += 5;

  // Ensure score doesn't exceed 100
  return Math.min(score, 100);
};

// GET /api/matches/recommended
exports.getRecommendedMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('partnerPreferences blockedUsers gender religion city state education income');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { partnerPreferences, blockedUsers, gender } = user;
    const oppositeGenderRegex = getOppositeGenderRegex(gender);

    // ✅ FIX: Correctly merge $ne and $nin
    const idQuery = { $ne: req.user.userId };
    if (blockedUsers && blockedUsers.length > 0) {
      idQuery.$nin = blockedUsers;
    }

    const query = { _id: idQuery };

    if (oppositeGenderRegex) {
      query.gender = oppositeGenderRegex;
    }

    const candidates = await User.find(query)
      .select('-password -otp -otpExpiry')
      .limit(100);

    const matchedUsers = candidates.map(candidate => {
      const score = calculateMatchScore(user, candidate);
      return {
        ...candidate.toObject(),
        matchPercentage: score
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    const finalMatches = matchedUsers.slice(0, 20);

    res.status(200).json({
      success: true,
      count: finalMatches.length,
      data: finalMatches
    });

  } catch (error) {
    console.error("Recommended Matches Error:", error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
  }
};

// GET /api/matches/same-city
exports.getSameCityMatches = async (req, res) => {
  try {
    const { minAge, maxAge, religion, education, jobType, income, manglik } = req.query;
    const user = await User.findById(req.user.userId).select('city gender blockedUsers');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.city) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        message: 'Set your city in profile to use same city matching.'
      });
    }

    // ✅ FIX: Correctly merge $ne and $nin
    const idQuery = { $ne: req.user.userId };
    if (user.blockedUsers && user.blockedUsers.length > 0) {
      idQuery.$nin = user.blockedUsers;
    }

    const query = {
      _id: idQuery,
      city: user.city
    };

    const oppositeGenderRegex = getOppositeGenderRegex(user.gender);
    if (oppositeGenderRegex) {
      query.gender = oppositeGenderRegex;
    }

    if (religion) query.religion = religion;
    if (education) query.education = education;
    if (jobType) query.jobType = jobType;
    if (income) query.income = income;
    if (manglik) query.manglik = manglik;

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

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: matches.length,
      city: user.city,
      data: matches
    });
  } catch (error) {
    console.error('Same City Matches Error:', error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
  }
};


// GET /api/matches/new-joins
exports.getNewJoins = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const user = await User.findById(req.user.userId).select('blockedUsers gender');

    // ✅ FIX: Correctly merge $ne and $nin
    const idQuery = { $ne: req.user.userId };
    if (user && user.blockedUsers && user.blockedUsers.length > 0) {
      idQuery.$nin = user.blockedUsers;
    }

    const query = { _id: idQuery, createdAt: { $gte: sevenDaysAgo } };

    if (user) {
      const oppositeGenderRegex = getOppositeGenderRegex(user.gender);
      if (oppositeGenderRegex) {
        query.gender = oppositeGenderRegex;
      }
    }

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error("New Joins Error:", error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
  }
};

// GET /api/matches/recently-active
exports.getRecentlyActive = async (req, res) => {
  try {
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const user = await User.findById(req.user.userId).select('blockedUsers gender');

    // ✅ FIX: Correctly merge $ne and $nin
    const idQuery = { $ne: req.user.userId };
    if (user && user.blockedUsers && user.blockedUsers.length > 0) {
      idQuery.$nin = user.blockedUsers;
    }

    const query = { _id: idQuery, lastActive: { $gte: oneDayAgo } };

    if (user) {
      const oppositeGenderRegex = getOppositeGenderRegex(user.gender);
      if (oppositeGenderRegex) {
        query.gender = oppositeGenderRegex;
      }
    }

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ lastActive: -1 })
      .limit(20);

    res.status(200).json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error("Recently Active Error:", error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
  }
};

// GET /api/matches/smart-match
exports.getSmartMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 1. Get pool of candidates
    const oppositeGenderRegex = getOppositeGenderRegex(user.gender);
    const query = { 
      _id: { $ne: req.user.userId, $nin: user.blockedUsers || [] }
    };
    if (oppositeGenderRegex) query.gender = oppositeGenderRegex;

    // Filter by religion if user has one (simple preference)
    if (user.religion) query.religion = user.religion;

    const candidates = await User.find(query)
      .select('-password -otp -otpExpiry')
      .limit(30);

    // 2. Score them using static logic first
    const scoredCandidates = candidates.map(c => ({
      profile: c,
      staticScore: calculateMatchScore(user, c)
    })).sort((a, b) => b.staticScore - a.staticScore);

    // 3. Take top 6 for AI Deep Analysis
    const topCandidates = scoredCandidates.slice(0, 6);
    
    const smartMatches = await Promise.all(topCandidates.map(async (item) => {
      try {
        const aiResult = await analyzeCompatibility(user, item.profile);
        return {
          ...item.profile.toObject(),
          staticScore: item.staticScore,
          aiScore: aiResult.score,
          matchPercentage: Math.round((item.staticScore * 0.4) + (aiResult.score * 0.6)),
          aiInsight: aiResult.reason,
          aiTags: aiResult.tags,
          isSmartMatch: true
        };
      } catch (err) {
        return {
          ...item.profile.toObject(),
          matchPercentage: item.staticScore,
          isSmartMatch: false
        };
      }
    }));

    const finalData = smartMatches.filter(m => m.isSmartMatch).sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json({
      success: true,
      count: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("Smart Match Error:", error.message);
    res.status(500).json({ success: false, count: 0, data: [], message: "Server error" });
  }
};