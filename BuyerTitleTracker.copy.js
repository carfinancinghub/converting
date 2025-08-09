// File: BuyerTitleTracker.js
// Path: frontend/src/components/BuyerTitleTracker.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BuyerTitleTracker = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/title`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const buyerId = localStorage.getItem('userId');
      const filtered = res.data.filter(r => r.buyerId?._id === buyerId);
      setRecords(filtered);
    } catch (err) {
      setMessage('❌ Failed to load your title info');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">📜 Your Title & Registration Status</h2>
        {message && <p className="text-blue-600 mb-4">{message}</p>}

        {records.length === 0 ? (
          <p className="text-gray-600 italic">No title verification found yet.</p>
        ) : (
          records.map((rec) => (
            <div
              key={rec._id}
              className="bg-white shadow-md rounded-md p-4 mb-6 border border-gray-200"
            >
              <h4 className="text-lg font-semibold">
                🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})
              </h4>
              <p className="mt-1">
                Status:{' '}
                <span className={`font-semibold ${getStatusColor(rec.status)}`}>
                  {rec.status.toUpperCase()}
                </span>
              </p>
              {rec.document && (
                <img
                  src={rec.document}
                  alt="Proof of Title"
                  className="mt-4 border rounded-md max-w-full"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerTitleTracker;
