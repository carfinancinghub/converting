// File: index.js
// Path: backend/index.js
// 👑 Cod1 Crown Certified — Main Express Entry with AI/AR Modules, Auth, and Routing

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const disputeRoutes = require('./routes/disputes');
const onboardingRoutes = require('./routes/users/onboarding');
const messageRoutes = require('./routes/messages/messageRoutes');

const socket = require('./socket'); // 👈 Socket.IO module

dotenv.config();
const app = express();
const server = http.createServer(app); // 👈 Needed for socket.io

// Initialize Socket.IO and store instance
socket.init(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

/* ------------------------ Base Business Routes ------------------------ */
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const arbitratorRoutes = require('./routes/users/arbitrators'); // 👈 New import
const lenderExportRoutes = require('./routes/lender/export');
const loanMatchRoutes = require('./routes/loan-match');
const contractRoutes = require('./routes/contracts/contracts');
const fraudAlertRoutes = require('./routes/fraud/alerts');
const auctionRoutes = require('./routes/auctions'); // 👈 Add your new auction route

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/users/arbitrators', arbitratorRoutes); // 👈 New route
app.use('/api/lender/export', lenderExportRoutes);
app.use('/api/loan-match', loanMatchRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/fraud/alerts', fraudAlertRoutes);
app.use('/api/auctions', auctionRoutes); // 👈 Auction real-time endpoint
app.use('/api/disputes', disputeRoutes);
app.use('/api/onboarding', onboardingRoutes); // 👈 Register here
app.use('/api/messages', messageRoutes);


/* ------------------------ 👑 AI/AR Crown Routes ------------------------ */
const aiListingRoutes = require('./routes/ai/listing-suggestions');
const aiInsightRoutes = require('./routes/ai/insight');
const aiRecommendationRoutes = require('./routes/ai/recommendation');
const arRoutes = require('./routes/ar/ar');

app.use('/api/ai/listing-suggestions', aiListingRoutes);
app.use('/api/ai/insight', aiInsightRoutes);
app.use('/api/ai/recommendation', aiRecommendationRoutes);
app.use('/api/ar', arRoutes);

/* ------------------------ Production Static Serve ------------------------ */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

/* ------------------------ Server Start ------------------------ */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server + Socket.IO running on port ${PORT}`));
