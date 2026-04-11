import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isLoggedIn && user) {
      // Connect to socket
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      // Join room
      newSocket.emit('join', user._id);

      // Listen for basic events
      newSocket.on('notification:new', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadNotifications((prev) => prev + 1);
        
        // Show browser notification or alert if possible
        if (Notification.permission === "granted") {
          new Notification(notification.message);
        }
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isLoggedIn, user, socketUrl]);

  return (
    <SocketContext.Provider value={{ socket, notifications, setNotifications, unreadNotifications, setUnreadNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};
