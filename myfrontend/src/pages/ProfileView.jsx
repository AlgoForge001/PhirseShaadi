import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart, MapPin, Briefcase, GraduationCap,
  Users, ChevronLeft, ChevronRight, Star,
  CheckCircle, Flag, X, Send, Bookmark,
  Phone, MessageCircle, Shield, Share2, Clock,
  Info, Sparkles, Languages, UserCheck, Layers,
  Compass, Award, ShieldCheck, HeartHandshake
} from "lucide-react";
import api from "../utils/api";
import { normalizeImageUrl } from "../utils/imageUtils";

import Navbar from "../components/Navbar";
import "./ProfileView.css";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [imgFailed, setImgFailed] = useState({});

  const setImgError = (url) => {
    setImgFailed(prev => ({ ...prev, [url]: true }));
  };

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

  if (loading) return <div className="loading-screen">
    <div className="premium-loader">
      <Sparkles className="loader-icon" />
      <p>Curating Profile Aesthetics...</p>
    </div>
  </div>;
  
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

  const renderDetail = (icon, label, value) => (
    <div className="profile-detail-card">
      <div className="detail-icon-box">{icon}</div>
      <div className="detail-info">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value || "Not Specified"}</span>
      </div>
    </div>
  );

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location hidden for privacy";
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
               <button className="pv-icon-circle" title="Share Profile"><Share2 size={18} /></button>
               <button className="pv-icon-circle danger" title="Report Account"><Flag size={18} /></button>
             </div>
          </div>

          <div className="pv-grid-layout">
            
            {/* LEFT: PHOTO EXPERIENCE */}
            <div className="pv-photo-experience">
              <div className="pv-main-carousel">
                {(() => {
                  const photo = profile.photos?.[activePhoto];
                  const url = normalizeImageUrl(photo?.url);
                  
                  if (url && !imgFailed[url]) {
                    return (
                      <>
                        <div className="pv-blur-bg" style={{ backgroundImage: `url(${url})` }} />
                        <img 
                          src={url} 
                          alt={profile.name} 
                          className="pv-active-img" 
                          onError={() => setImgError(url)}
                        />
                      </>
                    );
                  }
                  return (
                    <div className="pv-placeholder">
                      <Users size={80} />
                      <span>No Photo Available</span>
                    </div>
                  );
                })()}
                
                {profile.photos?.length > 1 && (
                  <>
                    <button className="pv-nav-btn left" onClick={prevPhoto}><ChevronLeft size={24} /></button>
                    <button className="pv-nav-btn right" onClick={nextPhoto}><ChevronRight size={24} /></button>
                  </>
                )}

                <div className="pv-photo-badges">
                  {profile.isVerified && <span className="verified-pill"><ShieldCheck size={14} /> Verified</span>}
                  {profile.isPremium && <span className="premium-pill"><Award size={14} /> Elite Member</span>}
                </div>
              </div>

              <div className="pv-photo-dots">
                {profile.photos?.map((p, i) => {
                  const url = normalizeImageUrl(p?.url);
                  return (
                    <span 
                      key={i} 
                      className={`pv-dot ${activePhoto === i ? "active" : ""}`} 
                      onClick={() => setActivePhoto(i)} 
                    />
                  );
                })}
              </div>
            </div>

            {/* RIGHT: INFO PANEL */}
            <div className="pv-content-panel">
              <div className="pv-sticky-content">
                <div className="pv-title-block">
                  <div className="status-indicator">
                    <span className={`status-dot ${profile.online ? "online" : ""}`} />
                    {profile.online ? "Currently Online" : "Active Recently"}
                  </div>
                  <h1 className="pv-display-name">{profile.fullName || profile.name}</h1>
                  <div className="pv-hero-meta">
                    <span className="meta-pill">{profile.age} Years</span>
                    <span className="meta-pill">{profile.height}</span>
                    <span className="meta-pill">{profile.religion}</span>
                  </div>
                  <div className="pv-location-card">
                    <MapPin size={16} />
                    <span>{formatLocation(profile.city, profile.state)}</span>
                  </div>
                </div>

                <div className="pv-sections-stack">
                  {/* ABOUT SECTION */}
                  <div className="pv-section-block anim-fade">
                    <div className="section-intro">
                      <Sparkles size={14} className="kicker-icon" />
                      <span className="section-kicker">About the Individual</span>
                    </div>
                    <p className="pv-bio-text">{profile.about || "This member has not added a bio yet. Start a conversation to learn more about them!"}</p>
                    
                    <div className="grid-details-pv">
                      {renderDetail(<Heart size={18} />, "Marital Status", profile.maritalStatus)}
                      {renderDetail(<Languages size={18} />, "Mother Tongue", profile.motherTongue)}
                      {renderDetail(<Users size={18} />, "Body Type", profile.bodyType)}
                      {renderDetail(<Compass size={18} />, "Complexion", profile.complexion)}
                      {renderDetail(<Layers size={18} />, "Physical Status", profile.physicalStatus)}
                      {renderDetail(<Info size={18} />, "Dietary Habits", profile.diet)}
                    </div>
                  </div>

                  {/* EDUCATION & CAREER SECTION */}
                  <div className="pv-section-block anim-fade">
                    <div className="section-intro">
                      <GraduationCap size={14} className="kicker-icon" />
                      <span className="section-kicker">Career & Education</span>
                    </div>
                    <div className="grid-details-pv">
                      {renderDetail(<GraduationCap size={18} />, "Education", profile.education)}
                      {renderDetail(<Briefcase size={18} />, "Profession", profile.occupation)}
                      {renderDetail(<Users size={18} />, "Employed In", profile.employedIn)}
                      {renderDetail(<Award size={18} />, "Company", profile.companyName)}
                      {renderDetail(<Sparkles size={18} />, "Annual Income", profile.annualIncome)}
                      {renderDetail(<MapPin size={18} />, "Work Location", profile.workLocation)}
                    </div>
                  </div>

                  {/* FAMILY SECTION */}
                  <div className="pv-section-block anim-fade">
                    <div className="section-intro">
                      <Users size={14} className="kicker-icon" />
                      <span className="section-kicker">Family Details</span>
                    </div>
                     <div className="grid-details-pv">
                      {renderDetail(<Users size={18} />, "Family Type", profile.familyType)}
                      {renderDetail(<Heart size={18} />, "Family Values", profile.familyValues)}
                      {renderDetail(<Award size={18} />, "Family Status", profile.familyStatus)}
                      {renderDetail(<Briefcase size={18} />, "Father Occ.", profile.fatherOccupation)}
                      {renderDetail(<Briefcase size={18} />, "Mother Occ.", profile.motherOccupation)}
                      {renderDetail(<Users size={18} />, "Siblings", profile.siblings)}
                    </div>
                  </div>
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
            title="Shortlist Profile"
          >
            <Bookmark size={22} fill={shortlisted ? "currentColor" : "none"} />
          </button>
          
          <div className="pv-interest-actions">
            {interestLoading ? (
              <button className="pv-btn-main-action disabled" disabled>
                <div className="loader-dots"><span></span><span></span><span></span></div>
              </button>
            ) : interestStatus.status === 'accepted' ? (
              <button 
                className="pv-btn-main-action accepted"
                onClick={() => navigate(`/chat/${id}`)}
              >
                <MessageCircle size={22} /> Send Message
              </button>
            ) : interestStatus.received && interestStatus.status === 'pending' ? (
              <div className="pv-received-actions">
                <button className="pv-btn-main-action accept" onClick={() => handleRespond('accepted')}>
                  <CheckCircle size={22} /> Accept Request
                </button>
                <button className="pv-btn-circle-secondary reject" onClick={() => handleRespond('rejected')}>
                  <X size={22} />
                </button>
              </div>
            ) : interestStatus.sent && interestStatus.status === 'pending' ? (
              <button className="pv-btn-main-action sent" disabled>
                <Clock size={22} /> Request Sent
              </button>
            ) : (
              <button className="pv-btn-main-action" onClick={handleInterest}>
                <Heart size={22} /> Express Interest
              </button>
            )}
          </div>

          <button 
            className="pv-btn-circle-secondary" 
            onClick={(e) => { e.preventDefault(); window.openChatbot?.(); }}
            title="Need Help?"
          >
            <Info size={22} />
          </button>
        </div>
      </footer>
      
    </div>
  );
};

export default ProfileView;
