// File: CreateListing.js
// Path: frontend/src/components/CreateListing.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const CreateListing = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: ''
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/listings', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMsg('✅ Listing created successfully!');
      setTimeout(() => navigate('/seller-dashboard'), 2000);
    } catch (err) {
      setError('❌ Failed to create listing. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="form-page" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
        <h2>Create New Car Listing</h2>
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            name="title"
            placeholder="Car Title (e.g. 1969 Mustang Fastback)"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Car description, condition, upgrades, etc."
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
          />
          <input
            type="number"
            name="price"
            placeholder="Asking Price (USD)"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
          />
          <button type="submit" style={{ padding: '8px 12px' }}>Create Listing</button>
        </form>
      </div>
    </>
  );
};

export default CreateListing;
