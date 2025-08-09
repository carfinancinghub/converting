// File: titleRoutes.js
// Path: backend/routes/titleRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Title = require('../models/Title');

// GET /api/title - Fetch all title records
router.get('/', auth, async (req, res) => {
  try {
    const records = await Title.find().populate('carId').populate('buyerId');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: '❌ Failed to load title records' });
  }
});

// PATCH /api/title/:id/update - Update title status
router.patch('/:id/update', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const record = await Title.findById(req.params.id);
    if (!record) return res.status(404).json({ msg: 'Not found' });

    record.status = status;
    await record.save();

    res.json({ msg: '✅ Status updated', record });
  } catch (err) {
    res.status(500).json({ msg: '❌ Error updating status' });
  }
});

module.exports = router;
