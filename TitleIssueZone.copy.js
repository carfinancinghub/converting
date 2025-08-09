// File: TitleIssueZone.js
// Path: frontend/src/components/TitleIssueZone.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const TitleIssueZone = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchTitleIssues = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/title`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const problemCars = res.data.filter(r => r.status === 'missing' || r.status === 'rejected');
      setCars(problemCars);
    } catch (err) {
      setMessage('❌ Failed to load title-issue cars');
    }
  };

  useEffect(() => {
    fetchTitleIssues();
  }, []);

  return (
    <div className="title-issue-zone">
      <Navbar />
      <h2>🚫 Title-Issue Vehicles</h2>
      <p style={{ fontStyle: 'italic' }}>Only verified dealers or institutional buyers can bid on these listings. Title is either missing or legally restricted.</p>
      {message && <p>{message}</p>}
      {cars.length === 0 ? (
        <p>No title-issue vehicles at the moment.</p>
      ) : (
        cars.map((rec) => (
          <div key={rec._id} style={{ border: '1px solid #d66', margin: '10px 0', padding: '12px', background: '#fff8f8' }}>
            <h4>🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})</h4>
            <p>Status: <strong style={{ color: rec.status === 'missing' ? 'red' : 'orange' }}>{rec.status.toUpperCase()}</strong></p>
            <p>Buyer: {rec.buyerId?.email || 'Unassigned'}</p>
            {rec.document ? (
              <img src={rec.document} alt="Proof of Title" style={{ maxWidth: '100%', marginTop: '8px' }} />
            ) : (
              <p><em>No title documentation uploaded.</em></p>
            )}
            <button disabled title="Only institutional buyers can bid.">🚫 Bidding Restricted</button>
          </div>
        ))
      )}
    </div>
  );
};

export default TitleIssueZone;
