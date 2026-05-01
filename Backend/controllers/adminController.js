const User = require('../models/User');
const Report = require('../models/Report');

// GET /api/admin/stats
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

    const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) + '%' : '0%';

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
