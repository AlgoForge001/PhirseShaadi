import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const fetchAndLogin = async (tokenValue) => {
      try {
        // Save token so the API interceptor can use it
        localStorage.setItem('token', tokenValue);
        
        const res = await api.get('/profile/me');
        login(tokenValue, res.data.profile);
        navigate('/dashboard');
      } catch (err) {
        console.error("Google login fetch error:", err);
        navigate('/login');
      }
    };

    if (token) {
      fetchAndLogin(token);
    } else {
      // No token in URL, redirect to login
      navigate('/login');
    }
  }, [location, navigate, login]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <div className="spinner" style={{ border: '4px solid rgba(0,0,0,0.1)', borderLeftColor: '#6B3F69', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ marginTop: '20px', color: '#666' }}>Completing login...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GoogleSuccess;
