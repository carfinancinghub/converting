// File: AssignJudgesForm.js
// Path: frontend/src/components/AssignJudgesForm.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const AssignJudgesForm = ({ disputeId }) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/arbitrators', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setMessage('❌ Failed to fetch arbitrators');
      }
    };
    fetchUsers();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((uid) => uid !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleAssign = async () => {
    if (selected.length !== 3) {
      return setMessage('⚠️ Please select exactly 3 judges');
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/disputes/${disputeId}/assign-judges`, {
        judgeIds: selected,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Judges assigned');
    } catch (err) {
      setMessage('❌ Failed to assign judges');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">🧑‍⚖️ Assign Judges to Dispute</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}

        <div className="mb-4">
          <h4 className="font-semibold mb-1">Selected Judges:</h4>
          {selected.length === 0 ? (
            <p className="text-sm text-gray-600">None selected yet.</p>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {selected.map((id) => {
                const user = users.find((u) => u._id === id);
                return <li key={id}>✅ {user?.email || id}</li>;
              })}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-semibold mb-2">Available Arbitrators:</h4>
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(user._id)}
                  disabled={!selected.includes(user._id) && selected.length >= 3}
                  onChange={() => toggleSelect(user._id)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{user.email}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAssign}
          disabled={selected.length !== 3}
          className={`px-4 py-2 rounded text-white font-semibold ${
            selected.length === 3 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          📬 Assign Judges
        </button>
      </div>
    </div>
  );
};

export default AssignJudgesForm;
