// File: disputeSummaryPDF.js
// Path: backend/contracts/disputeSummaryPDF.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateDisputeSummaryPDF = (dispute, outputPath = null) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const filename = outputPath || path.join(__dirname, '../generated/dispute_' + dispute._id + '.pdf');

    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    doc.fontSize(18).text('Dispute Resolution Summary', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Dispute ID: ${dispute._id}`);
    doc.text(`Related Auction: ${dispute.relatedAuctionId}`);
    doc.text(`Initiator: ${dispute.initiatorId?.email || 'N/A'}`);
    doc.text(`Defendant: ${dispute.defendantId?.email || 'N/A'}`);
    doc.text(`Reason: ${dispute.reason}`);
    doc.text(`Status: ${dispute.status}`);
    doc.text(`Verdict: ${dispute.verdict || 'N/A'}`);
    doc.text(`Resolution: ${dispute.resolution || 'N/A'}`);
    doc.text(`Votes:`);

    dispute.votes?.forEach((v, i) => {
      doc.text(`  ${i + 1}. ${v.vote.toUpperCase()} - ${v.reason || 'No reason given'}`);
    });

    doc.text(`\nGenerated: ${new Date().toLocaleString()}`);
    doc.end();

    stream.on('finish', () => resolve(filename));
    stream.on('error', reject);
  });
};

module.exports = generateDisputeSummaryPDF;
