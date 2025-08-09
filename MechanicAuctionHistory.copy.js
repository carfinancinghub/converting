// File: MechanicAuctionHistory.js
// Path: frontend/src/components/MechanicAuctionHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MechanicAuctionHistory = () => {
  const [inspections, setInspections] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/inspections/mechanic-history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInspections(res.data);
      setLoading(false);
    } catch (err) {
      setMessage('❌ Failed to load inspection history');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const renderStatus = (status) => {
    const color = {
      pending: 'orange',
      completed: 'green',
      in_progress: 'blue',
      rejected: 'red'
    }[status?.toLowerCase()] || 'gray';

    return (
      <span style={{
        backgroundColor: color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>Mechanic Inspection History</h2>
        <button onClick={fetchInspections} style={{ marginBottom: '10px' }}>🔄 Refresh</button>
        {message && <p style={{ color: 'red' }}>{message}</p>}
        {loading && <p>Loading...</p>}

        {inspections.length === 0 ? (
          <p>No inspection history found</p>
        ) : (
          inspections.map((entry, index) => (
            <div key={index} className="inspection-entry" style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '12px', marginBottom: '12px' }}>
              <h4>Car: {entry.carId?.year} {entry.carId?.make} {entry.carId?.model}</h4>
              <p><strong>Owner:</strong> {entry.ownerEmail}</p>
              <p><strong>Condition:</strong> {entry.condition || 'Not provided'}</p>
              <p><strong>Status:</strong> {renderStatus(entry.status)}</p>
              <p><strong>Inspected At:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MechanicAuctionHistory;
