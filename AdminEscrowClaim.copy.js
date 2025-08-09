// File: AdminEscrowClaim.js
// Path: frontend/src/components/admin/escrow/AdminEscrowClaim.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminEscrowClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/claims`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setClaims(res.data);
      } catch (err) {
        console.error('Error fetching escrow claims:', err);
        setError('❌ Failed to load escrow claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/escrow/claims/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClaims(claims.filter(c => c._id !== id));
    } catch (err) {
      console.error(`Error ${action} claim:`, err);
      alert(`❌ Failed to ${action} claim`);
    }
  };

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🔑 Escrow Claims</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && claims.length === 0 && (
            <p className="text-gray-500">No escrow claims awaiting review.</p>
          )}

          {!loading && !error && claims.length > 0 && (
            <div className="space-y-4">
              {claims.map((claim) => (
                <Card key={claim._id} className="hover:shadow-md flex justify-between items-start">
                  <div>
                    <p><strong>Claim ID:</strong> {claim._id}</p>
                    <p><strong>Amount:</strong> ${claim.amount.toFixed(2)}</p>
                    <p><strong>Requested By:</strong> {claim.requestedBy?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(claim.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleAction(claim._id, 'approve')} className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                    <Button onClick={() => handleAction(claim._id, 'reject')} className="bg-red-600 hover:bg-red-700">
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminEscrowClaim;
