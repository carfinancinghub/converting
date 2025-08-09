// File: AdminTitleDashboard.js
// Path: frontend/src/components/AdminTitleDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminTitleDashboard = () => {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [images, setImages] = useState({});
  const token = localStorage.getItem('token');

  const fetchTitleRecords = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/title`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data);
    } catch (err) {
      setMessage('❌ Failed to load title records');
    }
  };

  const updateTitleStatus = async (id, status) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/title/${id}/update`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Title status updated');
      fetchTitleRecords();
    } catch (err) {
      setMessage('❌ Failed to update status');
    }
  };

  const uploadDocument = async (id) => {
    try {
      const imageData = images[id];
      await axios.post(`${process.env.REACT_APP_API_URL}/api/title/${id}/upload`, { imageData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Title document uploaded');
      fetchTitleRecords();
    } catch (err) {
      setMessage('❌ Failed to upload document');
    }
  };

  const handleImage = (id, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages(prev => ({ ...prev, [id]: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchTitleRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">📜 Title & Registration Dashboard</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}

        {records.length === 0 ? (
          <p className="text-gray-600">No title records found.</p>
        ) : (
          <div className="space-y-6">
            {records.map((rec) => (
              <div
                key={rec._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h4 className="text-lg font-semibold mb-2">
                  🚗 {rec.carId?.make} {rec.carId?.model} ({rec.carId?.year})
                </h4>
                <p><strong>Buyer:</strong> {rec.buyerId?.email}</p>
                <p><strong>Status:</strong> <span className="font-semibold text-blue-600">{rec.status}</span></p>

                <div className="mt-2">
                  <label className="block font-medium mb-1">Update Status:</label>
                  <select
                    value={rec.status}
                    onChange={(e) => updateTitleStatus(rec._id, e.target.value)}
                    className="border px-3 py-2 rounded shadow-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block font-medium mb-1">Upload New Title Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(rec._id, e.target.files[0])}
                    className="mb-2"
                  />
                  {images[rec._id] && (
                    <img
                      src={images[rec._id]}
                      alt="Preview"
                      className="max-w-full border rounded mb-2"
                    />
                  )}
                  <button
                    onClick={() => uploadDocument(rec._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    📤 Upload Title Document
                  </button>
                </div>

                {rec.document && (
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Current Title Proof:</label>
                    <img
                      src={rec.document}
                      alt="Title Proof"
                      className="max-w-full border rounded"
                    />
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

export default AdminTitleDashboard;
