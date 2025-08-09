// File: DisputeCenter.js
// Location: client/src/components/Admin/DisputeCenter.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DisputeCenter = () => {
  const [disputes, setDisputes] = useState([]);
  const [filter, setFilter] = useState('open');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(res.data);
      } catch (err) {
        console.error('Failed to fetch disputes:', err);
        setError('❌ Could not load disputes.');
      }
    };

    fetchDisputes();
  }, []);

  const filtered = disputes.filter(d => d.status === filter);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>⚖️ Dispute Center</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by status: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0' }}>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Claimant</th>
            <th>Accused</th>
            <th>Status</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(d => (
            <tr key={d._id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{d.title}</td>
              <td>{d.category}</td>
              <td>{d.claimant?.email || 'N/A'}</td>
              <td>{d.accused?.email || 'N/A'}</td>
              <td>{d.status}</td>
              <td>
                {d.votes.length} / 3
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisputeCenter;
