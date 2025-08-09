const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { protect } = require('../middleware/auth');

// GET /api/ai/recommendations - returns mock AI-powered car deal suggestions
router.get('/recommendations', protect, asyncHandler(async (req, res) => {
  const mockRecommendations = [
    {
      make: 'Ford',
      model: 'Mustang',
      year: 2020,
      price: 30000,
      interestRate: 3.9,
      financeabilityScore: calculateFinanceabilityScore(30000, 2020, 3.9),
    },
    {
      make: 'Chevrolet',
      model: 'Camaro',
      year: 2019,
      price: 28000,
      interestRate: 4.2,
      financeabilityScore: calculateFinanceabilityScore(28000, 2019, 4.2),
    },
    {
      make: 'Dodge',
      model: 'Charger',
      year: 2021,
      price: 32000,
      interestRate: 3.5,
      financeabilityScore: calculateFinanceabilityScore(32000, 2021, 3.5),
    }
  ];

  function calculateFinanceabilityScore(price, year, interestRate) {
    const priceScore = Math.max(0, 100 - (price / 1000));
    const yearScore = (new Date().getFullYear() - year) <= 5 ? 30 : (new Date().getFullYear() - year) <= 10 ? 15 : 5;
    const rateScore = interestRate <= 4 ? 30 : interestRate <= 6 ? 15 : 5;
    return Math.round(priceScore + yearScore + rateScore);
  }

  res.json(mockRecommendations);
}));

module.exports = router;