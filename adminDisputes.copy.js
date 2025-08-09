// File: routes/adminDisputes.js
// Location: backend/routes/adminDisputes.js

const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken, isAdmin } = require('../middleware/auth');

// PUT /api/admin/disputes/:id/assign-judges
router.put('/:id/assign-judges', verifyToken, isAdmin, async (req, res) => {
  const disputeId = req.params.id;
  const { judges } = req.body; // [{ userId, role }]

  if (!Array.isArray(judges) || judges.length !== 3) {
    return res.status(400).json({ error: 'Three judges must be assigned.' });
  }

  try {
    // Validate users exist
    const users = await User.find({ _id: { $in: judges.map(j => j.userId) } });
    if (users.length !== 3) {
      return res.status(400).json({ error: 'One or more judges are invalid.' });
    }

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    dispute.judges = judges.map(j => ({ ...j, vote: null }));
    dispute.status = 'open';
    dispute.finalDecision = null;

    await dispute.save();

    // Send notifications to assigned judges
    for (const judge of judges) {
      const note = new Notification({
        userId: judge.userId,
        type: 'dispute-assignment',
        message: `You’ve been assigned as a judge on Dispute #${dispute.caseId}.`,
        link: `/judge/disputes/${dispute._id}`
      });
      await note.save();
    }

    res.status(200).json({ success: true, dispute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign judges' });
  }
});

// GET /api/admin/disputes
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    res.status(200).json(disputes);
  } catch (err) {
    console.error('Failed to fetch disputes:', err);
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

module.exports = router;
