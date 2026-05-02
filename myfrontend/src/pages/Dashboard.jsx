import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Edit, ChevronRight, Zap, MapPin,
  Briefcase, CheckCircle, Star, MessageCircle,
  Search, User, Bell, Sparkles, TrendingUp, Eye
} from "lucide-react";
import api from "../utils/api";
import { normalizeImageUrl } from "../utils/imageUtils";

import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import "./Dashboard.css";

const StatCard = ({ icon: Icon, iconClass, label, value, isLoading, onClick }) => (
  <div className="mini-stat-card" onClick={onClick}>
    <div className={`mini-icon ${iconClass}`}>
      <Icon size={20} />
    </div>
    <div className="mini-data">
      <span className="mini-label">{label}</span>
      {isLoading ? (
        <span className="mini-value skeleton-value" />
      ) : (
        <span className="mini-value">{value}</span>
      )}
    </div>
    <div className="stat-arrow">
      <ChevronRight size={14} />
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [smartMatches, setSmartMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  // Dynamic stats state
  const [stats, setStats] = useState({
    notifications: null,
    messages: null,
    profileViews: null,
    matches: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, matchRes, smartMatchRes] = await Promise.all([
          api.get("/profile/me"),
          api.get("/matches/recommended").catch(() => ({ data: { data: [] } })),
          api.get("/matches/smart-match").catch(() => ({ data: { data: [] } }))
        ]);

        if (profileRes.data.profile) {
          setUserData(profileRes.data.profile);
          const matchData = matchRes.data.data || [];
          setRecommendations(matchData.slice(0, 4));

          // Set matches count from recommended data
          setStats(prev => ({
            ...prev,
            matches: matchData.length,
          }));

          setSmartMatches(smartMatchRes.data.data || []);
        } else {
          navigate("/profile-creation");
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        if (err.response?.status === 404) {
          navigate("/profile-creation");
        } else if (err.response?.status === 401) {
          setError("Session expired. Please re-login.");
        } else {
          setError(`Failed to load dashboard: ${err.message || "Unknown error"}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch dynamic stats separately so cards animate in
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);

        const [viewersRes, notifRes, chatRes] = await Promise.all([
          api.get("/profile/viewers").catch(() => ({ data: { data: [] } })),
          api.get("/notifications").catch(() => ({ data: { data: [] } })),
          api.get("/chat/conversations").catch(() => ({ data: { data: [] } })),
        ]);

        const viewers = viewersRes.data.data || [];
        const notifications = notifRes.data.data || [];
        const chats = chatRes.data.data || [];

        // Profile views: count unique viewers in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentViews = viewers.filter(v =>
          v.viewedAt && new Date(v.viewedAt) >= thirtyDaysAgo
        );

        // Unread notifications
        const unreadNotifs = notifications.filter(n => !n.isRead);

        // Active chats (with unread messages)
        const activeChats = chats.filter(c => c.unreadCount > 0);

        setStats(prev => ({
          ...prev,
          notifications: unreadNotifs.length,
          messages: activeChats.length,
          profileViews: recentViews.length || viewers.length,
        }));
      } catch (err) {
        console.error("Stats fetch error:", err);
        // Don't show error - just leave as 0
        setStats(prev => ({
          ...prev,
          notifications: prev.notifications ?? 0,
          messages: prev.messages ?? 0,
          profileViews: prev.profileViews ?? 0,
        }));
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatStatValue = (value, suffix = "") => {
    if (value === null || value === undefined) return "—";
    if (value === 0) return `0${suffix}`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k${suffix}`;
    return `${value}${suffix}`;
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-pulse" />
      Loading your experience...
    </div>
  );

  if (error || !userData) {
    return (
      <div className="dashboard-error">
        <h2>{error || "Profile Load Error"}</h2>
        <p>Ensure the backend is running and the database is seeded.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const statCards = [
    {
      icon: Bell,
      iconClass: "blue",
      label: "Alerts",
      value: stats.notifications !== null
        ? (stats.notifications === 0 ? "All read" : `${stats.notifications} New`)
        : "—",
      isLoading: statsLoading,
      onClick: () => navigate("/notifications"),
    },
    {
      icon: MessageCircle,
      iconClass: "purple",
      label: "Messages",
      value: stats.messages !== null
        ? (stats.messages === 0 ? "No unread" : `${stats.messages} Active`)
        : "—",
      isLoading: statsLoading,
      onClick: () => navigate("/chat"),
    },
    {
      icon: Eye,
      iconClass: "amber",
      label: "Profile Views",
      value: stats.profileViews !== null
        ? formatStatValue(stats.profileViews, " Views")
        : "—",
      isLoading: statsLoading,
      onClick: () => navigate("/profile-viewers"),
    },
    {
      icon: Heart,
      iconClass: "heart",
      label: "Matches",
      value: stats.matches !== null
        ? formatStatValue(stats.matches, " Found")
        : "—",
      isLoading: false,
      onClick: () => navigate("/search"),
    },
  ];

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
            {(() => {
              const photo = userData.photos?.find(p => p.isPrimary) || userData.photos?.[0];
              const normalizedUrl = normalizeImageUrl(photo?.url);
              
              if (!normalizedUrl || imgFailed) {
                return (
                  <div className="profile-image-placeholder">
                    <User size={40} />
                  </div>
                );
              }

              return (
                <img 
                  src={normalizedUrl} 
                  alt={userData.name} 
                  onError={() => setImgFailed(true)}
                />
              );
            })()}
          </div>
        </section>

        {/* DYNAMIC QUICK STATS */}
        <section className="stats-grid-minimal">
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </section>

        {/* SMART AI MATCHES */}
        {smartMatches.length > 0 && (
          <section className="dashboard-smart-matches">
            <div className="section-header">
              <div className="section-title-wrap">
                <Sparkles size={24} color="#FFD700" fill="#FFD700" />
                <h2>AI Deep Compatibility</h2>
              </div>
              <span className="premium-tag">USP Exclusive</span>
            </div>
            <p className="section-subtitle">
              Our AI has analyzed your bio and preferences to find these high-potential connections.
            </p>
            <div className="matches-grid-premium">
              {smartMatches.map(profile => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>
          </section>
        )}

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

        {/* PREMIUM BANNER */}
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

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-content">
          <div className="footer-column footer-brand-col">
            <div className="footer-brand">
              <Heart size={16} />
              <h4>MarriageSphere</h4>
            </div>
            <p>Making matrimony accessible and authentic for everyone. Your trusted partner in finding love.</p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Tips</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Report Abuse</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MarriageSphere. All rights reserved.</p>
          <p className="footer-tagline">Made with ❤️ for meaningful connections</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
