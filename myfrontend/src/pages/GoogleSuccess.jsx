import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import api from '../utils/api';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { isLoaded: clerkLoaded, isSignedIn, getToken } = useClerkAuth();
  const { isLoaded: userLoaded } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    const fetchAndLogin = async (tokenValue) => {
      try {
        // Simple hack to set token for the immediate API call 
        // (the interceptor will pick it up from localStorage if we save it first)
        localStorage.setItem('token', tokenValue);
        
        const res = await api.get('/profile/me');
        login(tokenValue, res.data.profile);
        navigate('/dashboard');
      } catch (err) {
        console.error("Google login fetch error:", err);
        navigate('/login');
      }
    };

    const bridgeClerkLogin = async () => {
      try {
        const clerkToken = await getToken();
        if (!clerkToken) {
          navigate('/login');
          return;
        }

        const res = await api.post(
          '/auth/clerk-login',
          {},
          { headers: { Authorization: `Bearer ${clerkToken}` } }
        );

        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);
          if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
          login(res.data.token, res.data.user);
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Clerk bridge login error:', err);
        navigate('/login');
      }
    };

    if (token) {
      fetchAndLogin(token);
      return;
    }

    if (!clerkLoaded || !userLoaded) {
      return;
    }

    if (isSignedIn) {
      bridgeClerkLogin();
    } else {
      navigate('/login');
    }
  }, [location, navigate, login, clerkLoaded, userLoaded, isSignedIn, getToken]);

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
