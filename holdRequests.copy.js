// File: holdRequests.js
// Path: backend/routes/holdRequests.js

const express = require('express');
const router = express.Router();
const HoldRequest = require('../models/HoldRequest');
const auth = require('../middleware/auth');

// Create new hold request (buyer)
router.post('/', auth, async (req, res) => {
  try {
    const { carId, sellerId, notes } = req.body;
    const newRequest = new HoldRequest({
      carId,
      sellerId,
      buyerId: req.user.id,
      notes,
    });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create hold request', error: err.message });
  }
});

// Get hold requests for a specific buyer
router.get('/buyer', auth, async (req, res) => {
  try {
    const requests = await HoldRequest.find({ buyerId: req.user.id }).populate('carId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching buyer hold requests', error: err.message });
  }
});

// Get hold requests for a seller
router.get('/seller', auth, async (req, res) => {
  try {
    const requests = await HoldRequest.find({ sellerId: req.user.id }).populate('carId').populate('buyerId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching seller hold requests', error: err.message });
  }
});

// Update request status (approve/reject)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['approved', 'rejected', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ msg: 'Invalid status' });

    const request = await HoldRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(request);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update request', error: err.message });
  }
});

// Delete/cancel request
router.delete('/:id', auth, async (req, res) => {
  try {
    await HoldRequest.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Hold request deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete request', error: err.message });
  }
});

module.exports = router;
