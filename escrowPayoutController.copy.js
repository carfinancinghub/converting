// File: escrowPayoutController.js
// Path: backend/controllers/escrowPayoutController.js

const { shouldHoldEscrowPayout } = require('../utils/escrowHoldRules');
const Escrow = require('../models/Escrow');

// POST /api/escrow/:auctionId/release
async function releaseEscrow(req, res) {
  try {
    const { auctionId } = req.params;
    const { carId, buyerId, buyerIsInstitutional } = req.body;

    const hold = await shouldHoldEscrowPayout({ carId, buyerId, buyerIsInstitutional });

    if (hold) {
      return res.status(403).json({ msg: '❌ Escrow release blocked: title not verified and buyer is not institutional.' });
    }

    // Proceed to mark as released (mock logic for now)
    await Escrow.findOneAndUpdate({ auctionId }, { status: 'released', releasedAt: new Date() });

    res.json({ msg: '✅ Escrow funds released.' });
  } catch (err) {
    console.error('Escrow release error:', err);
    res.status(500).json({ msg: 'Server error during escrow release.' });
  }
}

module.exports = { releaseEscrow };
