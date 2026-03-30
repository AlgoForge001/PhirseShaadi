const Notification = require('../models/Notification');

/**
 * Reusable function to send notifications
 * @param {Object} options - userId, type, message, fromUser, link, io, onlineUsers
 */
const sendNotification = async ({ userId, type, message, fromUser, link, io, onlineUsers }) => {
  try {
    // 1. Save notification to MongoDB
    const notification = new Notification({
      userId,
      type,
      message,
      fromUser,
      link
    });
    await notification.save();

    // 2. If user is online, emit real-time event
    if (io && onlineUsers) {
      const socketId = onlineUsers.get(userId.toString());
      if (socketId) {
        // Populate fromUser info before emitting if needed, but for simplicity we emit the new notification
        // The frontend can fetch populated data or we can do it here.
        // Task says: emit 'notification:new'
        io.to(socketId).emit('notification:new', notification);
      }
    }

    return notification;
  } catch (error) {
    console.error("Send Notification Error:", error);
  }
};

module.exports = sendNotification;
