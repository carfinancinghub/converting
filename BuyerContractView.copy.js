// File: BuyerContractView.js
// Path: frontend/src/components/BuyerContractView.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BuyerContractView = () => {
  const [contracts, setContracts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/contracts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts(res.data);
    } catch (err) {
      setMessage('❌ Failed to load contracts');
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleSign = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/contracts/${id}/sign`,
        { signatureStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('✅ Signed contract');
      fetchContracts();
    } catch (err) {
      setMessage('❌ Failed to sign contract');
    }
  };

  const renderStatusTag = (status) => {
    const colorMap = {
      pending: 'bg-yellow-500',
      signed_by_buyer: 'bg-blue-500',
      signed_by_lender: 'bg-purple-500',
      fully_signed: 'bg-green-600',
      rejected: 'bg-red-600',
    };
    const color = colorMap[status?.toLowerCase()] || 'bg-gray-400';
    return (
      <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📄 Buyer Contracts</h2>
          <button
            onClick={fetchContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {contracts.length === 0 ? (
          <p className="text-gray-600">No contracts found.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {contracts.map((c) => (
              <div
                key={c._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h4 className="text-lg font-semibold mb-1">
                  Car: {c.auctionId?.carId || 'Unknown'}
                </h4>
                <p><strong>Loan:</strong> {formatCurrency(c.loanAmount)} @ {c.interestRate}% for {c.termMonths} months</p>
                <p><strong>Lender:</strong> {c.lenderId?.email || '—'}</p>
                <p><strong>Status:</strong> {renderStatusTag(c.signatureStatus)}</p>

                {c.contractPdfUrl && (
                  <a
                    href={c.contractPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-2"
                  >
                    📥 View Contract PDF
                  </a>
                )}

                {c.signatureStatus !== 'fully_signed' && c.signatureStatus !== 'signed_by_buyer' && (
                  <button
                    onClick={() => handleSign(c._id, 'signed_by_buyer')}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    ✍️ Sign Contract
                  </button>
                )}

                {c.signatureStatus === 'signed_by_buyer' && (
                  <p className="mt-2 text-green-600 font-medium">✅ You’ve already signed</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerContractView;
