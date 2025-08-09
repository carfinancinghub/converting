// File: budgetauditlog.js
// Path: backend/routes/budgetauditlog.js

const express = require('express');
const router = express.Router();
const BudgetAuditLog = require('../../server/models/BudgetAuditLog');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET recent audit logs (admin only)
router.get('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    const logs = await BudgetAuditLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs.' });
  }
});

// POST a new audit log entry
router.post('/', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

    const entry = new BudgetAuditLog({
      ...req.body,
      recordedBy: req.user._id,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record audit log.' });
  }
});

module.exports = router;
