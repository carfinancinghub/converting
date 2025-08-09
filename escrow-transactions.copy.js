// File: escrow-transactions.js
// Path: backend/routes/escrow-transactions.js

const express = require('express');
const router = express.Router();
const EscrowTransaction = require('../../server/models/EscrowTransaction');
const { authenticateUser } = require('../middleware/authMiddleware');

// GET all escrow transactions for a contract
router.get('/contract/:contractId', authenticateUser, async (req, res) => {
  try {
    const transactions = await EscrowTransaction.find({ contractId: req.params.contractId })
      .sort({ createdAt: 1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch escrow transactions.' });
  }
});

// POST a new escrow transaction (admin or system)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { contractId, step, amount, currency, notes } = req.body;
    const transaction = new EscrowTransaction({
      contractId,
      step,
      amount,
      currency,
      notes,
      triggeredBy: req.user._id,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log escrow transaction.' });
  }
});

module.exports = router;
