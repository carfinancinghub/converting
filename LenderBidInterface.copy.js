// File: LenderBidInterface.js
// Path: frontend/src/components/LenderBidInterface.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const LenderBidInterface = () => {
  const { auctionId } = useParams();
  const [auction, setAuction] = useState(null);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    amount: '',
    interestRate: '',
    termMonths: ''
  });

  const fetchAuction = async () => {
    try {
      const res = await axios.get(`/api/auctions/${auctionId}`);
      setAuction(res.data);
    } catch (err) {
      setMessage('❌ Failed to load auction');
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await axios.get(`/api/auctions/${auctionId}/offers`);
      setOffers(res.data);
    } catch (err) {
      console.error('Failed to load offers');
    }
  };

  useEffect(() => {
    fetchAuction();
    fetchOffers();
  }, [auctionId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/auctions/${auctionId}/offers`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Bid submitted successfully');
      setForm({ amount: '', interestRate: '', termMonths: '' });
      fetchOffers();
    } catch (err) {
      setMessage('❌ Failed to submit bid');
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2>Lender Bid Interface</h2>
        {message && <p>{message}</p>}

        {auction ? (
          <div className="auction-summary" style={{ marginBottom: '16px' }}>
            <h4>{auction.car?.year} {auction.car?.make} {auction.car?.model}</h4>
            <p><strong>Buyer:</strong> {auction.buyerId?.email || auction.buyerId}</p>
            <p><strong>Current Bid:</strong> {formatCurrency(auction.currentBid)}</p>
          </div>
        ) : (
          <p>Loading auction details...</p>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
          <input
            type="number"
            name="amount"
            placeholder="Amount to Finance"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="interestRate"
            placeholder="Interest Rate (%)"
            step="0.01"
            value={form.interestRate}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="termMonths"
            placeholder="Loan Term (months)"
            value={form.termMonths}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{ marginTop: '8px' }}>Submit Offer</button>
        </form>

        <h4>Other Lender Offers</h4>
        {offers.length === 0 ? (
          <p>No competing offers yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '6px' }}>Lender</th>
                <th style={{ border: '1px solid #ccc', padding: '6px' }}>Amount</th>
                <th style={{ border: '1px solid #ccc', padding: '6px' }}>Rate</th>
                <th style={{ border: '1px solid #ccc', padding: '6px' }}>Term</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((o, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{o.lenderId?.email || 'Anon'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{formatCurrency(o.amount)}</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{o.interestRate}%</td>
                  <td style={{ border: '1px solid #ccc', padding: '6px' }}>{o.termMonths} mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default LenderBidInterface;
