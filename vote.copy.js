// File: vote.js
// Path: backend/routes/disputes/vote.js

const express = require('express');
const router = express.Router();
const Dispute = require('../../models/Dispute');
const auth = require('../../middleware/auth');

// ✅ Cast a vote on an assigned dispute
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ msg: 'Dispute not found' });

    // Only allow judges assigned to this dispute
    const assigned = dispute.assignedJudges || [];
    if (!assigned.includes(req.user.id)) {
      return res.status(403).json({ msg: 'You are not assigned to this dispute' });
    }

    // Check if already voted
    const alreadyVoted = dispute.votes.find(v => v.arbitratorId.toString() === req.user.id);
    if (alreadyVoted) return res.status(400).json({ msg: 'You already voted' });

    const { vote, reason } = req.body;
    if (!['yes', 'no', 'neutral'].includes(vote)) {
      return res.status(400).json({ msg: 'Invalid vote option' });
    }

    dispute.votes.push({ arbitratorId: req.user.id, vote, reason });
    await dispute.save();
    res.json({ msg: 'Vote submitted successfully' });
  } catch (err) {
    console.error('❌ Vote error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
