// File: transport.js
// Path: backend/routes/transport.js

const express = require('express');
const router = express.Router();
const Transport = require('../models/Transport');
const auth = require('../middleware/auth');

// GET all transport jobs assigned to logged-in hauler
router.get('/', auth, async (req, res) => {
  try {
    const transports = await Transport.find({ haulerId: req.user.id });
    res.json(transports);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// POST assign a hauler to a transport job
router.post('/assign', auth, async (req, res) => {
  try {
    const { carId, pickupLocation, deliveryLocation } = req.body;
    const newTransport = new Transport({
      carId,
      haulerId: req.user.id,
      pickupLocation,
      deliveryLocation,
      currentLocation: pickupLocation
    });
    await newTransport.save();
    res.status(201).json({ msg: 'Transport job assigned', transport: newTransport });
  } catch (err) {
    res.status(500).json({ msg: 'Assignment failed', error: err.message });
  }
});

// POST update delivery status or current location
router.post('/:id/update', auth, async (req, res) => {
  try {
    const { currentLocation, status } = req.body;
    const transport = await Transport.findById(req.params.id);

    if (!transport) return res.status(404).json({ msg: 'Transport job not found' });

    if (status) transport.status = status;
    if (currentLocation) transport.currentLocation = currentLocation;
    transport.updatedAt = Date.now();
    await transport.save();

    res.json({ msg: 'Transport updated', transport });
  } catch (err) {
    res.status(500).json({ msg: 'Update failed', error: err.message });
  }
});

module.exports = router;
