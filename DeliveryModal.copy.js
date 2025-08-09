// File: DeliveryModal.js
// Location: car-haul/client/src/components/DeliveryModal.js
import React, { useState } from 'react';
import axios from 'axios';

const DeliveryModal = ({ carId, auctionId, onClose }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        carId,
        auctionId,
        pickupLocation,
        dropoffLocation,
        deliveryDate,
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/deliveries`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Delivery scheduled!');
    } catch (err) {
      console.error('Error scheduling delivery:', err);
      setMessage('❌ Failed to schedule delivery.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📦 Schedule Delivery</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
          <input
            placeholder="Pickup Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            required
          />
          <input
            placeholder="Dropoff Location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
          <button type="submit">Confirm Delivery</button>
        </form>
        {message && <p>{message}</p>}
        <button onClick={onClose} style={{ marginTop: '1rem' }}>Close</button>
      </div>
    </div>
  );
};

export default DeliveryModal;

// --- End of DeliveryModal.js ---