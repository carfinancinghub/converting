// File: AdminDashboard.js
// Path: frontend/src/components/admin/dashboard/AdminDashboard.js

import AdminSummaryPanel from './AdminSummaryPanel';
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../Navbar';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
	<AdminSummaryPanel />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/reports"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            🧾 <strong>Audit Logs</strong>
            <p className="text-sm text-gray-600">View system access and activity logs</p>
          </Link>

          <Link
            to="/admin/arbitration"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            ⚖️ <strong>Arbitration Cases</strong>
            <p className="text-sm text-gray-600">Manage disputes and judge assignments</p>
          </Link>

          <Link
            to="/admin/users"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            👥 <strong>User Management</strong>
            <p className="text-sm text-gray-600">View, verify, or ban platform users</p>
          </Link>

          <Link
            to="/admin/contracts"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            📄 <strong>Contracts & Templates</strong>
            <p className="text-sm text-gray-600">Access and manage legal documents</p>
          </Link>

          <Link
            to="/admin/insights"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            📊 <strong>Platform Insights</strong>
            <p className="text-sm text-gray-600">Review user activity and trends</p>
          </Link>

          <Link
            to="/admin/notifications"
            className="p-5 bg-white rounded shadow hover:bg-gray-100 transition"
          >
            🔔 <strong>Notification Center</strong>
            <p className="text-sm text-gray-600">Send alerts or platform messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
