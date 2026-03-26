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

// GET /api/matches/recommended
exports.getRecommendedMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('partnerPreferences blockedUsers');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { partnerPreferences, blockedUsers } = user;
    const query = { _id: { $ne: req.user.userId } };

    if (blockedUsers && blockedUsers.length > 0) {
      query._id.$nin = blockedUsers;
    }

    if (partnerPreferences) {
      if (partnerPreferences.religion) query.religion = partnerPreferences.religion;
      if (partnerPreferences.city) query.city = partnerPreferences.city;
      if (partnerPreferences.state) query.state = partnerPreferences.state;
      if (partnerPreferences.education) query.education = partnerPreferences.education;
      
      // Age range to DOB range
      if (partnerPreferences.minAge || partnerPreferences.maxAge) {
        const currentYear = new Date().getFullYear();
        const birthQuery = {};
        if (partnerPreferences.minAge) {
          const maxBirthDate = new Date();
          maxBirthDate.setFullYear(currentYear - partnerPreferences.minAge);
          birthQuery.$lte = maxBirthDate;
        }
        if (partnerPreferences.maxAge) {
          const minBirthDate = new Date();
          minBirthDate.setFullYear(currentYear - partnerPreferences.maxAge - 1);
          birthQuery.$gte = minBirthDate;
        }
        query.dob = birthQuery;
      }
    }

    const matches = await User.find(query)
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
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
