import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ prevent flickers and loops

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Auth check failed:', err.message);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); // ✅ done loading
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);

    // ✅ Now fetch consistent user info from /me
    const me = await axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${res.data.token}` },
    });

    setUser(me.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return null; // or a <LoadingSpinner />

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
