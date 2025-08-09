// File: financing.js
// Location: car-haul/server/routes/financing.js
const express = require('express');
const router = express.Router();
const Financing = require('../models/Financing');
const authorize = require('../middleware/authorize');

// Submit financing request
router.post('/', authorize(['buyer']), async (req, res) => {
  const { carId, loanAmount, term, creditScore } = req.body;
  try {
    const application = await Financing.create({
      carId,
      buyerId: req.user.userId,
      loanAmount,
      term,
      creditScore,
    });
    res.status(201).json(application);
  } catch (err) {
    console.error('Financing request failed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get buyer's financing applications
router.get('/buyer/:buyerId', authorize(['buyer', 'admin']), async (req, res) => {
  try {
    const apps = await Financing.find({ buyerId: req.params.buyerId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch financing data' });
  }
});

module.exports = router;

// --- End of financing.js ---