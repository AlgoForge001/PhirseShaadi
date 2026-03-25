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
