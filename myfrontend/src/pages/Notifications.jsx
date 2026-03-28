import React, { useEffect, useState } from 'react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../utils/api';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setLocalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { setUnreadNotifications } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.data.success) {
        setLocalNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
        setUnreadNotifications(res.data.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        setUnreadCount(prev => prev - 1);
        setUnreadNotifications(prev => prev - 1);
        setLocalNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
      } catch (err) {
        console.error(err);
      }
    }
    if (n.link) navigate(n.link);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'interest_received': return '❤️';
      case 'interest_accepted': return '✅';
      case 'new_message': return '💬';
      case 'profile_viewed': return '👁️';
      case 'payment_success': return '💰';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>Notifications {unreadCount > 0 && <span className="unread-dot">{unreadCount}</span>}</h2>
          {unreadCount > 0 && (
            <button className="mark-read-btn" onClick={handleMarkAllRead}>Mark all as read</button>
          )}
        </div>
        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n._id} 
                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="notification-icon">{getIcon(n.type)}</div>
                <div className="notification-content">
                  <p className="notification-msg">{n.message}</p>
                  <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                {!n.isRead && <div className="unread-indicator"></div>}
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
