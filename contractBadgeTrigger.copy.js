// File: contractBadgeTrigger.js
// Path: backend/utils/contractBadgeTrigger.js

const User = require('../models/User');
const { assignBadge } = require('./badges');
const { notifyUserOfBadge } = require('./badgeNotification');

/**
 * Assign badges to buyer and seller after a contract is fully signed.
 */
async function triggerBadgesForContract(auction) {
  try {
    const buyer = await User.findById(auction.buyerId);
    const seller = await User.findById(auction.sellerId);

    const badgesAssigned = [];

    if (buyer) {
      const buyerBadge = assignBadge(buyer, 'FIRST_DEAL');
      if (buyerBadge) {
        await notifyUserOfBadge(buyer, buyerBadge);
        badgesAssigned.push({ user: buyer.email, badge: buyerBadge });
        await buyer.save();
      }
    }

    if (seller) {
      if (!seller.badges) seller.badges = [];
      const repeatSales = seller.badges.filter(b => b.key === 'FIRST_DEAL').length >= 5;
      const badgeKey = repeatSales ? 'TRUSTED_SELLER' : 'FIRST_DEAL';
      const sellerBadge = assignBadge(seller, badgeKey);
      if (sellerBadge) {
        await notifyUserOfBadge(seller, sellerBadge);
        badgesAssigned.push({ user: seller.email, badge: sellerBadge });
        await seller.save();
      }
    }

    return badgesAssigned;
  } catch (err) {
    console.error('Badge trigger error:', err);
    return [];
  }
}

module.exports = { triggerBadgesForContract };
