import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Edit, ChevronRight, Zap, MapPin,
  Briefcase, CheckCircle, Star, MessageCircle, 
  Search, User, Bell
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, matchRes] = await Promise.all([
          api.get("/profile/me"),
          api.get("/matches/recommended") // or just /search if special endpoint not available
        ]);
        setUserData(profileRes.data.profile);
        setRecommendations(matchRes.data.data?.slice(0, 4) || []);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to sync your dashboard.");
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, navigate, logout]);

  if (loading) return <div className="loading-screen">Loading your luxury experience...</div>;

  if (error || !userData) {
    return (
      <div className="dashboard-error">
        <h2>{error || "Profile Load Error"}</h2>
        <p>Ensure the backend is running and the database is seeded.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-premium">
      <Navbar />
      
      <main className="dashboard-container">
        {/* HERO SECTION */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <span className="welcome-tag">Welcome Back</span>
            <h1>Discover your perfect match, {userData.name?.split(" ")[0]}</h1>
            <p>Your journey to a beautiful beginning continues here.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => navigate("/search")}>
                <Search size={18} /> Find Matches
              </button>
              <button className="secondary-btn" onClick={() => navigate("/edit-profile")}>
                Complete Profile
              </button>
            </div>
          </div>
          <div className="hero-image-wrap">
            <div className="abstract-shape" />
            {userData.photos?.[0]?.url ? (
              <img src={userData.photos[0].url} alt="You" />
            ) : (
              <div className="profile-image-placeholder"><User size={40} /></div>
            )}
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="stats-grid-minimal">
          <div className="mini-stat-card" onClick={() => navigate("/notifications")}>
            <div className="mini-icon blue"><Bell size={20} /></div>
            <div className="mini-data">
              <span className="mini-label">Recent Alerts</span>
              <span className="mini-value">5 New</span>
            </div>
          </div>
          <div className="mini-stat-card" onClick={() => navigate("/chat")}>
            <div className="mini-icon purple"><MessageCircle size={20} /></div>
            <div className="mini-data">
              <span className="mini-label">Messages</span>
              <span className="mini-value">3 Active</span>
            </div>
          </div>
          <div className="mini-stat-card" onClick={() => navigate("/profile-viewers")}>
            <div className="mini-icon amber"><User size={20} /></div>
            <div className="mini-data">
              <span className="mini-label">Profile Views</span>
              <span className="mini-value">24 Today</span>
            </div>
          </div>
          <div className="mini-stat-card" onClick={() => navigate("/search")}>
            <div className="mini-icon heart"><Heart size={20} /></div>
            <div className="mini-data">
              <span className="mini-label">New Matches</span>
              <span className="mini-value">128 Total</span>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="dashboard-recommendations">
          <div className="section-header">
            <h2>Recommended for You</h2>
            <button className="text-link" onClick={() => navigate("/search")}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="matches-grid-compact">
            {recommendations.length > 0 ? (
              recommendations.map(profile => (
                <ProfileCard key={profile._id} profile={profile} />
              ))
            ) : (
              <div className="empty-recommendations">
                <Search size={40} />
                <p>Finding new matches for you...</p>
              </div>
            )}
          </div>
        </section>

        {/* ACCOUNT STATUS / UPGRADE */}
        {!userData.isPremium && (
          <section className="premium-banner-minimal">
            <div className="banner-icon"><Star size={32} fill="#FFD700" color="#FFD700" /></div>
            <div className="banner-text">
              <h3>Unlock Premium Connections</h3>
              <p>Get unlimited messages, see who visited your profile, and more.</p>
            </div>
            <button className="upgrade-btn">Explore Plans</button>
          </section>
        )}
      </main>
    </div>
  );
};


export default Dashboard;