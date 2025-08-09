// File: JudgeVotePanel.js
// Location: client/src/components/Admin/JudgeVotePanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JudgeVotePanel = ({ disputeId }) => {
  const [dispute, setDispute] = useState(null);
  const [vote, setVote] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDispute = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDispute(res.data);
      } catch (err) {
        console.error('Error loading dispute:', err);
        setMessage('❌ Failed to load dispute.');
      }
    };

    fetchDispute();
  }, [disputeId]);

  const handleVote = async () => {
    if (!vote) return alert('Please select a vote');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/disputes/${disputeId}/vote`, {
        vote,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Vote submitted!');
    } catch (err) {
      console.error('Vote failed:', err);
      setMessage('❌ Failed to submit vote.');
    }
  };

  if (!dispute) return <p>Loading...</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '2rem' }}>
      <h3>🗳 Review Dispute: {dispute.title}</h3>
      <p><strong>Claimant:</strong> {dispute.claimant?.email}</p>
      <p><strong>Accused:</strong> {dispute.accused?.email}</p>
      <p><strong>Category:</strong> {dispute.category}</p>
      <p><strong>Claim:</strong> {dispute.claimText}</p>
      <p><strong>Status:</strong> {dispute.status}</p>

      <hr />

      <div>
        <label>Cast Your Vote:</label><br />
        <select value={vote} onChange={(e) => setVote(e.target.value)} style={{ marginTop: '0.5rem' }}>
          <option value="">-- Select --</option>
          <option value="yes">✅ In favor of claimant</option>
          <option value="no">❌ In favor of accused</option>
          <option value="neutral">⚖️ Neutral</option>
        </select>
        <button onClick={handleVote} style={{ marginLeft: '1rem' }}>Submit Vote</button>
      </div>

      {message && <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}

      <hr />
      <h4>🗂 Vote History</h4>
      <ul>
        {dispute.votes.map((v, i) => (
          <li key={i}>
            {v.judge?.email?.slice(0, 8)}... — <strong>{v.vote}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JudgeVotePanel;
