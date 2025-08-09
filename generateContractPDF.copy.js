// File: generateContractPDF.js
// Path: backend/contracts/generateContractPDF.js

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const FinancingAuction = require('../models/FinancingAuction');
const User = require('../models/User');

const generateContractPDF = async (auctionId) => {
  const auction = await FinancingAuction.findById(auctionId)
    .populate('buyerId', 'email')
    .populate('winnerId', 'email')
    .populate('carId');

  if (!auction || !auction.selectedBid) {
    throw new Error('Auction or winning bid not found');
  }

  const doc = new PDFDocument();
  const filePath = path.join(__dirname, `../generated/contract_${auctionId}.pdf`);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(18).text('Car Financing Agreement', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Contract Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Buyer: ${auction.buyerId.email}`);
  doc.text(`Lender: ${auction.winnerId.email}`);
  doc.text(`Car: ${auction.carId.make} ${auction.carId.model} (${auction.carId.year})`);
  doc.moveDown();

  doc.text(`Loan Terms:`);
  doc.text(`• Amount Financed: ${auction.carId.price - auction.initialDownPayment}`);
  doc.text(`• Down Payment: ${auction.initialDownPayment}`);
  doc.text(`• Interest Rate: ${auction.selectedBid.interestRate}%`);
  doc.text(`• Term: ${auction.selectedBid.termMonths} months`);
  doc.text(`• Credit Check: ${auction.selectedBid.requiresCreditCheck ? 'Required' : 'Not Required'}`);
  doc.text(`• Income Proof: ${auction.selectedBid.requiresIncomeProof ? 'Required' : 'Not Required'}`);
  doc.moveDown();

  doc.text('Agreement:');
  doc.text('Both parties agree to the above loan terms. Buyer agrees to monthly payments as scheduled. Lender agrees to fund the car purchase based on these terms.');

  doc.moveDown(2);
  doc.text('Buyer Signature: ________________________');
  doc.moveDown();
  doc.text('Lender Signature: _______________________');

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = generateContractPDF;
