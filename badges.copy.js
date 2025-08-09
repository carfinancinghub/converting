// File: badges.js
// Path: backend/utils/badges.js

/**
 * Badge definitions and award logic
 */

const badgeCatalog = {
  FIRST_DEAL: {
    label: 'First Deal Closed',
    icon: '🏁',
    description: 'Completed your first contract on the platform.'
  },
  TRUSTED_SELLER: {
    label: 'Trusted Seller',
    icon: '✅',
    description: 'Maintained 5-star rating across 5+ transactions.'
  },
  DISPUTE_JUDGE: {
    label: 'Dispute Resolver',
    icon: '⚖️',
    description: 'Served as an arbitrator in platform disputes.'
  },
  STORAGE_PROVIDER: {
    label: 'Top Storage Host',
    icon: '📦',
    description: 'Successfully completed 3+ car storage jobs.'
  },
  MECHANIC_INSPECTOR: {
    label: 'Verified Inspector',
    icon: '🛠',
    description: 'Provided trusted mechanic inspections to buyers.'
  }
};

/**
 * Assign a badge to a user if they don’t already have it
 */
function assignBadge(user, badgeKey) {
  if (!badgeCatalog[badgeKey]) return null;
  if (!user.badges) user.badges = [];

  const alreadyHas = user.badges.some(b => b.key === badgeKey);
  if (alreadyHas) return null;

  const badge = { key: badgeKey, ...badgeCatalog[badgeKey], earnedAt: new Date() };
  user.badges.push(badge);
  return badge;
}

module.exports = {
  badgeCatalog,
  assignBadge
};
