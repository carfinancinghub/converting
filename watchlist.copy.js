// File: watchlist.js
// Path: backend/routes/watchlist.js

const express = require('express');
const router = express.Router();
const Watchlist = require('../../server/models/Watchlist');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all watchlist items for a user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id })
      .populate('listingId');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watchlist.' });
  }
});

// POST to add a listing to watchlist
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { listingId, notes } = req.body;
    const exists = await Watchlist.findOne({ userId: req.user._id, listingId });
    if (exists) return res.status(409).json({ error: 'Already in watchlist.' });

    const item = new Watchlist({ userId: req.user._id, listingId, notes });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to watchlist.' });
  }
});

// DELETE from watchlist
router.delete('/:listingId', authenticateUser, async (req, res) => {
  try {
    await Watchlist.deleteOne({ userId: req.user._id, listingId: req.params.listingId });
    res.status(200).json({ message: 'Removed from watchlist.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from watchlist.' });
  }
});

module.exports = router;
