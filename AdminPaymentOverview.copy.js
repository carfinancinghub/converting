// File: AdminPaymentOverview.js
// Path: frontend/src/components/admin/payments/AdminPaymentOverview.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';
import Button from '../../common/Button';
import { theme } from '../../styles/theme';

const AdminPaymentOverview = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/payments/overview`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPayments(res.data);
      } catch (err) {
        console.error('Error fetching payment overview:', err);
        setError('❌ Failed to load payment overview');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">💳 Payment Overview</h1>

          {loading && <LoadingSpinner />}
          {error && <p className={theme.errorText}>{error}</p>}

          {!loading && !error && payments.length === 0 && (
            <p className="text-gray-500">No payment records found.</p>
          )}

          {!loading && !error && payments.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              role="grid"
              aria-label="Payment Overview Cards"
            >
              {payments.map((row) => {
                const dateKey = new Date(row.date).toISOString();
                return (
                  <Card key={dateKey} className="hover:shadow-md">
                    <div className="space-y-2" role="gridcell">
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="text-xl font-semibold">{new Date(row.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Total Volume</p>
                      <p className="text-xl font-semibold">${row.totalVolume.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-xl font-semibold">{row.transactionCount}</p>
                      <p className="text-sm text-gray-600">Average Amount</p>
                      <p className="text-xl font-semibold">${row.averageAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Fees Collected</p>
                      <p className="text-xl font-semibold">${row.feesCollected.toFixed(2)}</p>
                      <Button
                        variant="secondary"
                        onClick={() => alert(`Viewing details for ${new Date(row.date).toLocaleDateString()}`)}
                        aria-label={`View details for payments on ${new Date(row.date).toLocaleDateString()}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminPaymentOverview;