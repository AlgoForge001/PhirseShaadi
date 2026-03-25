import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart, MapPin, Briefcase, GraduationCap,
  Users, ChevronLeft, ChevronRight, Star,
  CheckCircle, Flag, X, Send, Bookmark,
  Phone, MessageCircle, Shield
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./ProfileView.css";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);

  // Action states
  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);

  // Report modal
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("about");

  // ── FETCH PROFILE ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO [BACKEND]: GET /api/profile/:id
        // Headers: { Authorization: Bearer token }
        // Response: { success: true, profile: {...} }
        const res = await axios.get(
          `http://localhost:5000/api/profile/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data.profile);
        setInterested(res.data.profile.isInterested || false);
        setShortlisted(res.data.profile.isShortlisted || false);
      } catch (err) {
        setError("Failed to load profile.");
        // DUMMY DATA for UI testing
        setProfile({
          id,
          fullName: "Priya Sharma",
          age: 26,
          height: "5'4\"",
          weight: "55 kg",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          religion: "Hindu",
          community: "Brahmin",
          motherTongue: "Hindi",
          isVerified: true,
          isPremium: true,
          online: true,
          lastSeen: "Today",
          about: "I am a software engineer who loves to travel, read books and explore new cuisines. Looking for a kind, ambitious and family-oriented life partner who values honesty and respect.",
          photos: [],
          education: "B.Tech - Computer Science",
          occupation: "Software Engineer",
          employedIn: "Private Sector",
          companyName: "Tech Corp",
          annualIncome: "₹10L - ₹15L",
          familyType: "Nuclear Family",
          familyStatus: "Middle Class",
          familyValues: "Moderate",
          fatherOccupation: "Retired",
          motherOccupation: "Homemaker",
          siblings: "1 Brother",
          maritalStatus: "Never Married",
          complexion: "Fair",
          bodyType: "Slim",
          dob: "1998-05-15",
          manglik: "No",
          rashi: "Taurus",
          nakshatra: "Rohini",
          isInterested: false,
          isShortlisted: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  // ── PHOTO CAROUSEL ──
  const nextPhoto = () => {
    if (profile?.photos?.length > 0) {
      setActivePhoto((p) => (p + 1) % profile.photos.length);
    }
  };

  const prevPhoto = () => {
    if (profile?.photos?.length > 0) {
      setActivePhoto((p) => (p - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  // ── SEND INTEREST ──
  const handleInterest = async () => {
    setInterestLoading(true);
    try {
      // TODO [BACKEND]: POST /api/interest/send
      // Body: { toUserId: id }
      // Headers: { Authorization: Bearer token }
      // Response: { success: true, message: "Interest sent" }
      await axios.post(
        "http://localhost:5000/api/interest/send",
        { toUserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterested(true);
    } catch (err) {
      console.error("Failed to send interest");
    } finally {
      setInterestLoading(false);
    }
  };

  // ── SHORTLIST ──
  const handleShortlist = async () => {
    setShortlistLoading(true);
    try {
      // TODO [BACKEND]: POST /api/shortlist
      // Body: { userId: id }
      // Headers: { Authorization: Bearer token }
      // Response: { success: true }
      await axios.post(
        "http://localhost:5000/api/shortlist",
        { userId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortlisted(!shortlisted);
    } catch (err) {
      console.error("Failed to shortlist");
    } finally {
      setShortlistLoading(false);
    }
  };

  // ── REPORT ──
  const handleReport = async () => {
    if (!reportReason) return;
    setReportLoading(true);
    try {
      // TODO [BACKEND]: POST /api/report
      // Body: { userId: id, reason: reportReason }
      // Headers: { Authorization: Bearer token }
      await axios.post(
        "http://localhost:5000/api/report",
        { userId: id, reason: reportReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReportSuccess(true);
      setTimeout(() => {
        setShowReport(false);
        setReportSuccess(false);
        setReportReason("");
      }, 2000);
    } catch (err) {
      console.error("Failed to report");
    } finally {
      setReportLoading(false);
    }
  };

  const reportReasons = [
    "Fake Profile",
    "Inappropriate Photos",
    "Asking for Money",
    "Abusive Behavior",
    "Spam Messages",
    "Already Married",
    "Other",
  ];

  const tabs = [
    { key: "about", label: "About" },
    { key: "education", label: "Education" },
    { key: "family", label: "Family" },
    { key: "horoscope", label: "Horoscope" },
  ];

  // ── LOADING ──
  if (loading) {
    return (
      <div className="pv-loading">
        <div className="pv-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pv-error">
        <p>{error || "Profile not found."}</p>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="pv-page">

      {/* ── BACK BUTTON ── */}
      <button className="pv-back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back
      </button>

      {/* ── PHOTO CAROUSEL ── */}
      <div className="pv-carousel">
        {profile.photos && profile.photos.length > 0 ? (
          <>
            <img
              src={profile.photos[activePhoto]?.url}
              alt={profile.fullName}
              className="pv-carousel-img"
            />
            {profile.photos.length > 1 && (
              <>
                <button className="pv-carousel-btn left" onClick={prevPhoto}>
                  <ChevronLeft size={22} />
                </button>
                <button className="pv-carousel-btn right" onClick={nextPhoto}>
                  <ChevronRight size={22} />
                </button>
                <div className="pv-carousel-dots">
                  {profile.photos.map((_, i) => (
                    <div
                      key={i}
                      className={`pv-dot ${activePhoto === i ? "active" : ""}`}
                      onClick={() => setActivePhoto(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="pv-no-photo">
            <Users size={80} color="#A376A2" />
            <p>No photos added</p>
          </div>
        )}

        {/* BADGES OVERLAY */}
        <div className="pv-carousel-badges">
          {profile.isVerified && (
            <span className="pv-badge verified">
              <CheckCircle size={12} /> Verified
            </span>
          )}
          {profile.isPremium && (
            <span className="pv-badge premium">
              <Star size={12} fill="white" color="white" /> Premium
            </span>
          )}
          {profile.online && (
            <span className="pv-badge online">Online</span>
          )}
        </div>

        {/* REPORT BUTTON */}
        <button
          className="pv-report-icon-btn"
          onClick={() => setShowReport(true)}
          title="Report Profile"
        >
          <Flag size={16} />
        </button>
      </div>

      {/* ── PROFILE HEADER ── */}
      <div className="pv-header">
        <div className="pv-header-left">
          <h1>{profile.fullName}</h1>
          <div className="pv-header-meta">
            <span><Users size={14} /> {profile.age} yrs • {profile.height}</span>
            <span><MapPin size={14} /> {profile.city}, {profile.state}</span>
            <span><Heart size={14} /> {profile.religion} • {profile.community}</span>
            <span><Briefcase size={14} /> {profile.occupation}</span>
          </div>
        </div>
        <div className="pv-header-right">
          <div className={`pv-online-status ${profile.online ? "online" : ""}`}>
            {profile.online ? "Online" : `Last seen ${profile.lastSeen}`}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="pv-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`pv-tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="pv-content">

        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="pv-tab-content">
            <div className="pv-section">
              <h3>About</h3>
              <p>{profile.about || "No description added."}</p>
            </div>
            <div className="pv-section">
              <h3>Basic Details</h3>
              <div className="pv-details-grid">
                <div className="pv-detail"><span>Age</span><strong>{profile.age} yrs</strong></div>
                <div className="pv-detail"><span>Height</span><strong>{profile.height}</strong></div>
                <div className="pv-detail"><span>Weight</span><strong>{profile.weight}</strong></div>
                <div className="pv-detail"><span>Complexion</span><strong>{profile.complexion}</strong></div>
                <div className="pv-detail"><span>Body Type</span><strong>{profile.bodyType}</strong></div>
                <div className="pv-detail"><span>Marital Status</span><strong>{profile.maritalStatus}</strong></div>
                <div className="pv-detail"><span>Mother Tongue</span><strong>{profile.motherTongue}</strong></div>
                <div className="pv-detail"><span>City</span><strong>{profile.city}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === "education" && (
          <div className="pv-tab-content">
            <div className="pv-section">
              <h3>Education & Career</h3>
              <div className="pv-details-grid">
                <div className="pv-detail"><span>Education</span><strong>{profile.education}</strong></div>
                <div className="pv-detail"><span>Occupation</span><strong>{profile.occupation}</strong></div>
                <div className="pv-detail"><span>Employed In</span><strong>{profile.employedIn}</strong></div>
                <div className="pv-detail"><span>Company</span><strong>{profile.companyName}</strong></div>
                <div className="pv-detail"><span>Annual Income</span><strong>{profile.annualIncome}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* FAMILY */}
        {activeTab === "family" && (
          <div className="pv-tab-content">
            <div className="pv-section">
              <h3>Family Details</h3>
              <div className="pv-details-grid">
                <div className="pv-detail"><span>Family Type</span><strong>{profile.familyType}</strong></div>
                <div className="pv-detail"><span>Family Status</span><strong>{profile.familyStatus}</strong></div>
                <div className="pv-detail"><span>Family Values</span><strong>{profile.familyValues}</strong></div>
                <div className="pv-detail"><span>Father's Occupation</span><strong>{profile.fatherOccupation}</strong></div>
                <div className="pv-detail"><span>Mother's Occupation</span><strong>{profile.motherOccupation}</strong></div>
                <div className="pv-detail"><span>Siblings</span><strong>{profile.siblings}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* HOROSCOPE */}
        {activeTab === "horoscope" && (
          <div className="pv-tab-content">
            <div className="pv-section">
              <h3>Horoscope</h3>
              <div className="pv-details-grid">
                <div className="pv-detail"><span>Date of Birth</span><strong>{profile.dob}</strong></div>
                <div className="pv-detail"><span>Manglik</span><strong>{profile.manglik}</strong></div>
                <div className="pv-detail"><span>Rashi</span><strong>{profile.rashi}</strong></div>
                <div className="pv-detail"><span>Nakshatra</span><strong>{profile.nakshatra}</strong></div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM ACTION BUTTONS ── */}
      <div className="pv-actions">

        {/* SHORTLIST */}
        <button
          className={`pv-action-btn shortlist ${shortlisted ? "active" : ""}`}
          onClick={handleShortlist}
          disabled={shortlistLoading}
        >
          {shortlistLoading ? (
            <span className="pv-btn-spinner" />
          ) : (
            <Bookmark size={20} fill={shortlisted ? "#6B3F69" : "none"} />
          )}
          <span>{shortlisted ? "Shortlisted" : "Shortlist"}</span>
        </button>

        {/* SEND INTEREST */}
        <button
          className={`pv-action-btn interest ${interested ? "active" : ""}`}
          onClick={handleInterest}
          disabled={interested || interestLoading}
        >
          {interestLoading ? (
            <span className="pv-btn-spinner white" />
          ) : (
            <Heart
              size={20}
              fill={interested ? "white" : "none"}
              color="white"
            />
          )}
          <span>{interested ? "Interest Sent" : "Send Interest"}</span>
        </button>

        {/* CHAT */}
        <button
          className="pv-action-btn chat"
          onClick={() => navigate(`/chat/${id}`)}
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </button>

      </div>

      {/* ── REPORT MODAL ── */}
      {showReport && (
        <div className="pv-modal-overlay" onClick={() => setShowReport(false)}>
          <div className="pv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pv-modal-header">
              <h3><Flag size={18} color="#e53935" /> Report Profile</h3>
              <button onClick={() => setShowReport(false)}>
                <X size={20} />
              </button>
            </div>

            {reportSuccess ? (
              <div className="pv-report-success">
                <CheckCircle size={40} color="#2e7d32" />
                <p>Report submitted successfully. We will review this profile.</p>
              </div>
            ) : (
              <>
                <p className="pv-modal-desc">
                  Why are you reporting this profile? Your report is confidential.
                </p>
                <div className="pv-report-reasons">
                  {reportReasons.map((reason) => (
                    <button
                      key={reason}
                      className={`pv-reason-btn ${reportReason === reason ? "selected" : ""}`}
                      onClick={() => setReportReason(reason)}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <button
                  className="pv-report-submit"
                  onClick={handleReport}
                  disabled={!reportReason || reportLoading}
                >
                  {reportLoading ? <span className="pv-btn-spinner" /> : "Submit Report"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileView;