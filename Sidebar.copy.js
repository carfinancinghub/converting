// File: Sidebar.js (Updated with Disputes link for Admin)
// Location: client/src/components/Layout/Sidebar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email') || 'Logged In';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const commonLinks = [{ label: 'Dashboard', path: '/dashboard' }];

  const adminLinks = [
    { label: 'Admin Home', path: '/admin' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Disputes', path: '/admin/disputes' }, // ✅ NEW
    { label: 'Auctions', path: '/admin/auctions' },
  ];

  const sellerLinks = [{ label: 'My Cars', path: '/dashboard' }];
  const buyerLinks = [{ label: 'Buy Cars', path: '/dashboard' }];
  const haulerLinks = [{ label: 'Hauler Jobs', path: '/hauler-dashboard' }];

  const getRoleLinks = () => {
    switch (role) {
      case 'admin':
        return adminLinks;
      case 'seller':
        return sellerLinks;
      case 'buyer':
        return buyerLinks;
      case 'hauler':
        return haulerLinks;
      default:
        return [];
    }
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">🚗 CarHub</h2>
      <div className="sidebar-user">👤 {userEmail}</div>
      {[...commonLinks, ...getRoleLinks()].map((link) => (
        <Link key={link.path} to={link.path} className="sidebar-link">
          {link.label}
        </Link>
      ))}
      <button className="sidebar-logout" onClick={handleLogout}>
        🔓 Logout
      </button>
    </div>
  );
};

export default Sidebar;
