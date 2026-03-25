import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Edit, CheckCircle, Star, MapPin,
  Briefcase, GraduationCap, Users, Sun,
  Phone, Mail, Camera, ChevronRight
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);

  // ── PROFILE DATA ──
  const [profile, setProfile] = useState(null);

  // ── FETCH PROFILE ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO [BACKEND]: GET /api/profile/me
        // Headers: { Authorization: Bearer token }
        // Response: { success: true, profile: { ...all profile data } }
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.profile);
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        // DUMMY DATA for UI testing when backend is not ready
        setProfile({
          fullName: "Priya Sharma",
          age: 26,
          city: "Mumbai",
          state: "Maharashtra",
          phone: "+91 9876543210",
          email: "priya@example.com",
          isVerified: true,
          isPremium: true,
          profileFor: "Myself",
          photos: [],
          // Basic
          height: "5'4\"",
          weight: "55 kg",
          complexion: "Fair",
          bodyType: "Slim",
          physicalStatus: "Normal",
          about: "I am a software engineer who loves to travel and explore new places. Looking for a life partner who shares similar values.",
          // Education
          education: "B.Tech",
          educationDetail: "Computer Science from Mumbai University",
          occupation: "Software Engineer",
          employedIn: "Private Sector",
          companyName: "Tech Corp",
          annualIncome: "₹10L - ₹15L",
          // Family
          religion: "Hindu",
          community: "Brahmin",
          motherTongue: "Hindi",
          familyType: "Nuclear Family",
          familyStatus: "Middle Class",
          familyValues: "Moderate",
          fatherOccupation: "Retired",
          motherOccupation: "Homemaker",
          siblings: "1 Brother",
          aboutFamily: "We are a small happy family based in Mumbai.",
          // Horoscope
          dob: "1998-05-15",
          birthTime: "10:30 AM",
          birthPlace: "Mumbai",
          manglik: "No",
          gotra: "Kashyap",
          nakshatra: "Rohini",
          rashi: "Taurus",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const tabs = [
    { key: "basic", label: "Basic", icon: <Users size={16} /> },
    { key: "education", label: "Education", icon: <GraduationCap size={16} /> },
    { key: "family", label: "Family", icon: <Heart size={16} /> },
    { key: "horoscope", label: "Horoscope", icon: <Sun size={16} /> },
  ];

  if (loading) {
    return (
      <div className="mp-loading">
        <div className="mp-spinner" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mp-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="mp-page">

      {/* ── TOP SECTION ── */}
      <div className="mp-top">

        {/* BACKGROUND GRADIENT */}
        <div className="mp-top-bg" />

        {/* EDIT BUTTON */}
        <button
          className="mp-edit-btn"
          onClick={() => navigate("/profile-creation")}
        >
          <Edit size={16} /> Edit Profile
        </button>

        {/* PRIMARY PHOTO */}
        <div className="mp-photo-section">
          <div className="mp-primary-photo">
            {profile.photos && profile.photos[activePhoto] ? (
              <img src={profile.photos[activePhoto].url} alt="Profile" />
            ) : (
              <div className="mp-photo-placeholder">
                <Users size={60} color="#A376A2" />
              </div>
            )}

            {/* UPLOAD PHOTO BUTTON */}
            <button
              className="mp-upload-photo-btn"
              onClick={() => navigate("/upload-photos")}
            >
              <Camera size={16} />
            </button>
          </div>

          {/* PHOTO STRIP */}
          {profile.photos && profile.photos.length > 1 && (
            <div className="mp-photo-strip">
              {profile.photos.map((photo, i) => (
                <div
                  key={i}
                  className={`mp-strip-thumb ${activePhoto === i ? "active" : ""}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo.url} alt={`Photo ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAME & INFO */}
        <div className="mp-identity">
          <div className="mp-name-row">
            <h1>{profile.fullName}</h1>
            <div className="mp-badges">
              {profile.isVerified && (
                <span className="mp-badge verified">
                  <CheckCircle size={13} /> Verified
                </span>
              )}
              {profile.isPremium && (
                <span className="mp-badge premium">
                  <Star size={13} fill="white" color="white" /> Premium
                </span>
              )}
            </div>
          </div>

          <div className="mp-meta">
            <span><Users size={14} /> {profile.age} yrs • {profile.height}</span>
            <span><MapPin size={14} /> {profile.city}, {profile.state}</span>
            <span><Briefcase size={14} /> {profile.occupation}</span>
            <span><Heart size={14} /> {profile.religion} • {profile.community}</span>
          </div>

          <div className="mp-contact">
            <span><Phone size={13} /> {profile.phone}</span>
            <span><Mail size={13} /> {profile.email}</span>
          </div>
        </div>

      </div>

      {/* ── TABS ── */}
      <div className="mp-tabs-wrap">
        <div className="mp-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`mp-tab ${activeTab === t.key ? "active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="mp-content">

        {/* ── BASIC TAB ── */}
        {activeTab === "basic" && (
          <div className="mp-tab-content">
            <div className="mp-section">
              <h3>About Me</h3>
              <p className="mp-about">{profile.about || "No description added yet."}</p>
            </div>

            <div className="mp-section">
              <h3>Basic Details</h3>
              <div className="mp-details-grid">
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Height</span>
                  <span className="mp-detail-value">{profile.height || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Weight</span>
                  <span className="mp-detail-value">{profile.weight || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Complexion</span>
                  <span className="mp-detail-value">{profile.complexion || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Body Type</span>
                  <span className="mp-detail-value">{profile.bodyType || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Physical Status</span>
                  <span className="mp-detail-value">{profile.physicalStatus || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Profile For</span>
                  <span className="mp-detail-value">{profile.profileFor || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">City</span>
                  <span className="mp-detail-value">{profile.city || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">State</span>
                  <span className="mp-detail-value">{profile.state || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Mother Tongue</span>
                  <span className="mp-detail-value">{profile.motherTongue || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Religion</span>
                  <span className="mp-detail-value">{profile.religion || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EDUCATION TAB ── */}
        {activeTab === "education" && (
          <div className="mp-tab-content">
            <div className="mp-section">
              <h3>Education & Career</h3>
              <div className="mp-details-grid">
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Education</span>
                  <span className="mp-detail-value">{profile.education || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Details</span>
                  <span className="mp-detail-value">{profile.educationDetail || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Occupation</span>
                  <span className="mp-detail-value">{profile.occupation || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Employed In</span>
                  <span className="mp-detail-value">{profile.employedIn || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Company</span>
                  <span className="mp-detail-value">{profile.companyName || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Annual Income</span>
                  <span className="mp-detail-value">{profile.annualIncome || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FAMILY TAB ── */}
        {activeTab === "family" && (
          <div className="mp-tab-content">
            <div className="mp-section">
              <h3>Family Details</h3>
              <div className="mp-details-grid">
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Family Type</span>
                  <span className="mp-detail-value">{profile.familyType || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Family Status</span>
                  <span className="mp-detail-value">{profile.familyStatus || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Family Values</span>
                  <span className="mp-detail-value">{profile.familyValues || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Father's Occupation</span>
                  <span className="mp-detail-value">{profile.fatherOccupation || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Mother's Occupation</span>
                  <span className="mp-detail-value">{profile.motherOccupation || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Siblings</span>
                  <span className="mp-detail-value">{profile.siblings || "—"}</span>
                </div>
              </div>
            </div>

            {profile.aboutFamily && (
              <div className="mp-section">
                <h3>About Family</h3>
                <p className="mp-about">{profile.aboutFamily}</p>
              </div>
            )}
          </div>
        )}

        {/* ── HOROSCOPE TAB ── */}
        {activeTab === "horoscope" && (
          <div className="mp-tab-content">
            <div className="mp-section">
              <h3>Horoscope Details</h3>
              <div className="mp-details-grid">
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Date of Birth</span>
                  <span className="mp-detail-value">{profile.dob || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Birth Time</span>
                  <span className="mp-detail-value">{profile.birthTime || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Birth Place</span>
                  <span className="mp-detail-value">{profile.birthPlace || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Manglik</span>
                  <span className="mp-detail-value">{profile.manglik || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Gotra</span>
                  <span className="mp-detail-value">{profile.gotra || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Nakshatra</span>
                  <span className="mp-detail-value">{profile.nakshatra || "—"}</span>
                </div>
                <div className="mp-detail-item">
                  <span className="mp-detail-label">Rashi</span>
                  <span className="mp-detail-value">{profile.rashi || "—"}</span>
                </div>
              </div>
            </div>

            <div className="mp-kundli-note">
              <Sun size={20} color="#6B3F69" />
              <p>Full Kundli matching available with Premium plan.</p>
              <button
                className="mp-upgrade-btn"
                onClick={() => navigate("/premium")}
              >
                Upgrade to Premium <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyProfile;