import React, { useEffect, useState } from 'react';
import { getProfileViewers } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ProfileViewers.css';

const ProfileViewers = () => {
  const { isPremium } = useAuth();
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isPremium) {
      fetchViewers();
    } else {
      setLoading(false);
    }
  }, [isPremium]);

  const fetchViewers = async () => {
    try {
      const res = await getProfileViewers();
      if (res.data.success) {
        setViewers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch viewers');
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <div className="profile-viewers-page promo">
        <div className="promo-card">
          <i className="premium-icon">⭐</i>
          <h2>Premium Feature</h2>
          <p>Upgrade to PhirseShaadi Premium to see who viewed your profile and get 10x more responses!</p>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-viewers-page">
      <div className="viewers-container">
        <div className="viewers-header">
          <h2>Profile Viewers</h2>
          <p>See who's interested in you</p>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="viewers-list">
            {viewers.length > 0 ? (
              viewers.map((v, i) => (
                <div key={i} className="viewer-item">
                  <div className="viewer-pic">
                    <img src={v.userId?.photos?.[0]?.url || 'https://via.placeholder.com/60'} alt={v.userId?.name} />
                  </div>
                  <div className="viewer-info">
                    <h4>{v.userId?.name}</h4>
                    <p>{v.userId?.city || 'Location Hidden'}</p>
                    <span className="view-time">Viewed {new Date(v.viewedAt).toLocaleString()}</span>
                  </div>
                  <button className="view-profile-btn">View Profile</button>
                </div>
              ))
            ) : (
              <div className="no-viewers">
                <p>No one has viewed your profile yet. Keep exploring!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewers;
