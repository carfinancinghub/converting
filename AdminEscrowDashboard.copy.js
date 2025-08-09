// File: AdminEscrowDashboard.js
// Path: frontend/src/components/AdminEscrowDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminEscrowDashboard = () => {
  const [escrows, setEscrows] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEscrows = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/escrow', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEscrows(res.data);
    } catch (err) {
      setMessage('❌ Failed to load escrow data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
  }, []);

  const handleRelease = async (id, releaseTo) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/escrow/${id}/release`, { [releaseTo]: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.msg || '✅ Funds released');
      fetchEscrows();
    } catch (err) {
      setMessage('❌ Release failed');
    }
  };

  const renderReleaseButton = (escrow, partyKey, label) => {
    const released = escrow.fundsReleased?.[partyKey];
    return (
      <button
        disabled={released}
        onClick={() => handleRelease(escrow._id, partyKey)}
        className={`px-3 py-1 rounded text-white text-sm font-medium mr-2 ${
          released ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {released ? `✅ ${label}` : `Release to ${label}`}
      </button>
    );
  };

  const statusBadge = (status) => {
    const colorMap = {
      pending: 'bg-yellow-500',
      active: 'bg-blue-500',
      released: 'bg-green-600',
      failed: 'bg-red-600',
    };
    return (
      <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${colorMap[status] || 'bg-gray-400'}`}>
        {status?.toUpperCase() || 'UNKNOWN'}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">💰 Admin Escrow Dashboard</h2>
          <button
            onClick={fetchEscrows}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {message && <p className="mb-4 text-red-500">{message}</p>}
        {loading && <p className="text-gray-600">Loading escrows...</p>}

        {escrows.length === 0 ? (
          <p className="text-gray-600">No escrow records available.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {escrows.map(escrow => (
              <div
                key={escrow._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h4 className="text-lg font-semibold mb-1">
                  Auction ID: {escrow.auctionId?.carId || escrow.auctionId}
                </h4>
                <p><strong>Buyer:</strong> {escrow.buyerId?.email || escrow.buyerId}</p>
                <p><strong>Seller:</strong> {escrow.sellerId?.email || escrow.sellerId}</p>
                <p><strong>Amount Held:</strong> {formatCurrency(escrow.amountHeld)}</p>
                <p><strong>Status:</strong> {statusBadge(escrow.status)}</p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Created At:</strong> {new Date(escrow.createdAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap items-center mt-2">
                  {renderReleaseButton(escrow, 'toSeller', 'Seller')}
                  {renderReleaseButton(escrow, 'toInspector', 'Inspector')}
                  {renderReleaseButton(escrow, 'toTransporter', 'Transporter')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEscrowDashboard;
