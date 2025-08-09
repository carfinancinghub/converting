// File: SellerViewListings.js
// Path: frontend/src/components/seller/SellerViewListings.js
// 👑 Cod1 Crown Certified — Supreme Seller Listing Detail View w/ Image Grid, Edit/Delete Controls, and Schema Intelligence

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../common/LoadingSpinner';
import Button from '../../common/Button';

const SellerViewListings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(res.data);
      } catch (err) {
        console.error('Error loading listing:', err);
        alert('Listing not found or failed to load');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/seller/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Listing deleted');
      navigate('/seller');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete listing');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!car) return <p className="text-red-500">Listing not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🚘 {car.year} {car.make} {car.model}</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/seller/listings/${id}/edit`)}>✏️ Edit</Button>
          <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
        </div>
      </div>

      <p>Status: <span className="text-blue-600 font-semibold">{car.status}</span></p>
      <p>Price: <strong>${car.price.toLocaleString()}</strong></p>
      <p>Mileage: {car.mileage?.toLocaleString()} miles</p>
      <p>VIN: {car.vin || 'N/A'}</p>
      <p>Condition: {car.conditionGrade || 'Unknown'}</p>
      <p>Location: {car.location || 'Not specified'}</p>
      <p>Tags: {car.tags?.length > 0 ? car.tags.join(', ') : 'None'}</p>
      <p className="text-sm text-gray-500">Listed on: {new Date(car.createdAt).toLocaleDateString()}</p>

      {car.images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {car.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`Image ${i + 1}`}
              className="rounded shadow h-32 w-full object-cover"
            />
          ))}
        </div>
      )}

      {car.description && (
        <div>
          <h3 className="font-semibold text-lg mt-4">📄 Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{car.description}</p>
        </div>
      )}
    </div>
  );
};

export default SellerViewListings;
