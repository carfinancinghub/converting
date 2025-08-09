// File: Dispute.js
// Location: server/models/Dispute.js

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  judge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vote: {
    type: String,
    enum: ['yes', 'no', 'neutral'],
    required: true,
  },
  comment: String
});

const disputeSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  respondent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
  },
  relatedAuction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
  },
  reason: {
    type: String,
    required: true,
  },
  judges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  votes: [voteSchema],
  result: {
    type: String,
    enum: ['pending', 'resolved', 'escalated'],
    default: 'pending',
  },
  outcomeNote: String,
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
