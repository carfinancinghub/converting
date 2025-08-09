// File: InsuranceProviderDashboard.js
// Path: frontend/src/components/InsuranceProviderDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const InsuranceProviderDashboard = () => {
  const [records, setRecords] = useState([]);
  const [bids, setBids] = useState({});
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchInsuranceRequests = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/insurance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      setMessage('❌ Failed to load insurance requests');
    }
  };

  const handleBidChange = (id, field, value) => {
    setBids(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const submitBid = async (id) => {
    try {
      const bid = bids[id];
      await axios.post(`${process.env.REACT_APP_API_URL}/api/insurance/${id}/bid`, bid, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Quote submitted');
      fetchInsuranceRequests();
    } catch (err) {
      setMessage('❌ Failed to submit quote');
    }
  };

  useEffect(() => {
    fetchInsuranceRequests();
  }, []);

  return (
    <div className="insurance-provider-dashboard">
      <Navbar />
      <h2>🏢 Insurance Provider Portal</h2>
      {message && <p>{message}</p>}
      {records.length === 0 ? (
        <p>No insurance requests found.</p>
      ) : (
        records.map((rec) => (
          <div key={rec._id} style={{ border: '1px solid #ccc', marginBottom: '16px', padding: '12px' }}>
            <h4>🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})</h4>
            <p>Buyer: {rec.buyerId?.email}</p>
            <p>Status: <strong>{rec.status}</strong></p>

            <h5>📤 Submit a Quote</h5>
            <input
              type="number"
              placeholder="Premium ($)"
              onChange={(e) => handleBidChange(rec._id, 'premium', e.target.value)}
              style={{ marginRight: '6px' }}
            />
            <input
              type="text"
              placeholder="Coverage Type (e.g. Full, Liability)"
              onChange={(e) => handleBidChange(rec._id, 'coverageType', e.target.value)}
              style={{ marginRight: '6px' }}
            />
            <input
              type="number"
              placeholder="Duration (months)"
              onChange={(e) => handleBidChange(rec._id, 'durationMonths', e.target.value)}
              style={{ marginRight: '6px' }}
            />
            <button onClick={() => submitBid(rec._id)} style={{ marginTop: '6px' }}>📩 Submit Quote</button>
          </div>
        ))
      )}
    </div>
  );
};

export default InsuranceProviderDashboard;
