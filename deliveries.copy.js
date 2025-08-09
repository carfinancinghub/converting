// File: deliveries.js
// Path: backend/routes/deliveries.js

const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const auth = require('../middleware/auth');

// GET /api/deliveries/hauler - Get jobs for hauler
router.get('/hauler', auth, async (req, res) => {
  try {
    const deliveries = await Delivery.find({ haulerId: req.user.id }).populate('carId').populate('buyerId');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch hauler deliveries' });
  }
});

// GET /api/deliveries/buyer - Get delivery status for buyer
router.get('/buyer', auth, async (req, res) => {
  try {
    const deliveries = await Delivery.find({ buyerId: req.user.id }).populate('carId').populate('haulerId');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch buyer deliveries' });
  }
});

// PATCH /api/deliveries/:id/status - Update delivery status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, time } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: 'Delivery not found' });

    delivery.status = status;
    if (status === 'in_transit') delivery.pickupTime = time;
    if (status === 'delivered') delivery.dropoffTime = time;

    await delivery.save();
    res.json({ msg: '✅ Delivery status updated', delivery });
  } catch (err) {
    res.status(500).json({ msg: 'Error updating delivery status' });
  }
});

module.exports = router;
