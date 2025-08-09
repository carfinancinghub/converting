// File: ListingDetails.js
// Path: frontend/src/components/ListingDetails.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [holdRequested, setHoldRequested] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/cars/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error('Error fetching listing:', err);
      }
    };

    fetchListing();
  }, [id]);

  const handleHoldRequest = async () => {
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/hold-requests`, {
        carId: id,
        sellerId: listing.sellerId,
        notes: 'Requesting to hold the car for 7 days.'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHoldRequested(true);
      setMessage('✅ Hold request sent successfully');
    } catch (err) {
      console.error(err);
      setError('❌ Failed to send hold request');
    }
  };

  const handleStartAuction = () => {
    navigate(`/start-auction/${listing._id}`);
  };

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="listing-details">
      <div className="card">
        <h2>{listing.make} {listing.model} ({listing.year})</h2>
        <p><strong>Price:</strong> ${listing.price}</p>
        <p><strong>Status:</strong> {listing.status}</p>
        <p><strong>Description:</strong> {listing.description || 'N/A'}</p>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        <button onClick={handleStartAuction}>Start Auction</button>

        {!holdRequested ? (
          <button onClick={handleHoldRequest}>Hold This Car</button>
        ) : (
          <p>⏳ Hold already requested.</p>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
