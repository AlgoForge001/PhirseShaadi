import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MapPin, CheckCircle,
  Bookmark, Users, MessageCircle, Sparkles, Brain
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./ProfileCard.css";

const ProfileCard = ({ profile, onInterest, onShortlist }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false); // ✅ FIX: track image load failure in state

  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location not specified";
  };

  // ✅ Support both `name` and `fullName` fields
  const displayName = profile.name || profile.fullName || "Member";

  // ✅ Truncate long names to prevent overflow
  const truncateName = (name, max = 20) =>
    name.length > max ? name.slice(0, max).trim() + "…" : name;

  const getPrimaryPhoto = () => {
    if (!profile.photos || profile.photos.length === 0) return null;
    const primary = profile.photos.find(p => p.isPrimary);
    const photo = primary || profile.photos[0];
    if (typeof photo === "string") return photo;
    return photo?.url || null;
  };

  const primaryPhotoUrl = getPrimaryPhoto();

  // ✅ FIX: show photo only if URL exists AND image hasn't failed
  const showPhoto = primaryPhotoUrl && !imgFailed;

  const handleInterest = async (e) => {
    e.stopPropagation();
    if (interested || interestLoading) return;
    setInterestLoading(true);
    try {
      await api.post("/interest/send", { toUserId: profile._id });
      setInterested(true);
      if (onInterest) onInterest();
    } catch {
      console.error("Failed to send interest");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleShortlist = async (e) => {
    e.stopPropagation();
    if (shortlistLoading) return;
    setShortlistLoading(true);
    try {
      await api.post("/shortlist", { userId: profile._id });
      setShortlisted(!shortlisted);
      if (onShortlist) onShortlist();
    } catch {
      console.error("Failed to shortlist");
    } finally {
      setShortlistLoading(false);
    }
  };

  const age = calculateAge(profile.dob);

  return (
    <div className="profile-card" onClick={() => navigate(`/profile/${profile._id}`)}>
      {/* PHOTO SECTION */}
      <div className="pc-photo-wrapper">
        {primaryPhotoUrl && (
          <img
            src={primaryPhotoUrl}
            alt={displayName}
            className="pc-main-photo"
            style={{ display: showPhoto ? "block" : "none" }}
            onError={() => setImgFailed(true)}
          />
        )}

        {!showPhoto && (
          <div className="pc-photo-placeholder">
            <Users size={48} />
          </div>
        )}

        {/* FLOATING BADGES ON PHOTO */}
        <div className="pc-top-badges">
          {profile.matchPercentage !== undefined && (
            <span className={`pc-match-badge ${profile.matchPercentage >= 80 ? "high" : ""}`}>
              {profile.matchPercentage}% Match
            </span>
          )}
          {profile.isSmartMatch && (
            <span className="pc-smart-badge">
              <Sparkles size={12} fill="white" /> AI
            </span>
          )}
        </div>

        {/* AI INSIGHT PANEL (Slide up on hover) */}
        {profile.isSmartMatch && profile.aiInsight && (
          <div className="pc-ai-insight-panel">
            <div className="ai-panel-header">
              <Brain size={14} />
              <span>AI Insight</span>
            </div>
            <p className="ai-panel-text">{profile.aiInsight}</p>
          </div>
        )}
      </div>

      {/* INFO SECTION (Below Photo) */}
      <div className="pc-info-content">
        <div className="pc-text-main">
          <div className="pc-name-row">
            <span className="pc-user-name">
              {truncateName(displayName, 18)}
            </span>
            {profile.isVerified && (
              <CheckCircle size={18} fill="#10B981" color="white" className="pc-verified-icon" />
            )}
          </div>
          <p className="pc-user-subtitle">
            {profile.occupation || "Member"}{age ? ` • ${age} yrs` : ""}
          </p>
        </div>

        <div className="pc-details-row">
          <div className="pc-location-badge">
            <MapPin size={12} />
            <span>{profile.city || "Remote"}</span>
          </div>

          <div className="pc-actions-group">
            <button
              className="pc-action-btn"
              onClick={(e) => { e.stopPropagation(); navigate(`/chat/${profile._id}`); }}
              title="Message"
            >
              <MessageCircle size={18} />
            </button>
            <button
              className={`pc-action-btn heart ${interested ? "active" : ""}`}
              onClick={handleInterest}
              disabled={interested || interestLoading}
              title="Send Interest"
            >
              <Heart size={18} fill={interested ? "currentColor" : "none"} />
            </button>
            <button
              className={`pc-action-btn bookmark ${shortlisted ? "active" : ""}`}
              onClick={handleShortlist}
              disabled={shortlistLoading}
              title="Shortlist"
            >
              <Bookmark size={18} fill={shortlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;