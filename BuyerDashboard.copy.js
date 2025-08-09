import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BuyerDashboard.css';
import Messaging from './Messaging';
import UserReviewList from './UserReviewList';
import LeaveReview from './LeaveReview';

const BuyerDashboard = () => {
  const [userId, setUserId] = useState('');
  const [reviewTargetId, setReviewTargetId] = useState('');
  const [badges, setBadges] = useState([]);
  const [points, setPoints] = useState(0);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const MAX_POINTS = 50;

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    setUserId(storedId);

    if (storedId && token) {
      const fetchUserInfo = async () => {
        setLoadingUser(true);
        try {
          const res = await axios.get(`/api/users/${storedId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setBadges(res.data.badges || []);
          setPoints(res.data.points || 0);
        } catch (err) {
          setError('Failed to load user data.');
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!searchQuery.trim()) {
        setMatchedUsers([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatchedUsers(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to search users:', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMatches();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectUser = (user) => {
    setReviewTargetId(user._id);
    setSearchQuery(user.email);
    setShowDropdown(false);
  };

  const progressPercent = Math.min((points / MAX_POINTS) * 100, 100);

  return (
    <div className="buyer-dashboard">
      <h2 className="text-2xl font-bold mb-4">Buyer Dashboard</h2>

      <div className="section">
        <h3 className="section-title">Messaging</h3>
        <Messaging recipientId={userId} />
      </div>

      <div className="section">
        <h3 className="section-title">My Reviews</h3>
        <UserReviewList userId={userId} />
      </div>

      <div className="section">
        <h3 className="section-title">Leave a Review for Someone</h3>
        <input
          type="text"
          className="border p-2 rounded w-full mb-2"
          placeholder="Search user by email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
        />

        {showDropdown && matchedUsers.length > 0 && (
          <ul className="autocomplete-dropdown">
            {matchedUsers.map((user) => (
              <li
                key={user._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                {user.email} ({user.role})
              </li>
            ))}
          </ul>
        )}

        {reviewTargetId && (
          <div className="mt-4">
            <LeaveReview userId={reviewTargetId} />
          </div>
        )}
      </div>

      <div className="section">
        <h3 className="section-title">My Badges</h3>
        {loadingUser ? (
          <p className="text-gray-600">Loading badges...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <ul className="badge-list">
            {badges.length === 0 ? (
              <p className="text-gray-500">You haven’t earned any badges yet.</p>
            ) : (
              badges.map((badge, index) => (
                <li key={index} className="badge-item">
                  <span className="badge-name">{badge.name}</span>
                  <span className="badge-date">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
	</ul>
        )}
      </div>

      <div className="section">
        <h3 className="section-title">Badge Progress</h3>
        {loadingUser ? (
          <p className="text-gray-600">Loading progress...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <div className="progress-label">
              {points}/{MAX_POINTS} points to earn <strong>“Car Whisperer”</strong>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};