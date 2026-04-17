import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart, MapPin, Briefcase, GraduationCap,
  Users, ChevronLeft, ChevronRight, Star,
  CheckCircle, Flag, X, Send, Bookmark,
  Phone, MessageCircle, Shield, Share2, Clock
} from "lucide-react";
import api from "../utils/api";

import Navbar from "../components/Navbar";
import "./ProfileView.css";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);

  // States
  const [interestStatus, setInterestStatus] = useState({ sent: false, received: false, status: null });
  const [shortlisted, setShortlisted] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [_shortlistLoading, _setShortlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/profile/${id}`);
        setProfile(res.data.profile);
        if (res.data.interestStatus) {
            setInterestStatus(res.data.interestStatus);
        }
        setShortlisted(res.data.profile.isShortlisted || false);
      } catch (err) {
        console.error("Profile view failed:", err);
        setError("User profile not found.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading profile aesthetics...</div>;
  if (!profile) return <div className="error-screen">{error}</div>;

  const nextPhoto = () => setActivePhoto((p) => (p + 1) % profile.photos.length);
  const prevPhoto = () => setActivePhoto((p) => (p - 1 + profile.photos.length) % profile.photos.length);

  const handleInterest = async () => {
    setInterestLoading(true);
    try {
      await api.post("/interest/send", { toUserId: id });
      setInterestStatus({ sent: true, received: false, status: 'pending', interestId: null });
    } catch (err) { console.error(err); }
    finally { setInterestLoading(false); }
  };

  const handleRespond = async (status) => {
    if (!interestStatus.interestId) return;
    setInterestLoading(true);
    try {
      await api.put('/interest/respond', { interestId: interestStatus.interestId, status });
      setInterestStatus(prev => ({ ...prev, status }));
    } catch (err) { console.error(err); }
    finally { setInterestLoading(false); }
  };

  const renderDetail = (label, value) => (
    <div className="profile-detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "—"}</span>
    </div>
  );

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location not specified";
  };

  return (
    <div className="profile-view-premium">
      <Navbar />

      <main className="pv-wrapper">
        <div className="pv-container-main">
          
          {/* HEADER SECTION */}
          <div className="pv-header-premium">
             <button className="pv-back-circle" onClick={() => navigate(-1)}><ChevronLeft /></button>
             <div className="pv-header-actions">
               <button className="pv-icon-circle"><Share2 size={18} /></button>
               <button className="pv-icon-circle"><Flag size={18} /></button>
             </div>
          </div>

          <div className="pv-grid-layout">
            
            {/* LEFT: PHOTO EXPERIENCE */}
            <div className="pv-photo-experience">
              <div className="pv-main-carousel">
                {profile.photos?.[activePhoto] ? (
                  <img src={profile.photos[activePhoto].url} alt="" className="pv-active-img" />
                ) : (
                  <div className="pv-placeholder"><Users size={80} /></div>
                )}
                
                {profile.photos?.length > 1 && (
                  <>
                    <button className="pv-nav-btn left" onClick={prevPhoto}><ChevronLeft size={24} /></button>
                    <button className="pv-nav-btn right" onClick={nextPhoto}><ChevronRight size={24} /></button>
                  </>
                )}

                <div className="pv-photo-badges">
                  {profile.isVerified && <span className="verified-pill"><CheckCircle size={14} /> Verified</span>}
                  {profile.isPremium && <span className="premium-pill"><Star size={14} fill="currentColor" /> Premium Member</span>}
                </div>
              </div>

              <div className="pv-photo-dots">
                {profile.photos?.map((_, i) => (
                  <span key={i} className={`pv-dot ${activePhoto === i ? "active" : ""}`} onClick={() => setActivePhoto(i)} />
                ))}
              </div>
            </div>

            {/* RIGHT: INFO PANEL */}
            <div className="pv-content-panel">
              <div className="pv-sticky-content">
                <div className="pv-title-block">
                  <div className="status-indicator">
                    <span className={`status-dot ${profile.online ? "online" : ""}`} />
                    {profile.online ? "Online" : "Recently Active"}
                  </div>
                  <h1>{profile.fullName || profile.name}</h1>
                  <p className="pv-sub-meta">{profile.age} Yrs • {profile.height} • {profile.religion}</p>
                  <div className="pv-location-row">
                    <MapPin size={16} />
                    <span>{formatLocation(profile.city, profile.state)}</span>
                  </div>
                </div>

                <div className="pv-tabs-nav">
                  <button className={activeTab === "about" ? "active" : ""} onClick={() => setActiveTab("about")}>About</button>
                  <button className={activeTab === "education" ? "active" : ""} onClick={() => setActiveTab("education")}>Career</button>
                  <button className={activeTab === "family" ? "active" : ""} onClick={() => setActiveTab("family")}>Family</button>
                </div>

                <div className="pv-tab-pane">
                  {activeTab === "about" && (
                    <div className="pv-tab-content anim-fade">
                      <p className="pv-bio-text">{profile.about || "This user prefers to keep it a mystery."}</p>
                      <div className="grid-details-pv">
                        {renderDetail("Marital Status", profile.maritalStatus)}
                        {renderDetail("Mother Tongue", profile.motherTongue)}
                        {renderDetail("Body Type", profile.bodyType)}
                        {renderDetail("Complexion", profile.complexion)}
                      </div>
                    </div>
                  )}
                  {activeTab === "education" && (
                    <div className="pv-tab-content anim-fade">
                      <div className="grid-details-pv">
                        {renderDetail("Education", profile.education)}
                        {renderDetail("Profession", profile.occupation)}
                        {renderDetail("Company", profile.companyName)}
                        {renderDetail("Income", profile.annualIncome)}
                      </div>
                    </div>
                  )}
                  {activeTab === "family" && (
                    <div className="pv-tab-content anim-fade">
                       <div className="grid-details-pv">
                        {renderDetail("Family Type", profile.familyType)}
                        {renderDetail("Father Occ.", profile.fatherOccupation)}
                        {renderDetail("Mother Occ.", profile.motherOccupation)}
                        {renderDetail("Siblings", profile.siblings)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FLOATING ACTION BAR */}
      <footer className="pv-floating-actions">
        <div className="pv-actions-inner">
          <button 
            className={`pv-btn-circle-secondary ${shortlisted ? "active" : ""}`}
            onClick={() => setShortlisted(!shortlisted)}
          >
            <Bookmark size={20} fill={shortlisted ? "currentColor" : "none"} />
          </button>
          
          <div className="pv-interest-actions">
            {interestLoading ? (
              <button className="pv-btn-main-action disabled" disabled>
                <span className="spinner" />
              </button>
            ) : interestStatus.status === 'accepted' ? (
              <button 
                className="pv-btn-main-action accepted"
                onClick={() => navigate(`/chat/${id}`)}
              >
                <MessageCircle size={20} /> Chat Now
              </button>
            ) : interestStatus.received && interestStatus.status === 'pending' ? (
              <div className="pv-received-actions">
                <button className="pv-btn-main-action accept" onClick={() => handleRespond('accepted')}>
                  <CheckCircle size={20} /> Accept
                </button>
                <button className="pv-btn-circle-secondary reject" onClick={() => handleRespond('rejected')}>
                  <X size={20} />
                </button>
              </div>
            ) : interestStatus.sent && interestStatus.status === 'pending' ? (
              <button className="pv-btn-main-action sent" disabled>
                <Clock size={20} /> Interest Sent
              </button>
            ) : interestStatus.status === 'rejected' ? (
              <button className="pv-btn-main-action disabled" disabled>
                <X size={20} /> Interest Declined
              </button>
            ) : (
              <button className="pv-btn-main-action" onClick={handleInterest}>
                <Heart size={20} /> Express Interest
              </button>
            )}
          </div>

          <button 
            className="pv-btn-circle-secondary" 
            onClick={() => navigate(`/chat/${id}`)}
            disabled={interestStatus.status !== 'accepted'}
            title={interestStatus.status === 'accepted' ? 'Message' : 'Accept interest to message'}
          >
            <MessageCircle size={20} opacity={interestStatus.status === 'accepted' ? 1 : 0.5} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ProfileView;
