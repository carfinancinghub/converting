// File: assignJudges.js
// Path: backend/routes/assignJudges.js

const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/disputes/:id/assign-judges
router.post('/:id/assign-judges', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }

    const { judgeIds } = req.body;

    // Validation
    if (!Array.isArray(judgeIds) || judgeIds.length !== 3) {
      return res.status(400).json({ msg: 'Exactly 3 judge IDs must be provided' });
    }

    // Ensure no duplicates
    const uniqueJudgeIds = [...new Set(judgeIds.map(id => id.toString()))];
    if (uniqueJudgeIds.length !== 3) {
      return res.status(400).json({ msg: 'Duplicate judge IDs detected' });
    }

    // Fetch and verify judges
    const judges = await User.find({ _id: { $in: judgeIds }, isVerified: true });
    if (judges.length !== 3) {
      return res.status(400).json({ msg: 'All judges must be verified users. Found: ' + judges.length });
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ msg: 'Dispute not found' });
    }

    dispute.judges = judgeIds;
    dispute.status = 'assigned';
    await dispute.save();

    res.json({
      msg: '✅ Judges assigned successfully',
      disputeId: dispute._id,
      judgeEmails: judges.map(j => j.email)
    });
  } catch (err) {
    console.error('🔥 Judge assignment error:', err.message);
    res.status(500).json({ msg: 'Server error during judge assignment', error: err.message });
  }
});

module.exports = router;
