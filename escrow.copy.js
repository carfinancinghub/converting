const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const EscrowTransaction = require('../models/EscrowTransaction');
const Auction = require('../models/Auction');

router.post('/', auth, asyncHandler(async (req, res) => {
  const { auctionId, amountHeld } = req.body;

  const auction = await Auction.findById(auctionId).populate('buyerId lenderId');
  if (!auction) throw new Error('Auction not found');
  if (auction.status !== 'won') throw new Error('Auction is not in a won state');

  const transaction = new EscrowTransaction({
    auctionId,
    buyerId: auction.buyerId._id,
    lenderId: auction.lenderId._id,
    sellerId: auction.carId.sellerId,
    amountHeld,
    status: 'created',
    history: [{ status: 'created', note: 'Escrow transaction initiated' }],
  });

  await transaction.save();
  res.status(201).json(transaction);
}));

router.post('/:id/release', auth, asyncHandler(async (req, res) => {
  const { payouts } = req.body;

  const transaction = await EscrowTransaction.findById(req.params.id);
  if (!transaction) throw new Error('Escrow transaction not found');
  if (transaction.status === 'released') throw new Error('Escrow already released');

  const totalPayout = payouts.reduce((acc, p) => acc + p.amount, 0);
  if (totalPayout !== transaction.amountHeld) {
    throw new Error('Total payout amounts must equal the held amount');
  }

  transaction.status = 'released';
  transaction.payouts = payouts;
  transaction.history.push({
    status: 'released',
    note: `Funds released: ${payouts.map(p => `${p.payeeId}: $${p.amount}`).join(', ')}`,
  });

  await transaction.save();
  res.json({ msg: '✅ Escrow released', transaction });
}));

router.get('/', auth, asyncHandler(async (req, res) => {
  const transactions = await EscrowTransaction.find({
    $or: [
      { buyerId: req.user.id },
      { lenderId: req.user.id },
      { sellerId: req.user.id },
    ],
  });
  res.json(transactions);
}));

module.exports = router;