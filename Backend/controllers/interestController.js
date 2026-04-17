const Interest = require('../models/Interest');
const User = require('../models/User');

// Task 2: POST /api/interest/send
exports.sendInterest = async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    const fromUserId = req.user.userId;

    // 1. Check: cant send interest to themselves
    if (fromUserId === toUserId) {
      return res.status(400).json({ success: false, message: "You cannot send interest to yourself" });
    }

    // 2. Check: interest already sent?
    const existingInterest = await Interest.findOne({ from: fromUserId, to: toUserId });
    if (existingInterest) {
      return res.status(400).json({ success: false, message: "Interest already sent to this user" });
    }

    // 3. Create new Interest
    const newInterest = new Interest({
      from: fromUserId,
      to: toUserId,
      message
    });

    await newInterest.save();

    // Task 3: Notify receiver
    const sendNotification = require('../utils/sendNotification');
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    await sendNotification({
      userId: toUserId,
      type: 'interest_received',
      message: "Someone sent you an interest!",
      fromUser: fromUserId,
      link: '/interests/received',
      io,
      onlineUsers
    });

    res.status(201).json({
      success: true,
      message: "Interest sent successfully"
    });

  } catch (error) {
    console.error("Send Interest Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Task 3: GET /api/interest/received
exports.getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ to: req.user.userId })
      .populate('from', 'name city state education profession') // Using profession as job
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    console.error("Get Received Interests Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Task 4: GET /api/interest/sent
exports.getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ from: req.user.userId })
      .populate('to', 'name city state education profession')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: interests.length,
      data: interests
    });
  } catch (error) {
    console.error("Get Sent Interests Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Task 5: PUT /api/interest/respond
exports.respondInterest = async (req, res) => {
  try {
    const { interestId, status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status. Use 'accepted' or 'rejected'" });
    }

    const interest = await Interest.findById(interestId);

    if (!interest) {
      return res.status(404).json({ success: false, message: "Interest not found" });
    }

    // Check: only the receiver can respond
    if (interest.to.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to respond to this interest" });
    }

    interest.status = status;
    if (status === 'accepted') {
      interest.chatRequestStatus = 'accepted';

      // Task 3: Notify sender that interest was accepted
      const sendNotification = require('../utils/sendNotification');
      const io = req.app.get('io');
      const onlineUsers = req.app.get('onlineUsers');
      await sendNotification({
        userId: interest.from, // interest.from is the original sender
        type: 'interest_accepted',
        message: "Your interest was accepted!",
        fromUser: req.user.userId, // me (the receiver who accepted)
        link: `/chat/${req.user.userId}`,
        io,
        onlineUsers
      });
    }
    interest.updatedAt = new Date();
    await interest.save();

    res.status(200).json({
      success: true,
      message: `Interest ${status} successfully`
    });

  } catch (error) {
    console.error("Respond Interest Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET /api/interest/accepted
exports.getAcceptedInterests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const acceptedReceived = await Interest.find({ to: userId, status: 'accepted' })
      .populate('from', 'name fullName city state education profession photos online')
      .sort({ updatedAt: -1 });

    const acceptedSent = await Interest.find({ from: userId, status: 'accepted' })
      .populate('to', 'name fullName city state education profession photos online')
      .sort({ updatedAt: -1 });

    const combined = [
      ...acceptedReceived.map(interest => ({ ...interest.toObject(), user: interest.from })),
      ...acceptedSent.map(interest => ({ ...interest.toObject(), user: interest.to }))
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    console.error("Get Accepted Interests Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// GET /api/interest/status/:userId
exports.getInterestStatus = async (req, res) => {
  try {
    const fromId = req.user.userId;
    const toId = req.params.userId;

    const sentInterest = await Interest.findOne({ from: fromId, to: toId });
    const receivedInterest = await Interest.findOne({ from: toId, to: fromId });

    let interestStatus = { sent: false, received: false, status: null, interestId: null };

    if (sentInterest) {
      interestStatus = { sent: true, received: false, status: sentInterest.status, interestId: sentInterest._id };
    } else if (receivedInterest) {
      interestStatus = { sent: false, received: true, status: receivedInterest.status, interestId: receivedInterest._id };
    }

    res.status(200).json({ success: true, interestStatus });
  } catch (error) {
    console.error("Get Interest Status Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
