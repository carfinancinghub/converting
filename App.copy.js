// File: App.js
// Path: frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarMobileToggle from './components/NavbarMobileToggle';
import OnboardingTrigger from './components/onboarding/OnboardingTrigger';

import BuyerDashboard from './components/BuyerDashboard';
import SellerDashboard from './components/SellerDashboard';
import ContractViewer from './components/ContractViewer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Admin Imports
import AdminLayout from './components/admin/layout/AdminLayout';
import AdminPaymentOverview from './components/admin/payments/AdminPaymentOverview';
import AdminSystemHealth from './components/admin/health/AdminSystemHealth';
import AdminNotificationCenter from './components/admin/notifications/AdminNotificationCenter';
import AdminSupportTickets from './components/admin/support/AdminSupportTickets';
import AdminArbitrationDashboard from './components/admin/arbitration/AdminArbitrationDashboard';

// Future Enhancement Placeholder (Optional Trigger)


const App = () => (
  <Router>
    <Navbar />
    <NavbarMobileToggle />
    {/* Optional: Display OnboardingTrigger at top level */}
    {/* <OnboardingTrigger /> */}

    <div className="p-4">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/buyer" replace />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/contract-viewer" element={<ContractViewer fileUrl="/sample.pdf" />} />
        <Route path="/loading-test" element={<LoadingSpinner />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout>
              <Outlet />
            </AdminLayout>
          </ProtectedRoute>
        }>
          <Route index element={<AdminPaymentOverview />} />
          <Route path="payments" element={<AdminPaymentOverview />} />
          <Route path="health" element={<AdminSystemHealth />} />
          <Route path="notifications" element={<AdminNotificationCenter />} />
          <Route path="support" element={<AdminSupportTickets />} />
          <Route path="arbitration" element={<AdminArbitrationDashboard />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </div>
  </Router>
);

export default App;
