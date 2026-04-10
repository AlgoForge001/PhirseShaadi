require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('./config/passport'); // Will be removed later if not used anywhere else

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: "https://phirse-shaadi.vercel.app",
    methods: ["GET", "POST"]
  }
});

// Map to track online users: { userId: socketId }
const onlineUsers = new Map();

app.set('io', io);
app.set('onlineUsers', onlineUsers);

// Middleware
app.use(cors({
  origin: "https://phirse-shaadi.vercel.app"
}));
app.use(express.json());

// Session and Passport middleware removed (Moved to Clerk)


// MongoDB Connection (family: 4 forces IPv4 — fixes Node.js 18+ DNS issues)
mongoose.connect(process.env.MONGO_URI, {
  family: 4,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message));

// Routes
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const interestRoutes = require('./routes/interest');
const shortlistRoutes = require('./routes/shortlist');
const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
const privacyRoutes = require('./routes/privacy');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notification');
const familyRoutes = require('./routes/family');
const updateLastActive = require('./middleware/activity');

app.use('/api/auth', authRoutes);
app.use('/api/profile', updateLastActive, profileRoutes);
app.use('/api/privacy', updateLastActive, privacyRoutes);
app.use('/api/user', updateLastActive, userRoutes);
app.use('/api/search', updateLastActive, searchRoutes);
app.use('/api/matches', updateLastActive, searchRoutes);
app.use('/api/interest', updateLastActive, interestRoutes);
app.use('/api/shortlist', updateLastActive, shortlistRoutes);
app.use('/api/family', updateLastActive, familyRoutes);
app.use('/api/chat', updateLastActive, chatRoutes);
app.use('/api/notifications', updateLastActive, notificationRoutes);

// Test Route
app.get('/', (req, res) => {


  res.json({ message: "PhirseShadi backend chal raha hai!" });
});

const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const Interest = require('./models/Interest');

// Socket.io Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Task 4: message:send Socket Event
  socket.on('message:send', async (data) => {
    try {
      const { from, to, text } = data;

      // Task 7: Check if interest is accepted before allowing chat
      const interest = await Interest.findOne({
        $or: [
          { from: from, to: to, status: 'accepted' },
          { from: to, to: from, status: 'accepted' }
        ]
      });

      if (!interest) {
        return socket.emit('error', { message: "Accept interest first to chat" });
      }

      // Combine userIds sorted for conversationId (Task 1 logic)
      const conversationId = [from, to].sort().join('_');

      // 1. Save message to MongoDB
      const newMessage = new Message({
        conversationId,
        from,
        to,
        text
      });
      await newMessage.save();

      // 2. Update or Create Conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [from, to] }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [from, to]
        });
      }

      conversation.lastMessage = text;
      conversation.lastMessageTime = new Date();
      
      // Update unread count for the receiver
      if (!conversation.unreadCount) conversation.unreadCount = {};
      const currentUnread = conversation.unreadCount[to] || 0;
      conversation.unreadCount[to] = currentUnread + 1;
      
      // Since it's an Object/Schema.Types.Mixed, we must mark it as modified
      conversation.markModified('unreadCount');
      
      await conversation.save();

      // 3. Emit to receiver if online
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message:receive', newMessage);
      } else {
        console.log(`User ${to} is offline. Message saved.`);
      }

      // Task 3: Notify receiver about new message
      const sendNotification = require('./utils/sendNotification');
      await sendNotification({
        userId: to,
        type: 'new_message',
        message: "You have a new message",
        fromUser: from,
        link: `/chat/${from}`,
        io,
        onlineUsers
      });

      // Also emit back to sender to confirm
      socket.emit('message:sent', newMessage);

    } catch (error) {
      console.error("Socket Message Error:", error);
      socket.emit('error', { message: "Failed to send message" });
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});


// Server Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server port ${PORT} pe chal raha hai!`);
});
