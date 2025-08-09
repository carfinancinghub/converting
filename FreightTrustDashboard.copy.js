import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getStyles } from '../Seller/OffersHistory';

const FreightTrustDashboard = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ parties: '', description: '' });
  const [resolveFormData, setResolveFormData] = useState({ disputeId: '', resolutionNote: '' });
  const role = localStorage.getItem('role') || 'Guest';
  const userId = localStorage.getItem('userId') || 'user123';
  const navigate = useNavigate();
  const theme = 'light';

  useEffect(() => {
    const fetchDisputes = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/disputes/freighttrust/${userId}`);
        setDisputes(response.data);
      } catch (error) {
        console.error('Error fetching disputes:', error);
        setError('Failed to load disputes.');
      } finally {
        setLoading(false);
      }
    };

    if (role === 'FreightTrust') {
      fetchDisputes();
    } else {
      if (role.toLowerCase().startsWith('seller')) {
        navigate('/dashboard');
      } else if (role.toLowerCase().startsWith('banker')) {
        navigate('/banker/loan-history');
      } else if (role.toLowerCase().startsWith('buyer')) {
        navigate('/buyer/loan-applications');
      } else if (role.toLowerCase().startsWith('hauler')) {
        navigate('/hauler/dashboard');
      } else if (role.toLowerCase().startsWith('insurer')) {
        navigate('/insurer/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [role, userId, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResolveInputChange = (e) => {
    setResolveFormData({ ...resolveFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/disputes', {
        parties: formData.parties.split(',').map(party => party.trim()),
        description: formData.description,
        status: 'Open',
      });
      setDisputes([...disputes, response.data]);
      setFormData({ parties: '', description: '' });
    } catch (error) {
      console.error('Error creating dispute:', error);
      setError(error.response?.data?.error || 'An error occurred while creating the dispute.');
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    setError('');
    if (!resolveFormData.disputeId || !resolveFormData.resolutionNote) {
      setError('Please select a dispute and enter a resolution note.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/disputes/${resolveFormData.disputeId}/resolve`, {
        resolutionNote: resolveFormData.resolutionNote,
      });
      setDisputes(disputes.map(dispute =>
        dispute._id === resolveFormData.disputeId ? response.data : dispute
      ));
      setResolveFormData({ disputeId: '', resolutionNote: '' });
    } catch (error) {
      console.error('Error resolving dispute:', error);
      setError(error.response?.data?.error || 'An error occurred while resolving the dispute.');
    }
  };

  if (role !== 'FreightTrust') {
    return null;
  }

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>FreightTrust Dashboard</h1>
        <p>Welcome, {role}!</p>
        <p>Manage disputes and ensure trust between parties.</p>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Create New Dispute</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="parties"
            placeholder="Parties (comma-separated)"
            value={formData.parties}
            onChange={handleInputChange}
            style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px' }}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Add Dispute
          </button>
        </form>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Resolve Dispute</h3>
        <form onSubmit={handleResolveDispute}>
          <select
            name="disputeId"
            value={resolveFormData.disputeId}
            onChange={handleResolveInputChange}
            style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px' }}
          >
            <option value="">-- Select Dispute --</option>
            {disputes.filter(dispute => dispute.status === 'Open').map(dispute => (
              <option key={dispute._id} value={dispute._id}>
                {`Dispute: ${dispute.description} (Parties: ${dispute.parties.join(', ')})`}
              </option>
            ))}
          </select>
          <textarea
            name="resolutionNote"
            placeholder="Resolution Note"
            value={resolveFormData.resolutionNote}
            onChange={handleResolveInputChange}
            style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px', height: '100px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
            Mark as Resolved
          </button>
          {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
        </form>
      </div>
      {loading ? (
        <div style={styles.loadingSpinner}>Loading...</div>
      ) : (
        <ul style={styles.list}>
          {disputes.map(dispute => (
            <li key={dispute._id} style={styles.listItem}>
              Dispute ID: {dispute._id} - Parties: {dispute.parties.join(', ')} - Status: {dispute.status}
              {dispute.resolutionNote && <p>Resolution: {dispute.resolutionNote}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FreightTrustDashboard;