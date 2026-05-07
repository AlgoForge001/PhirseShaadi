import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // HMR Trigger
import {
  Eye, MapPin, CheckCircle, Heart,
  Users, MessageCircle, Sparkles, Brain
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { normalizeImageUrl } from "../utils/imageUtils";
import "./ProfileCard.css";

const ProfileCard = ({ profile, onInterest, onShortlist }) => {
  console.log("ProfileCard Rendering:", profile.name);
  const navigate = useNavigate();
  const { token } = useAuth();
  const [interested, setInterested] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);
  const [interestLoading, setInterestLoading] = useState(false);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const photo = profile.photos?.find((p) => p.isPrimary) || profile.photos?.[0];
  const primaryPhotoUrl = normalizeImageUrl(photo?.url);
  const showPhoto = primaryPhotoUrl && !imgFailed;
  const displayName = profile.name || "Unknown Member";

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const truncateName = (name, limit = 15) => {
    if (!name) return "";
    return name.length > limit ? name.substring(0, limit) + "..." : name;
  };

  const handleInterest = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setInterestLoading(true);
      await api.post("/interests/send", { receiverId: profile._id });
      setInterested(true);
      if (onInterest) onInterest(profile._id);
    } catch (err) {
      console.error("Interest failed:", err);
      if (err.response?.status === 400) setInterested(true);
    } finally {
      setInterestLoading(false);
    }
  };

  const handleShortlist = async (e) => {
    e.stopPropagation();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setShortlistLoading(true);
      await api.post("/profile/shortlist", { targetUserId: profile._id });
      setShortlisted(true);
      if (onShortlist) onShortlist(profile._id);
    } catch (err) {
      console.error("Shortlist failed:", err);
      if (err.response?.status === 400) setShortlisted(true);
    } finally {
      setShortlistLoading(false);
    }
  };

  const age = calculateAge(profile.dob);

  return (
    <div className="premium-profile-card" onClick={() => navigate(`/profile/${profile._id}`)}>
      {/* PHOTO SECTION */}
      <div className="premium-pc-photo-wrapper">
        {primaryPhotoUrl && (
          <img
            src={primaryPhotoUrl}
            alt={displayName}
            className="premium-pc-main-photo"
            style={{ display: showPhoto ? "block" : "none" }}
            onError={() => setImgFailed(true)}
          />
        )}

        {!showPhoto && (
          <div className="premium-pc-photo-placeholder">
            <Users size={32} />
          </div>
        )}

        {/* FLOATING TOP BADGES */}
        <div className="premium-pc-top-badges">
          {profile.isSmartMatch && (
            <span className="premium-pc-smart-badge-compact">
              <Sparkles size={10} fill="white" /> AI
            </span>
          )}
          {profile.matchPercentage !== undefined && (
            <span className={`premium-pc-match-badge-compact ${profile.matchPercentage >= 80 ? "high" : ""}`}>
              {profile.matchPercentage}%
            </span>
          )}
        </div>

        {/* FLOATING ACTION BUTTONS */}
        <div className="premium-pc-floating-actions">
          <button
            className={`floating-action-btn ${interested ? "active" : ""}`}
            onClick={handleInterest}
            disabled={interested || interestLoading}
          >
            <Heart size={14} fill={interested ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="premium-pc-info">
        <div className="premium-pc-name-row">
          <h4 className="premium-pc-user-name">
            {truncateName(displayName, 14)}
            {profile.isVerified && (
              <CheckCircle size={12} fill="#10B981" color="white" className="premium-pc-verified-icon" />
            )}
          </h4>
        </div>
        
        <p className="premium-pc-user-subtitle">
          {profile.occupation || "Member"}
        </p>
        
        <div className="premium-pc-meta-row">
          <span className="pc-meta-item">{age ? `${age} yrs` : ""}</span>
          <span className="pc-meta-dot">•</span>
          <div className="premium-pc-location-mini">
            <MapPin size={10} />
            <span>{profile.city || "Remote"}</span>
          </div>
        </div>
      </div>

      {/* AI INSIGHT PANEL (Hover only) */}
      {profile.isSmartMatch && profile.aiInsight && (
        <div className="premium-pc-ai-insight-panel">
          <p className="premium-ai-panel-text">{profile.aiInsight}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;