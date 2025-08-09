// File: inspectionSubmitRoute.js
// Path: backend/routes/inspectionSubmitRoute.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Inspection = require('../models/Inspection');

// POST /api/inspections/:id/submit - Mechanic submits inspection note + image
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { note, image } = req.body;
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ msg: 'Inspection not found' });

    inspection.status = 'completed';
    inspection.note = note;
    inspection.image = image || null;
    inspection.completedAt = new Date();
    await inspection.save();

    res.json({ msg: '✅ Inspection submitted', inspection });
  } catch (err) {
    console.error('Inspection submission error:', err);
    res.status(500).json({ msg: '❌ Server error submitting inspection' });
  }
});

module.exports = router;
