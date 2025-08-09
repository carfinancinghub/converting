// File: AdminInspectionReview.js
// Path: frontend/src/components/AdminInspectionReview.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminInspectionReview = () => {
  const [inspections, setInspections] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchInspections = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/inspections/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInspections(res.data);
    } catch (err) {
      setMessage('❌ Failed to load inspections');
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const statusBadge = (status) => {
    const color = status === 'completed' ? 'bg-green-600' : 'bg-yellow-500';
    return (
      <span className={`text-white text-xs font-semibold px-2 py-1 rounded ${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🧾 Admin Inspection Review</h2>
          <button
            onClick={fetchInspections}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>

        {message && <p className="mb-4 text-red-500">{message}</p>}

        {inspections.length === 0 ? (
          <p className="text-gray-600">No inspections available.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {inspections.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-lg shadow border border-gray-200"
              >
                <h4 className="text-lg font-semibold mb-1">
                  🚗 {item.carId?.make} {item.carId?.model} ({item.carId?.year})
                </h4>
                <p className="mb-1">
                  <strong>Status:</strong> {statusBadge(item.status)}
                </p>
                <p><strong>Requested By:</strong> {item.buyerId?.email || '—'}</p>
                <p><strong>Assigned Mechanic:</strong> {item.mechanicId?.email || '—'}</p>
                <p className="mt-2 font-semibold">Inspection Report:</p>
                <pre className="bg-gray-100 p-2 text-sm rounded overflow-x-auto">
                  {item.note || '—'}
                </pre>
                {item.image && (
                  <div className="mt-3">
                    <img
                      src={item.image}
                      alt="Inspection Proof"
                      className="w-full rounded border border-gray-300"
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

export default AdminInspectionReview;
