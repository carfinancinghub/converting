// File: AdminEscrowMonitor.js
// Path: frontend/src/components/admin/escrow/AdminEscrowMonitor.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';

const AdminEscrowMonitor = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(res.data);
      } catch (err) {
        console.error('Error fetching escrow transactions:', err);
        setError('❌ Failed to load escrow transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">🔒 Escrow Transactions Monitor</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && transactions.length === 0 && (
            <p className="text-gray-500">No escrow transactions found.</p>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="space-y-4">
              {transactions.map(tx => (
                <Card key={tx._id} className="hover:shadow-md flex justify-between items-center">
                  <div>
                    <p><strong>ID:</strong> {tx._id}</p>
                    <p><strong>Amount:</strong> ${tx.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    <p><strong>Initiated:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => {/* view details */}}>
                      View Details
                    </Button>
                    {tx.status === 'pending' && (
                      <Button onClick={() => {/* release or cancel logic */}} className="bg-green-600 hover:bg-green-700">
                        Release Funds
                      </Button>
                    )}
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

export default AdminEscrowMonitor;
