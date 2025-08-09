// File: AdminArbitrationDashboard.js
// Path: frontend/src/components/admin/arbitration/AdminArbitrationDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Button from '../../common/Button';
import Card from '../../common/Card';
import AdminBadgeAuditLog from '../badges/AdminBadgeAuditLog';

const AdminArbitrationDashboard = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/arbitration/cases`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCases(res.data);
      } catch (err) {
        console.error('Error fetching arbitration cases:', err);
        setError('❌ Failed to load arbitration cases');
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">⚖️ Arbitration Cases</h1>

          <Button
            onClick={() => setShowAuditLog(prev => !prev)}
            className="mb-4"
          >
            {showAuditLog ? '🔙 Hide Badge Audit Log' : '📜 View Badge Audit Log'}
          </Button>

          {showAuditLog && (
            <Card className="mb-6">
              <AdminBadgeAuditLog />
            </Card>
          )}

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {!loading && !error && cases.length === 0 && (
            <p className="text-gray-500">No arbitration cases found.</p>
          )}

          {!loading && !error && cases.length > 0 && (
            <div className="space-y-4">
              {cases.map(c => (
                <Card key={c._id} className="hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>Case ID:</strong> {c._id}</p>
                      <p><strong>Type:</strong> {c.type}</p>
                      <p><strong>Status:</strong> {c.status}</p>
                      <p><strong>Opened On:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
                      <p><strong>Assigned To:</strong> {c.assignedTo?.email || 'Unassigned'}</p>
                    </div>
                    <Button onClick={() => {/* navigate to detailed view */}}>
                      Review Case
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

export default AdminArbitrationDashboard;

/* File: AdminArbitrationDashboard.css
   Path: frontend/src/components/admin/arbitration/AdminArbitrationDashboard.css */

/* Use Card class defaults for styling, minimal overrides */
