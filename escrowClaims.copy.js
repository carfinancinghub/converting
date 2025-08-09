// File: escrowClaims.js
// Path: backend/routes/escrowClaims.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const EscrowClaim = new mongoose.Schema({
  escrowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Escrow', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const EscrowClaimModel = mongoose.model('EscrowClaim', EscrowClaim);

// POST /api/escrow/claims - Buyer submits a claim
router.post('/', auth, async (req, res) => {
  try {
    const { escrowId, reason } = req.body;
    if (!escrowId || !reason) {
      return res.status(400).json({ msg: 'Missing escrow or reason' });
    }

    const claim = new EscrowClaimModel({
      escrowId,
      buyerId: req.user.id,
      reason
    });

    await claim.save();
    res.status(201).json({ msg: '✅ Claim submitted successfully', claim });
  } catch (err) {
    console.error('Escrow claim error:', err);
    res.status(500).json({ msg: '❌ Server error', error: err });
  }
});

// GET /api/escrow/claims - Admin views all claims
router.get('/', auth, async (req, res) => {
  try {
    const claims = await EscrowClaimModel.find().populate('escrowId buyerId');
    res.json(claims);
  } catch (err) {
    res.status(500).json({ msg: '❌ Failed to fetch claims' });
  }
});

module.exports = router;
