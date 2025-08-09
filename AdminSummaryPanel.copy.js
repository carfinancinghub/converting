// File: AdminSummaryPanel.js
// Path: frontend/src/components/admin/dashboard/AdminSummaryPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSummaryPanel = () => {
  const [stats, setStats] = useState({
    totalDisputes: 0,
    openVotes: 0,
    activeContracts: 0,
    unreadNotifications: 0,
    fraudAlerts: 0,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const disputeRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalDisputes = disputeRes.data.length;
        const openVotes = disputeRes.data.filter(d => d.status === 'pending').length;

        const notifRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/unread`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fraudRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/fraud/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          totalDisputes,
          openVotes,
          activeContracts: 17, // Placeholder, replace with real fetch
          unreadNotifications: notifRes.data.length || 0,
          fraudAlerts: fraudRes.data.length || 0,
        });
      } catch (err) {
        console.error('Error loading admin summary:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-2">📊 Admin Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Disputes" value={stats.totalDisputes} icon="🧾" />
        <StatCard label="Open Votes" value={stats.openVotes} icon="🗳️" />
        <StatCard label="Active Contracts" value={stats.activeContracts} icon="📄" />
        <StatCard label="Unread Notifications" value={stats.unreadNotifications} icon="🔔" />
        <StatCard label="Fraud Alerts" value={stats.fraudAlerts} icon="⚠️" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="border border-gray-200 rounded p-4 shadow hover:shadow-md transition">
    <div className="text-3xl">{icon}</div>
    <div className="text-xl font-semibold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default AdminSummaryPanel;
