// File: AdminSupportTickets.js
// Path: frontend/src/components/AdminSupportTickets.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/support/tickets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching support tickets:', err);
        setError('❌ Failed to load support tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">🆘 Support Tickets</h1>
        {loading && <p>Loading tickets...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && tickets.length === 0 && <p className="text-gray-500">No support tickets.</p>}
        {!loading && !error && tickets.length > 0 && (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket._id} className="border rounded p-4 shadow bg-white">
                <p><strong>Subject:</strong> {ticket.subject}</p>
                <p className="text-sm text-gray-600"><strong>From:</strong> {ticket.user?.email || 'Unknown'}</p>
                <p className="mt-2">{ticket.message}</p>
                <p className="text-xs text-gray-500 mt-2">Status: {ticket.status}</p>
                <div className="mt-3 flex space-x-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Resolve</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportTickets;
