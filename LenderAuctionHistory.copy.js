// File: LenderAuctionHistory.js
// Path: frontend/src/components/LenderAuctionHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const LenderAuctionHistory = () => {
  const [auctions, setAuctions] = useState([]);
  const [message, setMessage] = useState('');

  const fetchAuctionHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auctions/my-bids-detailed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuctions(res.data);
    } catch (err) {
      setMessage('❌ Failed to load your lending history.');
    }
  };

  useEffect(() => {
    fetchAuctionHistory();
  }, []);

  const renderStatusTag = (status) => {
    const color = {
      Funded: 'green',
      Rejected: 'red',
      Closed: 'gray',
      Pending: 'orange'
    }[status] || 'blue';

    return (
      <span style={{
        padding: '4px 8px',
        backgroundColor: color,
        color: 'white',
        borderRadius: '6px',
        fontWeight: 'bold'
      }}>
        {status}
      </span>
    );
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>Your Lending Dashboard</h2>
        {message && <p>{message}</p>}

        {auctions.length === 0 ? (
          <p>No lending history found</p>
        ) : (
          auctions.map((a) => (
            <div key={a._id} className="auction-history-card" style={{ marginBottom: '24px', padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }}>
              <h4>{a.car?.year} {a.car?.make} {a.car?.model}</h4>
              <p><strong>Your Bid:</strong> {formatCurrency(a.yourBid)}</p>
              <p><strong>Winning Bid:</strong> {formatCurrency(a.winningBid)}</p>
              <p><strong>Loan Term:</strong> {a.loanTermMonths} months @ {a.interestRate}%</p>
              <p><strong>Estimated ROI:</strong> {a.won ? `${(a.interestRate * a.loanTermMonths / 12).toFixed(1)}%` : 'N/A'}</p>
              <p><strong>Status:</strong> {renderStatusTag(a.status)}</p>
              <p><strong>Updated:</strong> {new Date(a.updatedAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default LenderAuctionHistory;
