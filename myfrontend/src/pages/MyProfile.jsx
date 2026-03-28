import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Edit, CheckCircle, Star, MapPin,
  Briefcase, GraduationCap, Users, Sun,
  Phone, Mail, Camera, ChevronRight, Lock
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/profile/me");
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Profile load failed:", err);
        setError("Failed to sync your profile.");
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [token, navigate, logout]);

  if (loading) return <div className="loading-screen">Preparing your profile...</div>;

  const renderDetail = (label, value) => (
    <div className="profile-detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "—"}</span>
    </div>
  );

  return (
    <div className="my-profile-premium">
      <Navbar />
      
      <main className="mp-container">
        {/* HERO SECTION */}
        <section className="mp-hero">
          <div className="mp-hero-visual">
            <div className="mp-main-photo-wrap">
              {profile.photos?.[activePhoto] ? (
                <img src={profile.photos[activePhoto].url} alt="Profile" className="mp-main-photo" />
              ) : (
                <div className="mp-photo-placeholder"><Users size={60} /></div>
              )}
              <button className="mp-camera-btn" onClick={() => navigate("/upload-photos")}>
                <Camera size={18} />
              </button>
            </div>
            
            {profile.photos?.length > 1 && (
              <div className="mp-thumbnails">
                {profile.photos.map((p, i) => (
                  <div 
                    key={i} 
                    className={`mp-thumb ${activePhoto === i ? "active" : ""}`}
                    onClick={() => setActivePhoto(i)}
                  >
                    <img src={p.url} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mp-hero-info">
            <div className="mp-title-row">
              <h1>{profile.name}</h1>
              <div className="mp-badge-row">
                {profile.isVerified && <span className="verified-pill"><CheckCircle size={14} /> Verified</span>}
                {profile.isPremium && <span className="premium-pill"><Star size={14} fill="currentColor" /> Premium</span>}
              </div>
            </div>
            
            <div className="mp-quick-meta">
              <span>{profile.age} Yrs • {profile.height}</span>
              <span className="dot" />
              <span>{profile.religion}</span>
              <span className="dot" />
              <span>{profile.city}</span>
            </div>

            <p className="mp-biography">{profile.about || "Add a bio to let others know you better."}</p>

            <div className="mp-action-row">
              <button className="mp-btn-primary" onClick={() => navigate("/profile-creation")}>
                <Edit size={16} /> Edit My Profile
              </button>
              <button className="mp-btn-outline" onClick={() => navigate("/privacy")}>
                <Lock size={16} /> Privacy Settings
              </button>
            </div>
          </div>
        </section>

        {/* TABS & DETAILS */}
        <section className="mp-details-section">
          <div className="mp-tabs-nav">
            <button className={activeTab === "basic" ? "active" : ""} onClick={() => setActiveTab("basic")}>General</button>
            <button className={activeTab === "education" ? "active" : ""} onClick={() => setActiveTab("education")}>Career</button>
            <button className={activeTab === "family" ? "active" : ""} onClick={() => setActiveTab("family")}>Family</button>
            <button className={activeTab === "horoscope" ? "active" : ""} onClick={() => setActiveTab("horoscope")}>Faith</button>
          </div>

          <div className="mp-tab-pane">
            {activeTab === "basic" && (
              <div className="details-grid-premium">
                {renderDetail("Marital Status", profile.maritalStatus)}
                {renderDetail("Body Type", profile.bodyType)}
                {renderDetail("Complexion", profile.complexion)}
                {renderDetail("Mother Tongue", profile.motherTongue)}
                {renderDetail("Weight", profile.weight)}
                {renderDetail("Physical Status", profile.physicalStatus)}
              </div>
            )}
            {activeTab === "education" && (
              <div className="details-grid-premium">
                {renderDetail("Education", profile.education)}
                {renderDetail("Profession", profile.occupation)}
                {renderDetail("Company", profile.companyName)}
                {renderDetail("Income", profile.annualIncome)}
                {renderDetail("Employed In", profile.employedIn)}
              </div>
            )}
            {activeTab === "family" && (
              <div className="details-grid-premium">
                {renderDetail("Family Type", profile.familyType)}
                {renderDetail("Family Values", profile.familyValues)}
                {renderDetail("Father's Occupation", profile.fatherOccupation)}
                {renderDetail("Mother's Occupation", profile.motherOccupation)}
                {renderDetail("Siblings", profile.siblings)}
              </div>
            )}
            {activeTab === "horoscope" && (
              <div className="details-grid-premium">
                {renderDetail("Date of Birth", profile.dob)}
                {renderDetail("Birth Place", profile.birthPlace)}
                {renderDetail("Manglik", profile.manglik)}
                {renderDetail("Rashi / Moon Sign", profile.rashi)}
                {renderDetail("Gotra", profile.gotra)}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;