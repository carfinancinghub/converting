// File: ContractSigningPanel.js
// Path: frontend/src/components/ContractSigningPanel.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractSigningPanel = ({ auctionId, role }) => {
  const [status, setStatus] = useState('unsigned');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStatus();
  }, [auctionId]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/contracts/${auctionId}/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.status);
    } catch (err) {
      setMessage('❌ Failed to fetch signing status');
    }
  };

  const signContract = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/contracts/${auctionId}/sign`, { role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Contract signed');
      setStatus(res.data.newStatus);
    } catch (err) {
      setMessage('❌ Signing failed');
    }
  };

  const renderStatusTag = () => {
    switch (status) {
      case 'buyer_signed': return <span style={{ color: 'blue' }}>Buyer Signed</span>;
      case 'seller_signed': return <span style={{ color: 'green' }}>Seller Signed</span>;
      case 'complete': return <span style={{ color: 'purple' }}>✅ Fully Signed</span>;
      default: return <span style={{ color: 'gray' }}>Pending Signature</span>;
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <p>Status: {renderStatusTag()}</p>
      <button onClick={signContract} disabled={status === 'complete'}>
        ✍ Sign as {role.charAt(0).toUpperCase() + role.slice(1)}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ContractSigningPanel;
