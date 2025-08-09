// File: BuyerDeliveryTracker.js
// Path: frontend/src/components/BuyerDeliveryTracker.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BuyerDeliveryTracker = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState({});
  const token = localStorage.getItem('token');

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/deliveries/buyer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveries(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch your deliveries');
    }
  };

  const confirmReceipt = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/deliveries/${id}/confirm`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Delivery confirmed');
      fetchDeliveries();
    } catch (err) {
      setMessage('❌ Failed to confirm receipt');
    }
  };

  const reportIssue = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/disputes/report`, {
        deliveryId: id,
        reason: 'Buyer reported a delivery issue',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('⚠️ Issue reported to dispute center');
    } catch (err) {
      setMessage('❌ Failed to report issue');
    }
  };

  const handleImageUpload = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => ({ ...prev, [id]: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const renderProgress = (status) => {
    const stages = ['pending', 'in_transit', 'delivered'];
    const current = stages.indexOf(status);
    return (
      <div className="flex items-center gap-2 text-sm my-2">
        {stages.map((stage, i) => (
          <span
            key={i}
            className={`font-semibold ${i === current ? 'text-green-600' : 'text-gray-500'}`}
          >
            {stage.replace('_', ' ').toUpperCase()}
            {i < stages.length - 1 && ' →'}
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🚘 Your Delivery Tracker</h2>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {deliveries.length === 0 ? (
          <p className="text-gray-600">No current deliveries.</p>
        ) : (
          <div className="space-y-6">
            {deliveries.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">
                  🚗 {job.carId?.make} {job.carId?.model} ({job.carId?.year})
                </h4>
                <p><strong>Hauler:</strong> {job.haulerId?.email || '—'}</p>
                {renderProgress(job.status)}
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Last Known Location:</strong> {job.location || 'Unknown'}</p>
                <p><strong>Pickup:</strong> {job.pickupLocation}</p>
                <p><strong>Dropoff:</strong> {job.dropoffLocation}</p>
                <p><strong>Pickup Time:</strong> {job.pickupTime ? new Date(job.pickupTime).toLocaleString() : '—'}</p>
                <p><strong>Dropoff Time:</strong> {job.dropoffTime ? new Date(job.dropoffTime).toLocaleString() : '—'}</p>

                {images[job._id] && (
                  <img
                    src={images[job._id]}
                    alt="Proof of Delivery"
                    className="mt-3 max-w-full rounded border"
                  />
                )}

                {job.status === 'delivered' && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(job._id, e.target.files[0])}
                      className="block mb-2"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => confirmReceipt(job._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        ✅ Confirm Receipt
                      </button>
                      <button
                        onClick={() => reportIssue(job._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        ⚠️ Report Issue
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDeliveryTracker;
