// File: haulerTracking.js
// Path: backend/routes/transport/haulerTracking.js

const express = require('express');
const router = express.Router();
const protect = require('../../middleware/protect');
const Delivery = require('../../models/Delivery'); // Assumes Delivery schema
const { logGPSProof } = require('../../controllers/gpsProofController');

// @route   GET /api/deliveries/hauler/:userId
// @desc    Fetch deliveries assigned to hauler
// @access  Private
router.get('/hauler/:userId', protect, async (req, res) => {
  try {
    const deliveries = await Delivery.find({ haulerId: req.params.userId }).populate('car');
    res.status(200).json(deliveries);
  } catch (err) {
    console.error('Fetch deliveries error:', err);
    res.status(500).json({ error: 'Failed to fetch hauler deliveries' });
  }
});

// @route   PUT /api/deliveries/:deliveryId/status
// @desc    Update status of a delivery job
// @access  Private
router.put('/:deliveryId/status', protect, async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    delivery.status = status;
    await delivery.save();

    res.status(200).json({ success: true, delivery });
  } catch (err) {
    console.error('Update delivery status error:', err);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// @route   POST /api/deliveries/:deliveryId/gps
// @desc    Log GPS pickup/dropoff proof
// @access  Private
router.post('/:deliveryId/gps', protect, logGPSProof);

module.exports = router;
