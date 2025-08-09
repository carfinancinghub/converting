// File: StorageBidMarketplace.js
// Path: frontend/src/components/StorageBidMarketplace.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const StorageBidMarketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const buyerId = localStorage.getItem('userId');

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/storage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(j => j.buyerId?._id === buyerId);
      setJobs(filtered);
    } catch (err) {
      setMessage('❌ Failed to load your storage jobs');
    }
  };

  const acceptBid = async (jobId, providerId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/storage/${jobId}/accept`, {
        providerId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Bid accepted');
      fetchJobs();
    } catch (err) {
      setMessage('❌ Failed to accept bid');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="storage-bid-marketplace">
      <Navbar />
      <h2>📦 Storage Auction Bids</h2>
      {message && <p>{message}</p>}
      {jobs.length === 0 ? (
        <p>No active storage auctions.</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} style={{ border: '1px solid #ccc', margin: '12px 0', padding: '12px' }}>
            <h4>🚗 {job.carId?.make} {job.carId?.model} ({job.carId?.year})</h4>
            <p>Status: <strong>{job.status}</strong></p>

            {job.bidHistory.length === 0 ? (
              <p>No bids submitted yet.</p>
            ) : (
              <div>
                <h5>💰 Incoming Bids:</h5>
                {job.bidHistory.map((bid, idx) => (
                  <div key={idx} style={{ borderTop: '1px solid #eee', paddingTop: '6px', marginTop: '6px' }}>
                    <p><strong>${bid.price}</strong> {bid.indoor ? 'Indoor' : 'Outdoor'} Storage</p>
                    <p>Services: {bid.services.join(', ')}</p>
                    <button onClick={() => acceptBid(job._id, bid.providerId)}>✅ Accept This Bid</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StorageBidMarketplace;
