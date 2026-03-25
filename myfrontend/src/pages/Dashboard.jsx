import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Edit, ChevronRight, Zap, MapPin,
  Briefcase, CheckCircle, Star, Bell, User,
  MessageCircle, Search, LogOut
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── FETCH USER DATA ──
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // TODO [BACKEND]: GET /api/profile/me
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.profile);
      } catch (err) {
        console.error("Failed to load profile");
        // DUMMY DATA for testing
        setUserData({
          _id: "user123",
          fullName: "Priya Sharma",
          age: 26,
          city: "Mumbai",
          state: "Maharashtra",
          religion: "Hindu",
          community: "Brahmin",
          education: "M.Tech",
          occupation: "Software Engineer",
          income: "₹10L - ₹15L",
          height: "5'4\"",
          about: "Software engineer who loves travel and reading.",
          isVerified: true,
          isPremium: true,
          online: true,
          photos: [{ url: "https://via.placeholder.com/400x500?text=Profile+Photo", isPrimary: true }],
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Logout failed");
    }
    localStorage.removeItem("token");
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-error">
        <h2>Unable to load profile</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* ── MAIN CONTENT ── */}
      <div className="dashboard-main">

        {/* TOP HEADER */}
        <div className="dashboard-header">
          <h1>Welcome back, {userData.fullName}! 👋</h1>
          <div className="dashboard-header-actions">
            <button className="dashboard-action-btn" onClick={() => navigate("/search")}>
              <Search size={18} />
            </button>
            <button className="dashboard-action-btn" onClick={() => navigate("/my-profile")}>
              <User size={18} />
            </button>
            <button className="dashboard-action-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="dashboard-content">

          {/* PROFILE CARD */}
          <div className="dashboard-profile-card">
            {/* PHOTO */}
            <div className="dashboard-photo-section">
              {userData.photos && userData.photos.length > 0 ? (
                <img src={userData.photos[0].url} alt={userData.fullName} className="dashboard-photo" />
              ) : (
                <div className="dashboard-photo-placeholder">
                  <User size={80} color="#A376A2" />
                </div>
              )}

              {/* BADGES */}
              <div className="dashboard-badges">
                {userData.isVerified && (
                  <span className="badge badge-verified">
                    <CheckCircle size={14} /> Verified
                  </span>
                )}
                {userData.isPremium && (
                  <span className="badge badge-premium">
                    <Star size={14} /> Premium
                  </span>
                )}
                {userData.online && (
                  <span className="badge badge-online">Online</span>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="dashboard-profile-info">
              <div className="dashboard-name-row">
                <h2>{userData.fullName}</h2>
                {userData.age && <span className="dashboard-age">{userData.age} yrs</span>}
              </div>

              {userData.city && (
                <div className="dashboard-meta">
                  <MapPin size={16} />
                  <span>{userData.city}, {userData.state}</span>
                </div>
              )}

              {userData.occupation && (
                <div className="dashboard-meta">
                  <Briefcase size={16} />
                  <span>{userData.occupation}</span>
                </div>
              )}

              {userData.height && (
                <div className="dashboard-meta">
                  <Heart size={16} />
                  <span>{userData.height} • {userData.religion}</span>
                </div>
              )}

              {userData.about && (
                <p className="dashboard-about">{userData.about}</p>
              )}

              <div className="dashboard-action-buttons">
                <button
                  className="dashboard-btn dashboard-btn-edit"
                  onClick={() => navigate("/edit-profile")}
                >
                  <Edit size={16} /> Edit Profile
                </button>
                <button
                  className="dashboard-btn dashboard-btn-browse"
                  onClick={() => navigate("/search")}
                >
                  <Search size={16} /> Browse Profiles
                </button>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="dashboard-stats">
            <div className="stat-card" onClick={() => navigate("/search")}>
              <div className="stat-icon interests">
                <Heart size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Interests Sent</p>
                <h3 className="stat-value">12</h3>
              </div>
              <ChevronRight size={20} />
            </div>

            <div className="stat-card">
              <div className="stat-icon matches">
                <Heart size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Matches</p>
                <h3 className="stat-value">8</h3>
              </div>
              <ChevronRight size={20} />
            </div>

            <div className="stat-card">
              <div className="stat-icon messages">
                <MessageCircle size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Messages</p>
                <h3 className="stat-value">3</h3>
              </div>
              <ChevronRight size={20} />
            </div>

            <div className="stat-card">
              <div className="stat-icon visitors">
                <User size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Visitors</p>
                <h3 className="stat-value">24</h3>
              </div>
              <ChevronRight size={20} />
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="dashboard-quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button
                className="quick-action-card"
                onClick={() => navigate("/upload-photos")}
              >
                <div className="action-icon">
                  <Zap size={24} />
                </div>
                <h4>Upload Photos</h4>
                <p>Add more photos to your profile</p>
              </button>

              <button
                className="quick-action-card"
                onClick={() => navigate("/search")}
              >
                <div className="action-icon">
                  <Search size={24} />
                </div>
                <h4>Find Matches</h4>
                <p>Browse and filter profiles</p>
              </button>

              <button
                className="quick-action-card"
                onClick={() => navigate("/my-profile")}
              >
                <div className="action-icon">
                  <User size={24} />
                </div>
                <h4>View Profile</h4>
                <p>See how others see you</p>
              </button>

              {!userData.isPremium && (
                <button className="quick-action-card">
                  <div className="action-icon premium">
                    <Star size={24} />
                  </div>
                  <h4>Go Premium</h4>
                  <p>Unlock premium features</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;