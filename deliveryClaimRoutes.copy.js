// File: deliveryClaimRoutes.js
// Path: backend/routes/deliveryClaimRoutes.js

const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

// GET /api/deliveries/available - Unassigned jobs
router.get('/available', auth, async (req, res) => {
  try {
    const jobs = await Delivery.find({ haulerId: null, status: 'pending' }).populate('carId').populate('buyerId');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: '❌ Failed to load available jobs' });
  }
});

// PATCH /api/deliveries/:id/claim - Assign hauler to delivery
router.patch('/:id/claim', auth, async (req, res) => {
  try {
    const job = await Delivery.findById(req.params.id);
    if (!job || job.haulerId) return res.status(400).json({ msg: 'Job already claimed or not found' });

    job.haulerId = req.user.id;
    await job.save();

    res.json({ msg: '✅ Job successfully claimed', job });
  } catch (err) {
    res.status(500).json({ msg: '❌ Failed to claim job' });
  }
});

module.exports = router;
