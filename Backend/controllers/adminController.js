const User = require('../models/User');
const Report = require('../models/Report');

// TASK 1 — Update GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    const monthAgo = new Date();
    monthAgo.setMonth(today.getMonth() - 1);

    const totalUsers = await User.countDocuments({ role: 'user' });
    const newToday = await User.countDocuments({ role: 'user', createdAt: { $gte: today } });
    const newThisWeek = await User.countDocuments({ role: 'user', createdAt: { $gte: weekAgo } });
    const newThisMonth = await User.countDocuments({ role: 'user', createdAt: { $gte: monthAgo } });
    
    const premiumUsers = await User.countDocuments({ role: 'user', isPremium: true });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    
    const activeToday = await User.countDocuments({ role: 'user', lastActive: { $gte: today } });
    const activeThisWeek = await User.countDocuments({ role: 'user', lastActive: { $gte: weekAgo } });

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    // Payment model missing, using 0 for now as placeholder
    const totalRevenue = 0;
    const revenueThisMonth = 0;

    const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) + '%' : '0%';

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        newToday,
        newThisWeek,
        newThisMonth,
        premiumUsers,
        verifiedUsers,
        activeToday,
        activeThisWeek,
        totalReports,
        pendingReports,
        totalRevenue,
        revenueThisMonth,
        conversionRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: error.message });
  }
};

// TASK 2 — GET /api/admin/stats/daily-registrations
exports.getDailyRegistrations = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrations = await User.aggregate([
      {
        $match: {
          role: 'user',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill in missing dates with 0
    const dailyData = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().split('T')[0];
      const found = registrations.find(r => r._id === dateStr);
      dailyData.push({ date: dateStr, count: found ? found.count : 0 });
    }

    res.status(200).json({ success: true, data: dailyData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch daily registrations", error: error.message });
  }
};

// TASK 3 — GET /api/admin/stats/religion-distribution
exports.getReligionDistribution = async (req, res) => {
  try {
    const total = await User.countDocuments({ role: 'user' });
    const distribution = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: "$religion", count: { $sum: 1 } } }
    ]);

    const data = distribution.map(item => ({
      religion: item._id || "Other",
      count: item.count,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(1) + '%' : '0%'
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch religion distribution", error: error.message });
  }
};

// TASK 4 — GET /api/admin/stats/city-distribution
exports.getCityDistribution = async (req, res) => {
  try {
    const distribution = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const data = distribution.map(item => ({
      city: item._id || "Unknown",
      count: item.count
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch city distribution", error: error.message });
  }
};

// TASK 5 — GET /api/admin/stats/monthly-revenue (Returning 0 for now)
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const monthlyData = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${months[d.getMonth()]} ${d.getFullYear()}`;
      monthlyData.push({ month: monthLabel, revenue: 0, count: 0 });
    }

    res.status(200).json({ success: true, data: monthlyData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch monthly revenue", error: error.message });
  }
};

// TASK 6 — GET /api/admin/stats/plan-distribution (Returning 0 for now)
exports.getPlanDistribution = async (req, res) => {
  try {
    const data = [
      { plan: "1month", count: 0, revenue: 0 },
      { plan: "3months", count: 0, revenue: 0 },
      { plan: "6months", count: 0, revenue: 0 },
      { plan: "1year", count: 0, revenue: 0 }
    ];
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch plan distribution", error: error.message });
  }
};

// GET /api/admin/activity
exports.getActivity = async (req, res) => {
  try {
    const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5);
    const recentReports = await Report.find().populate('reportedBy reportedUser').sort({ createdAt: -1 }).limit(5);

    const activity = [
      ...recentUsers.map(u => ({
        type: 'registration',
        message: `New user registered: ${u.name} — ${u.city || 'Unknown'}`,
        date: u.createdAt
      })),
      ...recentReports.map(r => ({
        type: 'report',
        message: `Report filed against: ${r.reportedUser?.name || 'Unknown'}`,
        date: r.createdAt
      }))
    ].sort((a, b) => b.date - a.date).slice(0, 10);

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch activity", error: error.message });
  }
};

// GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password -otp -otpExpiry').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Deletion failed", error: error.message });
  }
};

// POST /api/admin/users/:id/verify (Quick toggle verification)
exports.toggleVerify = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    
    user.isVerified = !user.isVerified;
    await user.save();
    
    res.status(200).json({ success: true, message: `User verified status: ${user.isVerified}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Operation failed", error: error.message });
  }
};
