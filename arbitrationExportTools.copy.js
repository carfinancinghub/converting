// File: arbitrationExportTools.js
// Path: backend/utils/arbitration/arbitrationExportTools.js
// Purpose: Generate Pro arbitration simulator reports and exportable dispute summaries
// Author: Cod2
// Date: 2025-04-30
// 👑 Cod2 Crown Certified

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { simulateOutcome } = require('@utils/scoreUtils');
const Dispute = require('@models/dispute/Dispute');

/**
 * Generate a visual PDF report for a dispute simulation
 * @param {String} disputeId - The dispute ID to simulate
 * @param {Object} judgeData - Array of judge data (e.g., bias, scores)
 * @param {String} outputPath - Path to save the generated PDF
 * @returns {Promise<String>} - Path to the saved PDF
 */
async function generateDisputeOutcomePDF(disputeId, judgeData, outputPath) {
  try {
    const dispute = await Dispute.findById(disputeId).lean();
    if (!dispute) throw new Error('Dispute not found');

    const simulated = simulateOutcome(judgeData.map(j => j.bias || Math.random()));

    const doc = new PDFDocument();
    const fileName = `dispute_simulation_${disputeId}.pdf`;
    const fullPath = path.join(outputPath || './exports/', fileName);

    doc.pipe(fs.createWriteStream(fullPath));

    // Title
    doc.fontSize(18).text('Arbitration Outcome Simulation Report', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Dispute ID: ${disputeId}`);
    doc.text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Case Summary
    doc.fontSize(14).text('Case Summary:', { underline: true });
    doc.fontSize(12).text(`Title: ${dispute.title || 'N/A'}`);
    doc.text(`Status: ${dispute.status}`);
    doc.text(`Filed By: ${dispute.filedBy}`);
    doc.moveDown();

    // Judges
    doc.fontSize(14).text('Judge Bias Inputs:', { underline: true });
    judgeData.forEach((j, i) => {
      doc.text(`Judge ${i + 1}: Bias Score = ${j.bias}`);
    });
    doc.moveDown();

    // Simulation Result
    doc.fontSize(14).text('Predicted Outcome:', { underline: true });
    doc.text(`Confidence: ${Math.round(simulated * 100)}%`);
    doc.text(`Likely Outcome: ${simulated > 0.5 ? 'Ruling in favor of Plaintiff' : 'Ruling in favor of Defendant'}`);

    doc.end();

    return fullPath;
  } catch (error) {
    console.error('❌ Error generating dispute simulation PDF:', error);
    throw error;
  }
}

module.exports = {
  generateDisputeOutcomePDF
};
