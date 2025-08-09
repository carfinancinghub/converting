const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Set to your frontend URL in production
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`🧩 User connected: ${socket.id}`);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`📥 Joined room: ${roomId}`);
  });

  socket.on('sendMessage', (messageData) => {
    io.to(messageData.conversationId).emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.set('socketio', io); // Make io accessible in routes (e.g., to emit on POST)

// Middleware
app.use(express.json());

// Routes
const usersRoutes = require('./routes/users');
const disputesRoutes = require('./routes/disputes');
const escrowRoutes = require('./routes/escrow');
const auctionsRoutes = require('./routes/auctions');
const carsRoutes = require('./routes/cars');
const notificationsRoutes = require('./routes/notifications');
const errorLogsRoutes = require('./routes/errorLogs');
const matchmakerRoutes = require('./routes/matchmaker');
const blockchainAuditRoutes = require('./routes/blockchainAudit');
const analyticsRoutes = require('./routes/analytics');
const escrowNotesRoute = require('./routes/escrowNotesRoute');
const inspectionRoutes = require('./routes/inspectionRoutes');
const messagesRoutes = require('./routes/messages');
const suggestPriceRoutes = require('./routes/suggestPrice');
const listingsRoutes = require('./routes/listings');
const forumRoutes = require('./routes/forum');
const aiRoutes = require('./routes/ai');

app.use('/api/users', usersRoutes);
app.use('/api/disputes', disputesRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/auctions', auctionsRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/error-logs', errorLogsRoutes);
app.use('/api/matchmaker', matchmakerRoutes);
app.use('/api/blockchain-audit', blockchainAuditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/escrow-notes', escrowNotesRoute);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/listings/suggest-price', suggestPriceRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;