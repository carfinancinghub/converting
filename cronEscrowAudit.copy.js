// File: cronEscrowAudit.js
// Path: backend/scripts/cronEscrowAudit.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const evaluateEscrowHealth = require('../utils/escrowHealthEngine');
const Notification = require('../models/Notification');

async function runEscrowAudit() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    const flagged = await evaluateEscrowHealth();
    console.log(`📋 Found ${flagged.length} flagged escrows.`);

    for (const f of flagged) {
      const alreadyExists = await Notification.findOne({
        referenceId: f.escrowId,
        type: 'escrow-stalled',
        description: f.issues.join(', ')
      });

      if (!alreadyExists) {
        await Notification.create({
          type: 'escrow-stalled',
          title: `⚠️ Escrow Issue: ${f.escrowId.toString().slice(-6)}`,
          description: f.issues.join(', '),
          referenceId: f.escrowId
        });
      }
    }

    console.log('✅ Notifications written.');
    process.exit();
  } catch (err) {
    console.error('❌ Escrow audit failed:', err);
    process.exit(1);
  }
}

runEscrowAudit();
