import React, { useState, useEffect } from 'react';
import { updatePrivacySettings, getBlockedUsers, unblockUser } from '../utils/api';
import './PrivacySettings.css';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    showLastSeen: true,
    showOnlineStatus: true,
    showProfileTo: 'everyone',
    photoVisibility: 'everyone',
    incognitoMode: false
  });
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current settings from user profile if possible, 
    // or just rely on the update API to return current state.
    // For now, we'll assume the user object in AuthContext has them or we just update.
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const res = await getBlockedUsers();
      if (res.data.success) {
        setBlockedUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await updatePrivacySettings(settings);
      if (res.data.success) {
        setMessage('Privacy settings updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const res = await unblockUser(userId);
      if (res.data.success) {
        setBlockedUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="privacy-settings-page">
      <div className="privacy-container">
        <h2>Privacy & Security</h2>
        
        <form onSubmit={handleSubmit} className="privacy-form">
          <div className="section">
            <h3>Visibility Settings</h3>
            <div className="form-group row">
              <label>Show Last Seen</label>
              <input type="checkbox" name="showLastSeen" checked={settings.showLastSeen} onChange={handleToggle} />
            </div>
            <div className="form-group row">
              <label>Show Online Status</label>
              <input type="checkbox" name="showOnlineStatus" checked={settings.showOnlineStatus} onChange={handleToggle} />
            </div>
            <div className="form-group row">
              <label>Incognito Mode</label>
              <input type="checkbox" name="incognitoMode" checked={settings.incognitoMode} onChange={handleToggle} />
            </div>
          </div>

          <div className="section">
            <h3>Profile & Photo Visibility</h3>
            <div className="form-group">
              <label>Who can see my profile?</label>
              <select name="showProfileTo" value={settings.showProfileTo} onChange={handleChange}>
                <option value="everyone">Everyone</option>
                <option value="premium">Premium Users Only</option>
                <option value="shortlisted">Shortlisted Users Only</option>
              </select>
            </div>
            <div className="form-group">
              <label>Who can see my photos?</label>
              <select name="photoVisibility" value={settings.photoVisibility} onChange={handleChange}>
                <option value="everyone">Everyone</option>
                <option value="premium">Premium Users Only</option>
                <option value="connections">Accepted Interests Only</option>
              </select>
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {message && <p className="status-message">{message}</p>}
        </form>

        <div className="section blocked-section">
          <h3>Blocked Users</h3>
          <div className="blocked-list">
            {blockedUsers.length > 0 ? (
              blockedUsers.map(u => (
                <div key={u._id} className="blocked-item">
                  <div className="blocked-user-info">
                    <img src={u.photos?.[0]?.url || 'https://via.placeholder.com/40'} alt={u.name} />
                    <span>{u.name}</span>
                  </div>
                  <button onClick={() => handleUnblock(u._id)} className="unblock-btn">Unblock</button>
                </div>
              ))
            ) : (
              <p className="no-blocked">No blocked users.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
