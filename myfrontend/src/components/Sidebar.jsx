import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart, Home, UserPlus, LogIn, User, Search,
  ChevronLeft, ChevronRight, MessageSquare, Bell, Settings
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { unreadNotifications } = useSocket();
  
  // Get token from localStorage to check if user is logged in
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // PUBLIC PAGES (Before Login)
  const publicPages = [
    { label: "Home", path: "/", icon: <Home size={19} /> },
    { label: "Register", path: "/register", icon: <UserPlus size={19} /> },
    { label: "Login", path: "/login", icon: <LogIn size={19} /> },
  ];

  // PRIVATE PAGES (After Login)
  const privatePages = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={19} /> },
    { label: "Search", path: "/search", icon: <Search size={19} /> },
    { label: "Chat", path: "/chat", icon: <MessageSquare size={19} /> },
    { 
      label: "Notifications", 
      path: "/notifications", 
      icon: (
        <div style={{ position: 'relative' }}>
          <Bell size={19} />
          {unreadNotifications > 0 && (
            <span className="sidebar-badge">{unreadNotifications}</span>
          )}
        </div>
      ) 
    },
    { label: "Settings", path: "/privacy", icon: <Settings size={19} /> },
    { label: "My Profile", path: "/my-profile", icon: <User size={19} /> },
  ];

  // Select pages based on login status
  const pages = isLoggedIn ? privatePages : publicPages;

  return (
    <>
      {/* TOGGLE BUTTON */}
      <button
        className="sidebar-toggle-btn"
        onClick={() => setOpen(!open)}
        title="Toggle Navigation"
      >
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* OVERLAY */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <div className={`app-sidebar ${open ? "open" : ""}`}>

        {/* LOGO */}
        <div className="app-sidebar-logo" onClick={() => { navigate(isLoggedIn ? "/dashboard" : "/"); setOpen(false); }}>
          <Heart size={20} fill="#6B3F69" color="#6B3F69" />
          <span>PhirseShaadi</span>
        </div>

        {/* LABEL */}
        <div className="app-sidebar-label">
          {isLoggedIn ? "NAVIGATION" : "PAGES"}
        </div>

        {/* NAV LINKS */}
        <nav className="app-sidebar-nav">
          {pages.map((p, i) => (
            <button
              key={i}
              className={`app-sidebar-item ${location.pathname === p.path ? "active" : ""}`}
              onClick={() => { navigate(p.path); setOpen(false); }}
            >
              <span className="app-sidebar-icon">{p.icon}</span>
              <span className="app-sidebar-text">{p.label}</span>
            </button>
          ))}
        </nav>

        {/* CLOSE BUTTON */}
        <button className="app-sidebar-close" onClick={() => setOpen(false)}>
          <ChevronLeft size={16} />
          <span>Close</span>
        </button>

      </div>
    </>
  );
};

export default Sidebar;