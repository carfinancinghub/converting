// File: BuyerEscrowClaimPanel.js
// Path: frontend/src/components/BuyerEscrowClaimPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BuyerEscrowClaimPanel = () => {
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyEscrows();
  }, []);

  const fetchMyEscrows = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEscrows(res.data);
    } catch (err) {
      setMessage('❌ Could not load your escrows');
    }
  };

  const submitClaim = async () => {
    if (!selectedEscrow || !reason) {
      return setMessage('⚠️ Please select an escrow and enter a reason');
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/escrow/claims`,
        { escrowId: selectedEscrow, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg || '✅ Claim submitted successfully');
      setReason('');
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Claim failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-semibold mb-4">🧾 Buyer Escrow Claims</h2>
        {message && <p className="mb-4 text-sm font-medium text-blue-600">{message}</p>}

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Escrow:</label>
          <select
            value={selectedEscrow}
            onChange={(e) => setSelectedEscrow(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">-- Choose one --</option>
            {escrows.map((e) => (
              <option key={e._id} value={e._id}>
                #{e._id.slice(-6)} | {e.status} | {new Date(e.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Reason for Claim:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Describe your issue with the escrow..."
          />
        </div>

        <button
          onClick={submitClaim}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          disabled={!selectedEscrow || !reason}
        >
          🚨 Submit Claim
        </button>
      </div>
    </div>
  );
};

export default BuyerEscrowClaimPanel;
