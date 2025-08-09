// File: profileviews.js
// Path: backend/routes/profileviews.js

const express = require('express');
const router = express.Router();
const ProfileView = require('../../server/models/ProfileView');
const { authenticateUser } = require('../middleware/authMiddleware');

// POST a new profile view log
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { viewedUserId, sourcePage, notes } = req.body;
    const log = new ProfileView({
      viewedUserId,
      viewerUserId: req.user._id,
      sourcePage,
      notes,
    });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log profile view.' });
  }
});

// GET recent profile views on a specific user (admin only or self)
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId)
      return res.status(403).json({ error: 'Access denied' });

    const views = await ProfileView.find({ viewedUserId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(views);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile views.' });
  }
});

module.exports = router;
