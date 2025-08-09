// File: ets-partners.js
// Path: backend/routes/ets-partners.js

const express = require('express');
const router = express.Router();
const EtsPartner = require('../../server/models/EtsPartner');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all ETS partners (admin only)
router.get('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const partners = await EtsPartner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ETS partners.' });
  }
});

// POST create a new ETS partner (admin only)
router.post('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const partner = new EtsPartner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ETS partner.' });
  }
});

// PUT update ETS partner info (admin only)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const partner = await EtsPartner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partner) return res.status(404).json({ error: 'Partner not found.' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update partner.' });
  }
});

module.exports = router;
