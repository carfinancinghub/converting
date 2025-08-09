// File: Dashboard.js
// Path: frontend/src/components/Dashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');
  const userRole = localStorage.getItem('role');

  const roleDestinations = {
    buyer: '/buyer-dashboard',
    seller: '/seller-dashboard',
    hauler: '/hauler-dashboard',
    mechanic: '/mechanic-dashboard',
    banker: '/lender-auctions',
    admin: '/admin/disputes'
  };

  return (
    <>
      <Navbar />
      <div className="dashboard" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome to the Car Financing Hub</h2>
        <p><strong>User:</strong> {userEmail || 'Unknown'}</p>
        <p><strong>Role:</strong> {userRole || 'Unassigned'}</p>

        {userRole && roleDestinations[userRole] && (
          <button
            onClick={() => navigate(roleDestinations[userRole])}
            style={{
              marginTop: '20px',
              padding: '10px 16px',
              fontSize: '16px'
            }}
          >
            Go to Your {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </button>
        )}

        {!userRole && (
          <p style={{ color: 'orange' }}>⚠️ No role detected. Please contact support.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
