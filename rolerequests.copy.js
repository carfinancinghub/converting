// File: verification.js
// Path: backend/routes/verification.js

const express = require('express');
const router = express.Router();
const Verification = require('../../server/models/Verification');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET verification info for current user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const record = await Verification.findOne({ userId: req.user._id });
    if (!record) return res.status(404).json({ error: 'No verification record found.' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verification data.' });
  }
});

// PUT update verification status (admin only)
router.put('/:userId', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const updated = await Verification.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update verification status.' });
  }
});

module.exports = router;
