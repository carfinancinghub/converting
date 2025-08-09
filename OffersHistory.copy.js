import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const getStyles = (theme) => ({
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  loadingSpinner: {
    textAlign: 'center',
    fontSize: '18px',
    margin: '20px 0',
  },
});

const OffersHistory = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role') || 'Guest';
  const userId = localStorage.getItem('userId') || 'user123';
  const theme = 'light';

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`http://localhost:5000/api/offers/seller/${userId}`);
        setOffers(response.data);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError('Failed to load offers.');
      } finally {
        setLoading(false);
      }
    };

    if (role === 'Seller') {
      fetchOffers();
    }
  }, [role, userId]);

  if (role !== 'Seller') {
    return null;
  }

  const styles = getStyles(theme);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Offers History</h1>
        <p>View offers made on your cars.</p>
      </div>
      {loading ? (
        <div style={styles.loadingSpinner}>Loading...</div>
      ) : (
        <ul style={styles.list}>
          {offers.map(offer => (
            <li key={offer._id} style={styles.listItem}>
              Car ID: {offer.carId} - Buyer: {offer.buyer} - Amount: ${offer.amount} - Status: {offer.status}
            </li>
          ))}
        </ul>
      )}
      {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
    </div>
  );
};

export default OffersHistory;