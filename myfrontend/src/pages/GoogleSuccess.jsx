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
        
        // Try to fetch profile
        const res = await api.get('/profile/me');
        
        if (res.data.profile) {
          // Existing user with profile — go to dashboard
          login(tokenValue, res.data.profile);
          navigate('/dashboard');
        } else {
          // User exists but no profile data — go to profile creation
          login(tokenValue, { name: 'User' });
          navigate('/profile-creation');
        }
      } catch (err) {
        console.error("Google login fetch error:", err);
        
        if (err.response?.status === 404) {
          // Profile not found — new Google user, needs to create profile
          // Still save the token so they're authenticated
          login(tokenValue, { name: 'Google User' });
          navigate('/profile-creation');
        } else {
          // Actual error — but still try to proceed with just the token
          // Don't send back to login, that creates a loop
          console.warn("Profile fetch failed, proceeding with token only");
          login(tokenValue, { name: 'User' });
          navigate('/dashboard');
        }
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
