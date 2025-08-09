// File: UnreadNotificationBadge.js
// Path: frontend/src/components/common/UnreadNotificationBadge.js

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const UnreadNotificationBadge = () => {
  const [count, setCount] = useState(0);
  const socket = io(process.env.REACT_APP_SOCKET_URL || '/');

  useEffect(() => {
    fetchUnreadCount();

    socket.on('connect', () => {
      const userId = localStorage.getItem('userId');
      if (userId) socket.emit('join', userId);
    });

    socket.on('notification:new', () => {
      setCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const unread = res.data.filter(n => !n.read).length;
      setCount(unread);
    } catch (err) {
      console.error('Failed to load unread count');
    }
  };

  if (count === 0) return null;

  return (
    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
      {count}
    </span>
  );
};

export default UnreadNotificationBadge;
