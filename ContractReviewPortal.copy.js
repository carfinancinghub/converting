// File: ContractReviewPortal.js
// Path: frontend/src/components/ContractReviewPortal.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import ContractESignLauncher from './ContractESignLauncher';
import ContractSigningPanel from './ContractSigningPanel';
import BadgeDisplay from './BadgeDisplay';

const ContractReviewPortal = () => {
  const [auctions, setAuctions] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

  const fetchAuctions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auctions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(a => a.buyerId?._id === userId || a.sellerId?._id === userId);
      setAuctions(filtered);
    } catch (err) {
      setMessage('❌ Failed to load your auctions');
    }
  };

  const downloadContract = (auctionId) => {
    window.open(`${process.env.REACT_APP_API_URL}/api/contracts/${auctionId}/pdf`, '_blank');
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div className="contract-review-portal">
      <Navbar />
      <h2>📄 Contract Review Portal</h2>
      {message && <p>{message}</p>}
      {auctions.length === 0 ? (
        <p>No contracts available.</p>
      ) : (
        auctions.map((a) => (
          <div key={a._id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '16px' }}>
            <h4>🚗 {a.carId?.make} {a.carId?.model} ({a.carId?.year})</h4>
            <p>Status: {a.status}</p>
            <p>Buyer: {a.buyerId?.email}</p>
            <BadgeDisplay userId={a.buyerId?._id} />
            <p>Seller: {a.sellerId?.email}</p>
            <BadgeDisplay userId={a.sellerId?._id} />
            <p>Bid: ${a.currentBid}</p>
            <button onClick={() => downloadContract(a._id)}>📝 Download Contract PDF</button>
            {a.useExternalSigning ? (
              <ContractESignLauncher auctionId={a._id} />
            ) : (
              <ContractSigningPanel auctionId={a._id} role={userRole} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ContractReviewPortal;
