// File: AdminSystemHealth.js
// Path: frontend/src/components/admin/health/AdminSystemHealth.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../layout/AdminLayout';
import LoadingSpinner from '../../common/LoadingSpinner';
import ErrorBoundary from '../../common/ErrorBoundary';
import Card from '../../common/Card';

const AdminSystemHealth = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/system/health`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHealth(res.data);
      } catch (err) {
        console.error('Error fetching system health:', err);
        setError('❌ Failed to retrieve system health');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  return (
    <AdminLayout>
      <ErrorBoundary>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">💻 System Health Overview</h1>

          {loading && <LoadingSpinner />}
          {error && <p className="text-red-600">{error}</p>}

          {!!health && !loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="API Latency">
                <p className="text-xl font-semibold mt-2">{health.apiLatency} ms</p>
              </Card>
              <Card title="Database Status">
                <p className="text-xl font-semibold mt-2">{health.dbStatus}</p>
              </Card>
              <Card title="Uptime">
                <p className="text-xl font-semibold mt-2">{health.uptime}</p>
              </Card>
              <Card title="Active Connections">
                <p className="text-xl font-semibold mt-2">{health.activeConnections}</p>
              </Card>
              <Card title="Memory Usage">
                <p className="text-xl font-semibold mt-2">{health.memoryUsage} MB</p>
              </Card>
              <Card title="CPU Load">
                <p className="text-xl font-semibold mt-2">{health.cpuLoad} %</p>
              </Card>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AdminSystemHealth;
