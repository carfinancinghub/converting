import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BuyerLoanApplications = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem('role') || 'Guest';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/loans/buyer/${role}1`);
        setLoans(response.data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };

    if (role === 'Buyer') {
      fetchLoans();
    } else {
      if (role.toLowerCase().startsWith('seller')) {
        navigate('/dashboard');
      } else if (role.toLowerCase().startsWith('banker')) {
        navigate('/banker/loan-history');
      } else {
        navigate('/');
      }
    }
  }, [role, navigate]);

  if (role !== 'Buyer') {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Buyer Loan Applications</h1>
        <p>Welcome, {role}!</p>
        <p>View your loan applications.</p>
      </div>
      {loading ? (
        <div style={styles.loadingSpinner}>Loading...</div>
      ) : (
        <ul style={styles.list}>
          {loans.map(loan => (
            <li key={loan._id} style={styles.listItem}>
              Car ID: {loan.carId} - Amount: ${loan.amount} - Status: {loan.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Arial', sans-serif",
    padding: '20px 20px 20px 40px',
    boxSizing: 'border-box',
    transition: 'background-color 0.3s, color 0.3s',
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gap: '15px',
  },
  listItem: {
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s, color 0.3s',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.2em',
    marginTop: '50px',
    marginLeft: '250px',
    transition: 'color 0.3s',
  },
  loadingSpinner: {
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#007bff',
    margin: '20px 0',
  },
};

const lightStyles = {
  container: { ...styles.container, backgroundColor: '#f4f7fa', color: '#333' },
  listItem: { ...styles.listItem, backgroundColor: 'white', color: '#333' },
  message: { ...styles.message, color: '#333' },
  header: styles.header,
  list: styles.list,
  loadingSpinner: styles.loadingSpinner,
};

const darkStyles = {
  container: { ...styles.container, backgroundColor: '#2c2c2c', color: '#e0e0e0' },
  listItem: { ...styles.listItem, backgroundColor: '#3a3a3a', color: '#e0e0e0' },
  message: { ...styles.message, color: '#e0e0e0' },
  header: styles.header,
  list: styles.list,
  loadingSpinner: styles.loadingSpinner,
};

export const getStyles = (theme) => (theme === 'light' ? lightStyles : darkStyles);

export default BuyerLoanApplications;