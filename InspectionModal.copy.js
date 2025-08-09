// components/modals/InspectionModal.js
import React, { useState } from 'react';
import axios from 'axios';

const InspectionModal = ({ carId, onClose, onRequest }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const token = localStorage.getItem('token');

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/inspections`, { carId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResult('✅ Inspection requested!');
      onRequest && onRequest();
    } catch (err) {
      console.error('Inspection error:', err);
      setResult('❌ Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>🔍 Request Vehicle Inspection</h3>
        <p>This will notify a mechanic to inspect this car. You'll be notified once the report is ready.</p>
        <button onClick={handleRequest} disabled={loading}>
          {loading ? 'Requesting...' : 'Request Inspection'}
        </button>
        {result && <p>{result}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default InspectionModal;
