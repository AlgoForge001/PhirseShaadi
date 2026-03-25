import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart, Home, UserPlus, LogIn, Shield,
  User, Search, Eye, MessageCircle,
  Bell, Star, ChevronLeft, ChevronRight, Image
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const pages = [
    { label: "Landing Page", path: "/", icon: <Home size={19} /> },
    { label: "Register", path: "/register", icon: <UserPlus size={19} /> },
    { label: "Login", path: "/login", icon: <LogIn size={19} /> },
    { label: "OTP Verify", path: "/otp-verify", icon: <Shield size={19} /> },
    { label: "Profile Creation", path: "/profile-creation", icon: <User size={19} /> },
    { label: "Search & Browse", path: "/search", icon: <Search size={19} /> },
    { label: "Profile View", path: "/profile/1", icon: <Eye size={19} /> },
    { label: "Chat", path: "/chat", icon: <MessageCircle size={19} /> },
    { label: "My Profile", path: "/my-profile", icon: <User size={19} /> },
    { label: "Notifications", path: "/notifications", icon: <Bell size={19} /> },
    { label: "Premium", path: "/premium", icon: <Star size={19} /> },
    { label: "Upload Photos", path: "/upload-photos", icon: <Image size={19} /> },
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
        <div className="app-sidebar-logo" onClick={() => { navigate("/"); setOpen(false); }}>
          <Heart size={20} fill="#6B3F69" color="#6B3F69" />
          <span>PhirseShaadi</span>
        </div>

        {/* LABEL */}
        <div className="app-sidebar-label">PAGES</div>

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