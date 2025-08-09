// File: ContractCard.js
// Path: frontend/src/components/ContractCard.js

import React from 'react';

const ContractCard = ({ contract, onSign }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'signed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-600';
      case 'fully_signed': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="border border-gray-300 rounded-md shadow-sm p-4 mb-6 bg-white">
      <h4 className="text-lg font-semibold mb-1">
        📑 Auction: {contract.auctionId?.carId || 'Unknown'}
      </h4>
      <p className="text-sm">
        <strong>Loan:</strong>{' '}
        {formatCurrency(contract.loanAmount)} @ {contract.interestRate}% / {contract.termMonths} months
      </p>
      <p className="text-sm mt-1">
        <strong>Status:</strong>{' '}
        <span className={`text-white px-2 py-1 text-xs rounded ${getStatusColor(contract.signatureStatus)}`}>
          {contract.signatureStatus}
        </span>
      </p>
      <p className="text-sm mt-1"><strong>Buyer:</strong> {contract.buyerId?.email || contract.buyerId}</p>
      <p className="text-sm"><strong>Lender:</strong> {contract.lenderId?.email || contract.lenderId}</p>

      {contract.contractPdfUrl && (
        <p className="mt-3">
          <a
            href={contract.contractPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            📄 View Contract PDF
          </a>
        </p>
      )}

      {onSign && contract.signatureStatus !== 'fully_signed' && (
        <button
          onClick={() => onSign(contract._id, 'signed_by_lender')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ✍️ Sign Contract
        </button>
      )}
    </div>
  );
};

export default ContractCard;
