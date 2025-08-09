// File: conversations.js
// Path: backend/routes/conversations.js

const express = require('express');
const router = express.Router();
const Conversation = require('../../server/models/Conversation');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all conversations for logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

// POST a new conversation (or fetch if exists)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { participantId, relatedAuctionId, relatedCarId } = req.body;
    const existing = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId] },
      relatedAuctionId,
      relatedCarId,
    });
    if (existing) return res.json(existing);

    const newConversation = new Conversation({
      participants: [req.user._id, participantId],
      relatedAuctionId,
      relatedCarId,
    });
    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
});

module.exports = router;
