import React, { useState, useEffect } from "react";
import { useNavigate, Link, NavLink } from "react-router-dom";

import {
  Heart, Bell, MessageCircle, User,
  Search, Menu, X, LogOut, Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadNotifications } = useSocket();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* LOGO */}
        <div className="navbar-logo" onClick={() => navigate("/dashboard")}>
          <div className="logo-icon">
            <Heart size={24} fill="#6B3F69" color="#6B3F69" />
          </div>
          <span>PhirseShaadi</span>
        </div>

        {/* DESKTOP NAV */}
        <div className="navbar-links">
          <NavLink to="/search" className="nav-link">Search</NavLink>
          <NavLink to="/profile-viewers" className="nav-link">Viewers</NavLink>
          <NavLink to="/chat" className="nav-link">Messages</NavLink>
        </div>


        {/* ACTIONS */}
        <div className="navbar-actions">
          {/* Notifications */}
          <button 
            className="action-btn circle-btn" 
            onClick={() => navigate("/notifications")}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>

          {/* User Profile */}
          <div className="user-profile-wrap">
            <button 
              className="user-profile-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <div className="user-avatar">
                {user?.photos?.[0]?.url ? (
                  <img src={user.photos[0].url} alt="Profile" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <span className="user-name-text">{user?.name?.split(" ")[0]}</span>
            </button>

            {showUserDropdown && (
              <div className="user-dropdown">
                <button onClick={() => { navigate("/my-profile"); setShowUserDropdown(false); }}>
                  <User size={16} /> My Profile
                </button>
                <button onClick={() => { navigate("/privacy"); setShowUserDropdown(false); }}>
                  <Settings size={16} /> Privacy Settings
                </button>
                <div className="dropdown-divider" />
                <button className="logout-btn" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/search" onClick={() => setShowMobileMenu(false)}>Search</Link>
          <Link to="/profile-viewers" onClick={() => setShowMobileMenu(false)}>Viewers</Link>
          <Link to="/chat" onClick={() => setShowMobileMenu(false)}>Messages</Link>
          <Link to="/notifications" onClick={() => setShowMobileMenu(false)}>Notifications</Link>
          <div className="mobile-divider" />
          <button className="mobile-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
