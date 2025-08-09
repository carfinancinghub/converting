// File: FinancingModal.js
// Location: car-haul/client/src/components/FinancingModal.js
import React, { useState } from 'react';
import axios from 'axios';

const FinancingModal = ({ carId, onClose }) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [term, setTerm] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        carId,
        loanAmount,
        term,
        creditScore,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/financing`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Financing application submitted.');
    } catch (err) {
      console.error('Error applying for financing:', err);
      setMessage('❌ Failed to apply for financing.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>💳 Apply for Financing</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
          <input
            type="number"
            placeholder="Loan Amount ($)"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Loan Term (months)"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Credit Score (optional)"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
          />
          <button type="submit">Submit Application</button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
};

export default FinancingModal;

// --- End of FinancingModal.js ---