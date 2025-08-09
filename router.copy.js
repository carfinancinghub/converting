// File: router.js
// Path: frontend/src/routes/router.js

import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// 📦 Layout wrapper for all routes
import MainLayout from '../components/layout/MainLayout';

// 🔒 Auth and Session
import Login from '../components/Login';
import Register from '../components/Register';

// 🏠 Core & Home
import Dashboard from '../components/Dashboard';

// 👤 User Role Dashboards
import BuyerDashboard from '../components/BuyerDashboard';
import SellerDashboard from '../components/SellerDashboard';
import LenderDashboard from '../components/LenderDashboard';
import AdminDashboard from '../components/AdminDashboard';
import InsuranceDashboard from '../components/InsuranceDashboard';
import EscrowDashboard from '../components/EscrowDashboard';
import StorageDashboard from '../components/StorageDashboard';
import MechanicDashboard from '../components/MechanicDashboard';

// 🚗 Listings & Auctions
import Listings from '../components/Listings';
import ListingDetails from '../components/ListingDetails';
import CreateListingForm from '../components/CreateListingForm';
import SellerCreateListing from '../components/SellerCreateListing';
import StartAuctionForm from '../components/StartAuctionForm';

// 📄 Contracts & Documents
import BuyerContractView from '../components/BuyerContractView';
import LenderContractView from '../components/LenderContractView';
import AdminContractDashboard from '../components/AdminContractDashboard';

// ⚖️ Disputes & Reviews
import MyDisputes from '../components/MyDisputes';
import DisputeReview from '../components/DisputeReview';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <MainLayout />, // Shared layout wrapper for all children
      children: [
        // Public and Core Routes
        { path: '/', element: <Dashboard /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },

        // Role Dashboards
        { path: 'buyer-dashboard', element: <BuyerDashboard /> },
        { path: 'seller-dashboard', element: <SellerDashboard /> },
        { path: 'lender-dashboard', element: <LenderDashboard /> },
        { path: 'admin-dashboard', element: <AdminDashboard /> },
        { path: 'insurance-dashboard', element: <InsuranceDashboard /> },
        { path: 'escrow-dashboard', element: <EscrowDashboard /> },
        { path: 'storage-dashboard', element: <StorageDashboard /> },
        { path: 'mechanic-dashboard', element: <MechanicDashboard /> },

        // Listings & Auctions
        { path: 'listings', element: <Listings /> },
        { path: 'listings/:id', element: <ListingDetails /> },
        { path: 'create-listing', element: <CreateListingForm /> },
        { path: 'seller-create-listing', element: <SellerCreateListing /> },
        { path: 'start-auction/:id', element: <StartAuctionForm /> },

        // Contracts
        { path: 'buyer-contracts', element: <BuyerContractView /> },
        { path: 'lender-contracts', element: <LenderContractView /> },
        { path: 'admin-contract-dashboard', element: <AdminContractDashboard /> },

        // Disputes
        { path: 'my-disputes', element: <MyDisputes /> },
        { path: 'admin/disputes', element: <DisputeReview /> }
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true, // ✅ Pre-enable smoother transitions
      v7_relativeSplatPath: true // ✅ Future-proof nested routes
    }
  }
);

export default router;