// File: AdminContractDashboard.js
// Path: frontend/src/components/AdminContractDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminContractDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/contracts/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContracts(res.data);
    } catch (err) {
      setMessage('❌ Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

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
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📑 Admin Contract Dashboard</h2>
          <button
            onClick={fetchContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {loading ? (
          <p className="text-gray-600">Loading contracts...</p>
        ) : contracts.length === 0 ? (
          <p className="text-gray-600">No contracts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map(contract => (
              <div
                key={contract._id}
                className="bg-white shadow rounded-lg p-4 border border-gray-200"
              >
                <h4 className="font-semibold text-lg mb-2">📄 Contract ID: {contract._id}</h4>
                <p><strong>Car ID:</strong> {contract.auctionId?.carId || '—'}</p>
                <p>
                  <strong>Loan:</strong> {formatCurrency(contract.loanAmount)} @ {contract.interestRate}% for {contract.termMonths} months
                </p>
                <p><strong>Status:</strong> {renderStatusTag(contract.signatureStatus)}</p>
                <p><strong>Buyer:</strong> {contract.buyerId?.email || contract.buyerId}</p>
                <p><strong>Lender:</strong> {contract.lenderId?.email || contract.lenderId}</p>
                {contract.contractPdfUrl && (
                  <a
                    href={contract.contractPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 block"
                  >
                    📎 View PDF
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Created:</strong> {new Date(contract.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContractDashboard;
