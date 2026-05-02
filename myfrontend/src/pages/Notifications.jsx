import React, { useEffect, useState } from 'react';
import { 
  Heart, CheckCircle, MessageSquare, Eye, 
  CreditCard, Bell, Check, Trash2, Clock 
} from 'lucide-react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setLocalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { setUnreadNotifications } = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.data.success) {
        setLocalNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
        setUnreadNotifications(res.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsRead();
      if (res.data.success) {
        setLocalNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        setUnreadNotifications(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      try {
        await markNotificationRead(n._id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setUnreadNotifications(prev => Math.max(0, prev - 1));
        setLocalNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
      } catch (err) {
        console.error(err);
      }
    }
    if (n.link) navigate(n.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'interest_received': return <Heart size={20} fill="#f43f5e" color="#f43f5e" />;
      case 'interest_accepted': return <CheckCircle size={20} color="#10b981" />;
      case 'new_message': return <MessageSquare size={20} color="#8b5cf6" />;
      case 'profile_viewed': return <Eye size={20} color="#f59e0b" />;
      case 'payment_success': return <CreditCard size={20} color="#c9952a" />;
      default: return <Bell size={20} color="#6b3f69" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="nt-page">
      <Navbar />
      
      <main className="nt-container">
        <div className="nt-card">
          <div className="nt-header">
            <div className="nt-title-wrap">
              <h2>Alerts & Notifications</h2>
              {unreadCount > 0 && <span className="nt-badge">{unreadCount} New</span>}
            </div>
            {unreadCount > 0 && (
              <button className="nt-action-link" onClick={handleMarkAllRead}>
                <Check size={16} /> Mark all as read
              </button>
            )}
          </div>

          <div className="nt-list">
            {loading ? (
              <div className="nt-loading">
                <div className="nt-spinner" />
                <p>Fetching your updates...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`nt-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div className={`nt-icon-wrap ${n.type}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="nt-content">
                    <p className="nt-msg">{n.message}</p>
                    <div className="nt-meta">
                      <Clock size={12} />
                      <span>{formatTime(n.createdAt)}</span>
                    </div>
                  </div>
                  {!n.isRead && <div className="nt-unread-dot"></div>}
                </div>
              ))
            ) : (
              <div className="nt-empty">
                <div className="empty-icon-circle">
                  <Bell size={32} />
                </div>
                <h3>All Caught Up!</h3>
                <p>No new notifications at the moment. We'll alert you when something important happens.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Notifications;
