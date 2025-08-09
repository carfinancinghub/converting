// File: escrowHealthEngine.js
// Path: backend/utils/escrowHealthEngine.js

const mongoose = require('mongoose');
const Escrow = require('../models/Escrow');

const FLAG_THRESHOLDS = {
  daysToDeliver: 7,
  daysToRelease: 2
};

const ms = (days) => days * 24 * 60 * 60 * 1000;

async function evaluateEscrowHealth() {
  const now = Date.now();
  const escrows = await Escrow.find({});

  const flagged = escrows.map((escrow) => {
    const flags = [];

    if (!escrow.deliveredAt && now - new Date(escrow.createdAt).getTime() > ms(FLAG_THRESHOLDS.daysToDeliver)) {
      flags.push('Not delivered in 7+ days');
    }

    if (
      escrow.deliveredAt &&
      !escrow.releasedAt &&
      now - new Date(escrow.deliveredAt).getTime() > ms(FLAG_THRESHOLDS.daysToRelease)
    ) {
      flags.push('Delivered but not released');
    }

    if (escrow.payouts && Array.isArray(escrow.payouts)) {
      const unpaidRoles = escrow.payouts.filter((p) => !p.paid);
      if (unpaidRoles.length > 0) {
        flags.push(`Payouts pending: ${unpaidRoles.length} roles`);
      }
    }

    return {
      escrowId: escrow._id,
      status: escrow.status,
      createdAt: escrow.createdAt,
      deliveredAt: escrow.deliveredAt,
      releasedAt: escrow.releasedAt,
      issues: flags
    };
  });

  return flagged.filter((e) => e.issues.length > 0);
}

module.exports = evaluateEscrowHealth;
