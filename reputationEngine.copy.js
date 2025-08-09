// File: reputationEngine.js
// Path: backend/utils/reputationEngine.js

const User = require('../models/User');

/**
 * Adjusts a user's reputation based on an action.
 * @param {string} userId - ID of the user to update
 * @param {string} action - Type of action performed (e.g., 'win_case', 'lose_case', 'on_time', 'late')
 */
exports.adjustReputation = async (userId, action) => {
  const impact = {
    win_case: 10,
    lose_case: -15,
    on_time: 5,
    late: -5,
    reported: -10,
    positive_feedback: 7,
    negative_feedback: -7,
  };

  try {
    const delta = impact[action] || 0;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.reputation = (user.reputation || 0) + delta;
    await user.save();

    console.log(`📊 Updated reputation for ${user.email || userId}: ${delta >= 0 ? '+' : ''}${delta}`);
    return user.reputation;
  } catch (err) {
    console.error('❌ Failed to update reputation:', err.message);
  }
};
