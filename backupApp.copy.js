import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './components/LoginForm';
import SellerDashboard from './components/Seller/SellerDashboard';
import BankerLoanHistory from './components/Banker/BankerLoanHistory';
import BuyerLoanApplications from './components/Buyer/BuyerLoanApplications';
import HaulerDashboard from './components/Hauler/HaulerDashboard';
import InsurerDashboard from './components/Insurer/InsurerDashboard';
import FreightTrustDashboard from './components/FreightTrust/FreightTrustDashboard';
import Sidebar from './components/Sidebar';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const App = () => {
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role) {
      localStorage.clear();
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route
        path="/dashboard"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <SellerDashboard />
          </div>
        }
      />
      <Route
        path="/banker/loan-history"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <BankerLoanHistory />
          </div>
        }
      />
      <Route
        path="/buyer/loan-applications"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <BuyerLoanApplications />
          </div>
        }
      />
      <Route
        path="/hauler/dashboard"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <HaulerDashboard />
          </div>
        }
      />
      <Route
        path="/insurer/dashboard"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <InsurerDashboard />
          </div>
        }
      />
      <Route
        path="/freighttrust/dashboard"
        element={
          <div style={{ display: 'flex' }}>
            <Sidebar role={localStorage.getItem('role')} logout={handleLogout} />
            <FreightTrustDashboard />
          </div>
        }
      />
    </Routes>
  );
};

export default App;