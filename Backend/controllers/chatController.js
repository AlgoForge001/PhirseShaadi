const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// Task 5: GET /api/chat/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'name city state education profession photos')
    .sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error("Get Conversations Error (mock fallback):", error.message);
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};

// Task 6: GET /api/chat/:userId
exports.getChatHistory = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherId = req.params.userId;

    // Build conversationId from both userIds (sorted alphabetically)
    const conversationId = [myId, otherId].sort().join('_');

    // 1. Find all messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    // 2. Mark all unread messages as read
    await Message.updateMany(
      { conversationId, to: myId, isRead: false },
      { $set: { isRead: true } }
    );

    // 3. Reset unreadCount for current user in Conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [myId, otherId] }
    });
    if (conversation && conversation.unreadCount) {
      conversation.unreadCount[myId] = 0;
      conversation.markModified('unreadCount');
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    console.error("Get Chat History Error (mock fallback):", error.message);
    res.status(200).json({ success: true, count: 0, data: [] });
  }
};

// GET /api/chat/access/:userId
exports.checkChatAccess = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherId = req.params.userId;

    const Interest = require('../models/Interest');
    
    // Check if there is an accepted interest between the two users
    const acceptedInterest = await Interest.findOne({
      $or: [
        { from: myId, to: otherId, status: 'accepted' },
        { from: otherId, to: myId, status: 'accepted' }
      ]
    });

    res.status(200).json({
      success: true,
      canChat: !!acceptedInterest,
      interest: acceptedInterest || null
    });

  } catch (error) {
    console.error("Check Chat Access Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
