// File: InsuranceBidPortal.js
// Path: frontend/src/components/InsuranceBidPortal.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InsuranceBidPortal = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const buyerId = localStorage.getItem('userId');

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/insurance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(r => r.buyerId?._id === buyerId);
      setRecords(filtered);
    } catch (err) {
      setMessage('❌ Failed to load insurance bids');
    }
  };

  const acceptBid = async (id, providerId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/insurance/${id}/accept`, { providerId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Insurance approved');
      fetchRecords();
    } catch (err) {
      setMessage('❌ Failed to accept bid');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="insurance-bid-portal">
      <Navbar />
      <h2>🛡 Insurance Bids</h2>
      {message && <p>{message}</p>}
      {records.length === 0 ? (
        <p>No insurance requests found.</p>
      ) : (
        records.map((rec) => (
          <div key={rec._id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '14px' }}>
            <h4>🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})</h4>
            <p>Status: <strong>{rec.status}</strong></p>

            {rec.bidHistory.length === 0 ? (
              <p>No insurance bids yet.</p>
            ) : (
              <div>
                <h5>💼 Available Quotes:</h5>
                {rec.bidHistory.map((bid, idx) => (
                  <div key={idx} style={{ marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '6px' }}>
                    <p><strong>${bid.premium}</strong> for {bid.coverageType} - {bid.durationMonths} months</p>
                    <button onClick={() => acceptBid(rec._id, bid.providerId)}>✅ Accept This Quote</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InsuranceBidPortal;
