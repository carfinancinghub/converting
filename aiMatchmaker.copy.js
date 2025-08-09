const Car = require('../models/Car');
const FinancingAuction = require('../models/FinancingAuction');
const ErrorLog = require('../models/ErrorLog');

/**
 * Lightweight scoring system that ranks cars and financing combos
 * based on buyer preferences. Designed for later ML integration.
 * @param {string} buyerId - The ID of the buyer.
 * @param {Object} preferences - Buyer preferences (e.g., { preferredMake, maxPrice, maxInterestRate, termMonths, downPaymentBudget, yearRange }).
 * @returns {Array} - Array of matches with scores.
 */
async function generateMatchesForBuyer(buyerId, preferences) {
  try {
    // Validate inputs
    if (!buyerId || !preferences) {
      throw new Error('Buyer ID and preferences are required');
    }

    const {
      preferredMake = '',
      maxPrice = Infinity,
      maxInterestRate = Infinity,
      termMonths = 0,
      downPaymentBudget = 0,
      yearRange = [1900, new Date().getFullYear()],
    } = preferences;

    // Fetch available cars
    const cars = await Car.find({
      price: { $lte: maxPrice },
      year: { $gte: yearRange[0], $lte: yearRange[1] },
      status: 'Available',
    }).lean();

    // Fetch open financing auctions
    const auctions = await FinancingAuction.find({ status: 'open' })
      .populate('carId')
      .lean();

    const matches = [];

    for (const car of cars) {
      // Filter auctions for this car
      const carAuctions = auctions.filter(a => a.carId._id.toString() === car._id.toString());

      for (const auction of carAuctions) {
        if (!auction.bidHistory || auction.bidHistory.length === 0) continue;

        // Find the best bid for this auction (lowest interest rate)
        const bestBid = auction.bidHistory.reduce((best, bid) => {
          if (bid.interestRate < best.interestRate) return bid;
          return best;
        }, auction.bidHistory[0]);

        // Skip if bid doesn't meet preferences
        if (bestBid.interestRate > maxInterestRate) continue;
        if (termMonths && bestBid.termMonths !== termMonths) continue;
        if (downPaymentBudget && bestBid.proposedDownPayment > downPaymentBudget) continue;

        // Calculate match score (0-100)
        let score = 100;

        // Adjust score based on make preference
        if (preferredMake && car.make.toLowerCase() !== preferredMake.toLowerCase()) {
          score -= 20;
        }

        // Adjust score based on price (closer to maxPrice = lower score)
        if (maxPrice !== Infinity) {
          const priceDiff = (car.price / maxPrice) * 100;
          score -= Math.min(priceDiff, 30); // Max deduction of 30 points
        }

        // Adjust score based on interest rate (higher rate = lower score)
        if (maxInterestRate !== Infinity) {
          const rateDiff = (bestBid.interestRate / maxInterestRate) * 100;
          score -= Math.min(rateDiff, 30); // Max deduction of 30 points
        }

        // Adjust score based on year (newer cars = higher score)
        const yearScore = ((car.year - yearRange[0]) / (yearRange[1] - yearRange[0])) * 20;
        score += yearScore;

        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score));

        matches.push({
          car,
          auction,
          bid: bestBid,
          score: Math.round(score),
        });
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.score - a.score);

    return matches;
  } catch (err) {
    console.error('Error in generateMatchesForBuyer:', err);
    const errorLog = new ErrorLog({
      message: err.message,
      stack: err.stack,
      method: 'generateMatchesForBuyer',
      userId: buyerId,
    });
    await errorLog.save();
    throw err;
  }
}

module.exports = { generateMatchesForBuyer };