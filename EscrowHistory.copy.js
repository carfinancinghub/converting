// File: EscrowHistory.js
// Path: frontend/src/components/EscrowHistory.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const EscrowHistory = () => {
  const [escrows, setEscrows] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/escrow`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEscrows(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch escrow history');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const getFlags = (e) => {
    const issues = [];
    const now = new Date().getTime();
    if (!e.deliveredAt && now - new Date(e.createdAt).getTime() > 7 * 24 * 60 * 60 * 1000) {
      issues.push('⚠️ Undelivered > 7d');
    }
    if (e.deliveredAt && !e.releasedAt && now - new Date(e.deliveredAt).getTime() > 2 * 24 * 60 * 60 * 1000) {
      issues.push('⏱️ Not released > 2d');
    }
    const unpaid = (e.payouts || []).filter(p => !p.paid);
    if (unpaid.length > 0) {
      issues.push(`💸 Unpaid roles: ${unpaid.length}`);
    }
    return issues;
  };

  const applyFilter = (e) => {
    const flags = getFlags(e);
    if (filter === 'all') return true;
    if (filter === 'stalled') return flags.length > 0;
    if (filter === 'released') return e.status === 'released';
    return true;
  };

  const exportToCSV = () => {
    const rows = [
      ['ID', 'Status', 'Created', 'Delivered', 'Released', 'Flags'],
      ...escrows.map(e => [
        e._id.slice(-6),
        e.status,
        formatDate(e.createdAt),
        e.deliveredAt ? formatDate(e.deliveredAt) : '-',
        e.releasedAt ? formatDate(e.releasedAt) : '-',
        getFlags(e).join(', ')
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' +
      rows.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'escrow_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="escrow-history">
      <Navbar />
      <h2>🧾 Escrow History</h2>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('stalled')}>Only Stalled</button>
        <button onClick={() => setFilter('released')}>Only Released</button>
        <button onClick={exportToCSV}>📤 Export CSV</button>
      </div>
      {message && <p>{message}</p>}
      {escrows.length === 0 ? (
        <p>No escrow records found.</p>
      ) : (
        <table>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f1f1' }}>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Created</th>
              <th>Delivered</th>
              <th>Released</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {escrows.filter(applyFilter).map((e) => {
              const flags = getFlags(e);
              const isStalled = flags.length > 0;
              return (
                <tr key={e._id} style={{ backgroundColor: isStalled ? '#fff3cd' : 'transparent' }}>
                  <td>{e._id.slice(-6)}</td>
                  <td>{e.status}</td>
                  <td>{formatDate(e.createdAt)}</td>
                  <td>{e.deliveredAt ? formatDate(e.deliveredAt) : '-'}</td>
                  <td>{e.releasedAt ? formatDate(e.releasedAt) : '-'}</td>
                  <td>{flags.join(', ')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EscrowHistory;
