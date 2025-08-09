// File: escrowLogic.js
// Path: backend/utils/escrowLogic.js

const EscrowContract = require('../models/EscrowContract');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

/**
 * Attempts to release funds when contract is marked complete and verified.
 * @param {string} contractId - ID of the escrow contract to evaluate
 */
exports.releaseFundsIfComplete = async (contractId) => {
  try {
    const contract = await EscrowContract.findById(contractId);
    if (!contract || !contract.activated || !contract.isComplete) {
      console.log('🚫 Escrow release skipped: Contract not ready');
      return false;
    }

    // Mock payment creation (Stripe would go here in real integration)
    const payout = new Payment({
      userId: contract.sellerId,
      contractId,
      amount: contract.totalAmount,
      method: 'escrow-release',
      status: 'Paid'
    });
    await payout.save();

    contract.fundsReleased = true;
    await contract.save();

    await Notification.create({
      userId: contract.sellerId,
      type: 'payout',
      message: `Funds released for contract ${contractId}`
    });

    console.log(`💸 Funds released to seller for contract ${contractId}`);
    return true;
  } catch (err) {
    console.error('❌ Escrow release failed:', err.message);
    return false;
  }
};
