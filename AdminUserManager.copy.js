// File: AdminUserManager.js
// Path: frontend/src/components/AdminUserManager.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AdminUserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to load users', err);
        setError('❌ Unable to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>

        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-500">No users found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="p-2 border">{user.email}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border">{user.verified ? '✅ Verified' : '⏳ Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManager;
