// File: AdminDisputeDashboard.js
// Path: frontend/src/components/admin/AdminDisputeDashboard.js
// 👑 Cod1 Crown Certified — Admin Control Panel for Reviewing Disputed Deliveries

import React, { useEffect, useState } from 'react';
import Button from '../../common/Button';

const AdminDisputeDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlaggedJobs = async () => {
      try {
        const res = await fetch('/api/admin/flagged-jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error('Failed to load flagged jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlaggedJobs();
  }, []);

  const handleAssignJudge = (jobId) => {
    // Placeholder for future judge assignment logic
    alert(`Assigning judge for Job ID: ${jobId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold">🧾 Admin Dispute Dashboard</h2>
      {loading ? (
        <p>Loading flagged jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">No disputes currently flagged.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="border p-4 rounded shadow-sm bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">🚩 Dispute: {job._id}</h3>
                <p className="text-sm text-gray-600">Status: {job.status}</p>
                <p className="text-sm text-gray-600">GeoPin: {job.geoPin || 'N/A'}</p>
                <p className="text-sm text-gray-600">Updated: {new Date(job.updatedAt).toLocaleString()}</p>
              </div>
              <div className="space-y-2 text-right">
                <Button variant="primary" onClick={() => window.open(`/api/hauler/jobs/${job._id}/export-pdf`, '_blank')}>
                  📄 View PDF
                </Button>
                <Button variant="secondary" onClick={() => window.open(`/api/hauler/jobs/${job._id}/ai-review`, '_blank')}>
                  🧠 AI Review
                </Button>
                <Button variant="default" onClick={() => window.open(`/api/hauler/jobs/${job._id}/hash-anchor`, '_blank')}>
                  🔒 Verify Hash
                </Button>
                <Button variant="warning" onClick={() => handleAssignJudge(job._id)}>
                  👨‍⚖️ Assign Judge
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDisputeDashboard;
