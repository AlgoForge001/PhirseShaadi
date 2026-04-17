import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, X, Check, Clock, MapPin, Search, Users
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getReceivedInterests, getSentInterests, respondInterest } from '../utils/api';
import './Interests.css';

const Interests = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        getReceivedInterests(),
        getSentInterests()
      ]);
      if (receivedRes.data.success) setReceived(receivedRes.data.data);
      if (sentRes.data.success) setSent(sentRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleRespond = async (interestId, status) => {
    try {
      await respondInterest({ interestId, status });
      // Remove from pending received list correctly based on ID
      if (status === 'accepted') {
        setReceived(prev => prev.map(inv => inv._id === interestId ? { ...inv, status: 'accepted' } : inv));
      } else {
        setReceived(prev => prev.filter(inv => inv._id !== interestId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-screen">Loading interests...</div>;

  return (
    <div className="interests-premium-page">
      <Navbar />
      
      <div className="interests-container">
        <div className="interests-header">
          <h1>Your Interests</h1>
          <div className="interests-tabs">
            <button 
              className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Received <span className="badge">{received.filter(i => i.status === 'pending').length}</span>
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent <span className="badge">{sent.length}</span>
            </button>
          </div>
        </div>

        {activeTab === 'received' && (
          <div className="interests-grid">
            {received.filter(i => i.status === 'pending').length > 0 ? (
              received.filter(i => i.status === 'pending').map(interest => (
                <div key={interest._id} className="interest-card">
                  <div className="ic-header" onClick={() => navigate(`/profile/${interest.from._id}`)}>
                    <img src={interest.from.photos?.[0]?.url || 'https://via.placeholder.com/70'} alt="" className="ic-img" />
                    <div className="ic-info">
                      <h3>{interest.from.fullName || interest.from.name}</h3>
                      <div className="ic-meta">
                        <span>{interest.from.education} • {interest.from.profession || 'Professional'}</span>
                        <span className="ic-location"><MapPin size={12} /> {interest.from.city}, {interest.from.state}</span>
                      </div>
                    </div>
                  </div>
                  {interest.message && (
                    <div className="ic-message">"{interest.message}"</div>
                  )}
                  <div className="ic-actions">
                    <button className="ic-btn accept" onClick={() => handleRespond(interest._id, 'accepted')}>
                      <Check size={18} /> Accept
                    </button>
                    <button className="ic-btn reject" onClick={() => handleRespond(interest._id, 'rejected')}>
                      <X size={18} /> Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Heart size={48} opacity={0.3} />
                <h3>No pending interests</h3>
                <p>When someone expresses interest in your profile, it will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="interests-grid">
            {sent.length > 0 ? (
              sent.map(interest => (
                <div key={interest._id} className="interest-card">
                  <div className="ic-header" onClick={() => navigate(`/profile/${interest.to._id}`)}>
                    <img src={interest.to.photos?.[0]?.url || 'https://via.placeholder.com/70'} alt="" className="ic-img" />
                    <div className="ic-info">
                      <h3>{interest.to.fullName || interest.to.name}</h3>
                      <div className="ic-meta">
                        <span>{interest.to.education} • {interest.to.profession || 'Professional'}</span>
                        <span className="ic-location"><MapPin size={12} /> {interest.to.city}, {interest.to.state}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`ic-status-bar ${interest.status}`}>
                    {interest.status === 'pending' && <><Clock size={16} /> Waiting for response</>}
                    {interest.status === 'accepted' && <><Check size={16} /> Accepted</>}
                    {interest.status === 'rejected' && <><X size={16} /> Declined</>}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Search size={48} opacity={0.3} />
                <h3>You haven't sent any interests yet</h3>
                <p>Explore matches and express interest to start a connection.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Interests;
