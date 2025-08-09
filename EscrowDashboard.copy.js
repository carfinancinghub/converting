// File: EscrowDashboard.jsx
// Path: frontend/src/components/escrow/EscrowDashboard.jsx
// 
// Features:
// - Central home for Escrow Admin role
// - Displays summary stats: total transactions, pending claims
// - Quick links to Escrow Monitor and Escrow Claims pages
// - Secure token-based API fetch
// - Crown UI/UX with responsive cards, hover effects, and full admin polish

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

const EscrowDashboard = () => {
  const [summary, setSummary] = useState({
    totalTransactions: 0,
    pendingClaims: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/escrow/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary(res.data);
      } catch (err) {
        console.error('Error loading escrow summary:', err);
        setError('❌ Failed to load escrow dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  const handleGoToMonitor = () => navigate('/admin/escrow-monitor');
  const handleGoToClaims = () => navigate('/admin/escrow-claims');

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold text-indigo-700">🏛️ Escrow Admin Dashboard</h1>

          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <p className="text-center text-red-600 py-4">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="flex flex-col items-center p-6 space-y-4 hover:shadow-xl">
                <p className="text-5xl">💵</p>
                <p className="text-xl font-semibold">Total Transactions</p>
                <p className="text-2xl font-bold">{summary.totalTransactions}</p>
                <Button onClick={handleGoToMonitor}>
                  View Escrow Monitor
                </Button>
              </Card>

              <Card className="flex flex-col items-center p-6 space-y-4 hover:shadow-xl">
                <p className="text-5xl">🛡️</p>
                <p className="text-xl font-semibold">Pending Claims</p>
                <p className="text-2xl font-bold">{summary.pendingClaims}</p>
                <Button onClick={handleGoToClaims}>
                  Manage Escrow Claims
                </Button>
              </Card>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default EscrowDashboard;
