// File: AdminEscrowClaimsDashboard.js
// Path: frontend/src/components/AdminEscrowClaimsDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminEscrowClaimsDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow/claims`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(res.data);
    } catch (err) {
      setMessage('❌ Could not fetch claims');
    }
  };

  const updateClaimStatus = async (id, status) => {
    setProcessingId(id);
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/escrow/claims/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg);
      fetchClaims();
    } catch (err) {
      setMessage(err.response?.data?.msg || '❌ Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const statusBadge = (status) => {
    const badgeMap = {
      approved: 'bg-green-600',
      rejected: 'bg-red-600',
      pending: 'bg-yellow-500',
    };
    return (
      <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${badgeMap[status] || 'bg-gray-400'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🚨 Escrow Claims Review</h2>
        {message && <p className="mb-4 text-red-500">{message}</p>}

        {claims.length === 0 ? (
          <p className="text-gray-600">No claims submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-200 text-sm font-semibold text-left">
                <tr>
                  <th className="px-4 py-2">Claim ID</th>
                  <th className="px-4 py-2">Escrow ID</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Submitted</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c._id} className="border-t">
                    <td className="px-4 py-2">{c._id.slice(-6)}</td>
                    <td className="px-4 py-2">{c.escrowId?._id?.slice(-6) || '—'}</td>
                    <td className="px-4 py-2">{c.buyerId?.email || '—'}</td>
                    <td className="px-4 py-2">{c.reason}</td>
                    <td className="px-4 py-2">{statusBadge(c.status)}</td>
                    <td className="px-4 py-2">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-2 space-x-2">
                      {c.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateClaimStatus(c._id, 'approved')}
                            disabled={processingId === c._id}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => updateClaimStatus(c._id, 'rejected')}
                            disabled={processingId === c._id}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEscrowClaimsDashboard;
