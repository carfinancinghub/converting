// File: SellerEditListing.js
// Path: frontend/src/components/seller/SellerEditListing.js
// 👑 Cod1 Crown Certified — Seller Listing Edit Form with Live Field Bindings + Schema Awareness

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import Input from '../../common/Input';
import Button from '../../common/Button';

const SellerEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        alert('Failed to load car');
      } finally {
        setLoading(false);
      }
    };
    loadCar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Listing updated!');
      navigate(`/seller/listings/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Error updating listing');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">✏️ Edit Listing</h1>

      <Input label="Make" name="make" value={form.make || ''} onChange={handleChange} required />
      <Input label="Model" name="model" value={form.model || ''} onChange={handleChange} required />
      <Input label="Year" name="year" type="number" value={form.year || ''} onChange={handleChange} required />
      <Input label="Price" name="price" type="number" value={form.price || ''} onChange={handleChange} required />
      <Input label="Mileage" name="mileage" type="number" value={form.mileage || ''} onChange={handleChange} />
      <Input label="VIN" name="vin" value={form.vin || ''} onChange={handleChange} />
      <Input label="Location" name="location" value={form.location || ''} onChange={handleChange} />
      <Input label="Condition Grade" name="conditionGrade" value={form.conditionGrade || ''} onChange={handleChange} placeholder="Excellent, Good, Fair, Poor" />
      <Input label="Tags (comma-separated)" name="tags" value={form.tags?.join(', ') || ''} onChange={handleChange} />
      <textarea
        className="w-full border p-2 rounded"
        rows={5}
        name="description"
        value={form.description || ''}
        onChange={handleChange}
        placeholder="Car description..."
      />

      <div className="flex gap-4 mt-4">
        <Button type="submit" variant="primary">Save Changes</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </form>
  );
};

export default SellerEditListing;
