// File: BuyerFinancingOffers.js
// Path: frontend/src/components/BuyerFinancingOffers.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const BuyerFinancingOffers = () => {
  const [auctions, setAuctions] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/financing-auctions/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuctions(res.data);
    } catch (err) {
      setMessage('❌ Failed to load your financing requests');
    }
  };

  const handleSelectWinner = async (auctionId, bidIndex) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/financing-auctions/${auctionId}/select-winner`, {
        bidIndex
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Winner selected');
      fetchMyAuctions();
    } catch (err) {
      console.error('Select winner error:', err);
      setMessage('❌ Failed to select winner');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">💼 My Financing Requests & Lender Offers</h2>
        {message && <p className="mb-4 text-blue-600">{message}</p>}

        {auctions.length === 0 ? (
          <p className="text-gray-500">You have no active or past financing requests.</p>
        ) : (
          auctions.map((auction) => (
            <div key={auction._id} className="bg-white rounded shadow-md p-4 mb-6">
              <h4 className="text-lg font-semibold mb-1">
                🚗 {auction.carId?.make} {auction.carId?.model} ({auction.carId?.year})
              </h4>
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{auction.status}</span></p>
              <p className="text-sm text-gray-600 mb-2">Initial Down Payment: <strong>${auction.initialDownPayment}</strong></p>

              <h5 className="font-medium mb-2">📨 Bids Received:</h5>
              {auction.bidHistory.length === 0 ? (
                <p className="text-gray-500 italic">No bids yet.</p>
              ) : (
                <div className="space-y-4">
                  {auction.bidHistory.map((bid, idx) => (
                    <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
                      <p>💰 <strong>Rate:</strong> {bid.interestRate}% — <strong>Term:</strong> {bid.termMonths} months</p>
                      <p>📋 Credit Check: {bid.requiresCreditCheck ? '✅ Yes' : '❌ No'} | Income Proof: {bid.requiresIncomeProof ? '✅ Yes' : '❌ No'}</p>
                      <p className="text-sm italic text-gray-600">💬 Message: {bid.message || '—'}</p>
                      {auction.status === 'open' && (
                        <button
                          onClick={() => handleSelectWinner(auction._id, idx)}
                          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          🏆 Select This Bid
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerFinancingOffers;
