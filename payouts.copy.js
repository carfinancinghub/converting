// File: payouts.js
// Path: backend/routes/payouts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Ledger = require('../models/Ledger');
const Escrow = require('../models/Escrow');

// Placeholder for actual Stripe payout
async function payToRecipient(recipientId, amount) {
  // 🔒 Replace this logic when Stripe is ready
  console.log(`✅ [MOCK] Paying $${amount} to ${recipientId}`);
  return {
    success: true,
    transactionId: 'mock_tx_' + Math.floor(Math.random() * 1000000)
  };
}

// POST /api/payouts/:ledgerId/pay
router.post('/:ledgerId/pay', auth, async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const payout = await Ledger.findById(ledgerId);

    if (!payout || payout.paid) {
      return res.status(400).json({ msg: 'Payout already processed or not found' });
    }

    const payment = await payToRecipient(payout.recipient, payout.amount);

    if (payment.success) {
      payout.paid = true;
      payout.paidAt = new Date();
      payout.transactionId = payment.transactionId;
      await payout.save();

      return res.json({ msg: '✅ Payout successful', payout });
    } else {
      return res.status(500).json({ msg: '❌ Payment failed', error: payment.error });
    }
  } catch (err) {
    console.error('Payout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
