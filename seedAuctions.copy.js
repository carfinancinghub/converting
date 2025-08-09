// File: seedAuctions.js
// Path: backend/scripts/seedAuctions.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Auction = require('../models/Auction');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// ⚠️ Replace these with actual Listing _id values if running on real data
const seedData = [
  {
    carId: '661fabc123456789abc00001', // example ObjectId
    startingPrice: 10000,
    currentBid: 12000,
    status: 'active',
    bidHistory: [],
  },
  {
    carId: '661fabc123456789abc00002',
    startingPrice: 20000,
    currentBid: 25000,
    status: 'active',
    bidHistory: [],
  },
  {
    carId: '661fabc123456789abc00003',
    startingPrice: 15000,
    currentBid: 18000,
    status: 'active',
    bidHistory: [],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Auction.deleteMany(); // 🚨 This deletes all auctions
    const result = await Auction.insertMany(seedData);
    console.log('🌱 Seeded auctions:', result);
    process.exit(0);
  } catch (err) {
    console.error('🔥 Failed to seed auctions:', err.message);
    process.exit(1);
  }
}

seed();
