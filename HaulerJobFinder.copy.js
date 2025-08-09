// File: HaulerJobFinder.js
// Path: frontend/src/components/HaulerJobFinder.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const HaulerJobFinder = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/deliveries/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      setMessage('❌ Failed to load jobs');
    }
  };

  const claimJob = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/deliveries/${id}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Job claimed successfully');
      fetchAvailableJobs();
    } catch (err) {
      setMessage('❌ Failed to claim job');
    }
  };

  return (
    <div className="hauler-job-finder">
      <Navbar />
      <h2>🗺️ Available Delivery Jobs</h2>
      {message && <p>{message}</p>}

      {jobs.length === 0 ? (
        <p>No available jobs to claim.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} style={{ border: '1px solid #ccc', padding: '12px', marginBottom: '14px', borderRadius: '8px' }}>
            <h4>🚗 Car: {job.carId?.make} {job.carId?.model} ({job.carId?.year})</h4>
            <p><strong>Buyer:</strong> {job.buyerId?.email || 'Unknown'}</p>
            <p><strong>Pickup:</strong> {job.pickupLocation || 'TBD'}</p>
            <p><strong>Dropoff:</strong> {job.dropoffLocation || 'TBD'}</p>
            <button onClick={() => claimJob(job._id)}>🚛 Claim This Job</button>
          </div>
        ))
      )}
    </div>
  );
};

export default HaulerJobFinder;
