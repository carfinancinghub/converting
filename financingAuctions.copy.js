const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const auth = require('../middleware/auth');
const FinancingAuction = require('../models/FinancingAuction');

router.get('/my', auth, asyncHandler(async (req, res) => {
  const auctions = await FinancingAuction.find({ buyerId: req.user.id })
    .populate('carId')
    .sort({ createdAt: -1 });

  res.json(auctions);
}));

router.post('/', auth, asyncHandler(async (req, res) => {
  const { carId } = req.body;

  const auction = new FinancingAuction({
    carId,
    buyerId: req.user.id,
    bidHistory: [],
    status: 'open',
  });

  await auction.save();
  res.status(201).json(auction);
}));

router.post('/:id/bid', auth, asyncHandler(async (req, res) => {
  const { interestRate, proposedDownPayment, termMonths } = req.body;

  const auction = await FinancingAuction.findById(req.params.id);
  if (!auction) throw new Error('Financing auction not found');
  if (auction.status !== 'open') throw new Error('Auction is not open for bidding');
  if (req.user.role !== 'lender') throw new Error('Only lenders can place bids');

  auction.bidHistory.push({
    lenderId: req.user.id,
    interestRate,
    proposedDownPayment,
    termMonths,
  });

  await auction.save();
  res.json({ msg: '✅ Bid placed', auction });
}));

router.post('/:id/select-bid', auth, asyncHandler(async (req, res) => {
  const { bidId } = req.body;

  const auction = await FinancingAuction.findById(req.params.id);
  if (!auction) throw new Error('Financing auction not found');
  if (auction.buyerId.toString() !== req.user.id) throw new Error('Not authorized to select a bid');
  if (auction.status !== 'open') throw new Error('Auction is not open');

  const selectedBid = auction.bidHistory.find(bid => bid._id.toString() === bidId);
  if (!selectedBid) throw new Error('Bid not found');

  auction.winnerId = selectedBid.lenderId;
  auction.selectedBid = bidId;
  auction.status = 'closed';

  await auction.save();
  res.json({ msg: '✅ Bid selected', auction });
}));

module.exports = router;