import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart, Home, User, Search, Users,
  ChevronLeft, ChevronRight, MessageSquare, Bell, Settings
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { unreadNotifications } = useSocket();

  const pages = [
    { label: "Dashboard", path: "/dashboard", icon: <Home size={19} /> },
    { label: "Search", path: "/search", icon: <Search size={19} /> },
    { label: "Chat", path: "/chat", icon: <MessageSquare size={19} /> },
    {
      label: "Notifications",
      path: "/notifications",
      icon: (
        <div style={{ position: "relative" }}>
          <Bell size={19} />
          {unreadNotifications > 0 && (
            <span className="sidebar-badge">{unreadNotifications}</span>
          )}
        </div>
      )
    },
    { label: "Settings", path: "/privacy", icon: <Settings size={19} /> },
    { label: "My Profile", path: "/my-profile", icon: <User size={19} /> },
    { label: "Family Members", path: "/family-members", icon: <Users size={19} /> },
    { label: "Family Shortlist", path: "/family-shortlist", icon: <Heart size={19} /> }
  ];

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
        <div className="app-sidebar-logo" onClick={() => { navigate("/dashboard"); setOpen(false); }}>
          <Heart size={20} fill="#6B3F69" color="#6B3F69" />
          <span>PhirseShaadi</span>
        </div>

        {/* LABEL */}
        <div className="app-sidebar-label">NAVIGATION</div>

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