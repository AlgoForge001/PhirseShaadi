import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MapPin, CheckCircle,
  Bookmark, Users, MessageCircle
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
      <div className="pc-photo-wrapper">

        {/* ✅ FIX: render img only when URL exists, set imgFailed on error */}
        {primaryPhotoUrl && (
          <img
            src={primaryPhotoUrl}
            alt={displayName}
            className="pc-main-photo"
            style={{ display: showPhoto ? "block" : "none" }}
            onError={() => setImgFailed(true)}
          />
        )}

        {/* ✅ FIX: placeholder shows when no photo OR image failed — pure React state, no DOM hacks */}
        {!showPhoto && (
          <div className="pc-photo-placeholder">
            <Users size={60} color="#6B3F69" />
          </div>
        )}

        <div className="pc-overlay-gradient">
          {/* TOP BADGES */}
          <div className="pc-top-badges">
            {profile.isVerified && (
              <span className="pc-verified-dot" title="Verified">
                <CheckCircle size={14} fill="#6B3F69" color="white" />
              </span>
            )}
            {profile.matchPercentage !== undefined && (
              <span className={`pc-match-badge ${profile.matchPercentage >= 80 ? "high" : ""}`}>
                {profile.matchPercentage}% Match
              </span>
            )}
          </div>

          {/* BOTTOM INFO */}
          <div className="pc-bottom-wrap">
            <div className="pc-text-content">
              <div className="pc-name-row">
                {/* ✅ FIX: truncate long names */}
                <span className="pc-user-name" title={displayName}>
                  {truncateName(displayName)}
                </span>
                {profile.isVerified && (
                  <CheckCircle size={14} fill="white" color="#6B3F69" className="pc-verified-icon" />
                )}
              </div>
              <p className="pc-user-subtitle">
                {profile.occupation || "Member"}{age ? ` • ${age}yrs` : ""}
              </p>
              <div className="pc-location-row">
                <MapPin size={13} color="white" />
                <span>{formatLocation(profile.city, profile.state)}</span>
              </div>
            </div>

            <div className="pc-real-actions">
              <button
                className="pc-icon-action"
                onClick={(e) => { e.stopPropagation(); navigate(`/chat/${profile._id}`); }}
                title="Message"
              >
                <MessageCircle size={18} color="white" />
              </button>
              <button
                className={`pc-icon-action ${interested ? "active" : ""}`}
                onClick={handleInterest}
                disabled={interested || interestLoading}
                title="Send Interest"
              >
                <Heart size={18} fill={interested ? "white" : "none"} color="white" />
              </button>
              <button
                className={`pc-icon-action ${shortlisted ? "active" : ""}`}
                onClick={handleShortlist}
                disabled={shortlistLoading}
                title="Shortlist"
              >
                <Bookmark size={18} fill={shortlisted ? "white" : "none"} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;