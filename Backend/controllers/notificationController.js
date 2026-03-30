const Notification = require('../models/Notification');

// TASK 4 — GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({ userId })
      .populate('fromUser', 'name photos')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error("Get Notifications Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 5 — PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Mark All Read Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// TASK 6 — PUT /api/notifications/read/:id
exports.markOneRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Mark One Read Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
