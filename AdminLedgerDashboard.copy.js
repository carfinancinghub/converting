// File: AdminLedgerDashboard.js
// Path: frontend/src/components/AdminLedgerDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminLedgerDashboard = () => {
  const [ledger, setLedger] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/ledger', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLedger(res.data);
    } catch (err) {
      setMessage('❌ Failed to load ledger entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const totalAmount = ledger.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📒 Admin Payment Ledger</h2>
          <button
            onClick={fetchLedger}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {message && <p className="text-red-500 mb-4">{message}</p>}
        {loading && <p className="text-gray-600">Loading ledger...</p>}

        {ledger.length === 0 ? (
          <p className="text-gray-600">No ledger entries available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-200 text-sm font-semibold text-left">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Auction</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">To</th>
                  <th className="px-4 py-2">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry._id} className="border-t">
                    <td className="px-4 py-2" title={entry.timestamp}>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {entry.auctionId?.carId || entry.auctionId}
                    </td>
                    <td className="px-4 py-2">{formatCurrency(entry.amount)}</td>
                    <td className="px-4 py-2">{entry.recipientType}</td>
                    <td className="px-4 py-2">{entry.purpose}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100 border-t">
                  <td colSpan="2" className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">{formatCurrency(totalAmount)}</td>
                  <td colSpan="2" className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLedgerDashboard;
