import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const { user, token, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const defaultSocketUrl = import.meta.env.PROD
    ? 'https://phirseshaadi.onrender.com'
    : 'http://localhost:5000';
  const socketUrl = import.meta.env.VITE_SOCKET_URL || defaultSocketUrl;

  useEffect(() => {
    if (isLoggedIn && user && token) {
      // Connect to socket WITH authentication token
      const newSocket = io(socketUrl, {
        auth: { token }
      });
      socketRef.current = newSocket;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(newSocket);

      // Join room (server uses authenticated userId, this is just a signal)
      newSocket.emit('join');

      // Listen for basic events
      newSocket.on('notification:new', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadNotifications((prev) => prev + 1);
        
        // Show browser notification or alert if possible
        if (Notification.permission === "granted") {
          new Notification(notification.message);
        }
      });

      // Handle auth errors from server
      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });

      return () => {
        newSocket.close();
        socketRef.current = null;
      };
    } else {
      // Cleanup when logged out — use ref to avoid stale closure
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
    }
  }, [isLoggedIn, user, token, socketUrl]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, unreadNotifications, setUnreadNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};


