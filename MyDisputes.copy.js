// File: MyDisputes.js
// Path: frontend/src/components/MyDisputes.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const MyDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDisputes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/disputes/my-history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDisputes(res.data);
    } catch (err) {
      setMessage('❌ Failed to load disputes');
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const userId = localStorage.getItem('userId');

  const renderStatus = (status) => {
    const color = {
      resolved: 'green',
      escalated: 'red',
      pending: 'orange'
    }[status?.toLowerCase()] || 'gray';

    return (
      <span style={{
        backgroundColor: color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px'
      }}>
        {status}
      </span>
    );
  };

  const renderVotes = (votes) => {
    return votes.map((v, idx) => (
      <li key={idx}>
        <strong>{v.arbitratorId?.email || 'Judge'}:</strong> {v.vote} {v.reason ? `– ${v.reason}` : ''}
      </li>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>My Dispute History</h2>
        <button onClick={fetchDisputes} style={{ marginBottom: '12px' }}>🔄 Refresh</button>
        {message && <p style={{ color: 'red' }}>{message}</p>}

        {disputes.length === 0 ? (
          <p>No disputes found.</p>
        ) : (
          disputes.map((d) => (
            <div key={d._id} className="dispute-card" style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '16px', borderRadius: '6px' }}>
              <h4>Dispute ID: {d._id}</h4>
              <p><strong>Reason:</strong> {d.reason}</p>
              <p><strong>Status:</strong> {renderStatus(d.status)}</p>
              <p><strong>Resolution:</strong> {d.resolution || 'Pending'}</p>
              <p><strong>Your Role:</strong> {d.initiatorId?._id === userId ? 'Initiator' : 'Defendant'}</p>
              <p><strong>Votes:</strong></p>
              <ul>{renderVotes(d.votes)}</ul>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyDisputes;
