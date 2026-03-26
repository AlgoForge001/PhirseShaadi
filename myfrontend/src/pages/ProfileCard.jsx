import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MapPin, Briefcase, CheckCircle, Star,
  Send, Bookmark, Eye, Users, Calendar
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

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Send Interest
  const handleInterest = async (e) => {
    e.stopPropagation();
    setInterestLoading(true);
    try {
      // TODO [BACKEND]: POST /api/interest/send
      await api.post(
        "/interest/send",
        { toUserId: profile._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInterested(true);
      if (onInterest) onInterest();
    } catch (err) {
      console.error("Failed to send interest");
    } finally {
      setInterestLoading(false);
    }
  };

  // Shortlist
  const handleShortlist = async (e) => {
    e.stopPropagation();
    setShortlistLoading(true);
    try {
      // TODO [BACKEND]: POST /api/shortlist
      await api.post(
        "/shortlist",
        { userId: profile._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortlisted(!shortlisted);
      if (onShortlist) onShortlist();
    } catch (err) {
      console.error("Failed to shortlist");
    } finally {
      setShortlistLoading(false);
    }
  };

  const age = calculateAge(profile.dob);

  return (
    <div className="profile-card">
      {/* PHOTO SECTION */}
      <div className="pc-photo-section">
        {profile.photos && profile.photos.length > 0 ? (
          <img src={profile.photos[0].url} alt={profile.fullName} className="pc-photo" />
        ) : (
          <div className="pc-photo-placeholder">
            <Users size={60} color="#A376A2" />
          </div>
        )}

        {/* BADGES OVERLAY */}
        <div className="pc-badges">
          {profile.isVerified && (
            <span className="pc-badge verified">
              <CheckCircle size={12} /> Verified
            </span>
          )}
          {profile.isPremium && (
            <span className="pc-badge premium">
              <Star size={12} fill="white" color="white" /> Premium
            </span>
          )}
          {profile.online && (
            <span className="pc-badge online">Online</span>
          )}
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="pc-info">
        {/* NAME & AGE */}
        <div className="pc-name-row">
          <h3 className="pc-name">{profile.fullName}</h3>
          {age && <span className="pc-age">{age}yrs</span>}
        </div>

        {/* LOCATION */}
        {profile.city && (
          <div className="pc-meta">
            <MapPin size={13} />
            <span>{profile.city}, {profile.state}</span>
          </div>
        )}

        {/* OCCUPATION */}
        {profile.occupation && (
          <div className="pc-meta">
            <Briefcase size={13} />
            <span>{profile.occupation}</span>
          </div>
        )}

        {/* RELIGION & COMMUNITY */}
        {profile.religion && (
          <div className="pc-meta">
            <Heart size={13} />
            <span>{profile.religion} • {profile.community || "—"}</span>
          </div>
        )}

        {/* ABOUT PREVIEW */}
        {profile.about && (
          <p className="pc-about">{profile.about.substring(0, 100)}...</p>
        )}

        {/* ACTIONS */}
        <div className="pc-actions">
          {/* SHORTLIST */}
          <button
            className={`pc-action-btn shortlist ${shortlisted ? "active" : ""}`}
            onClick={handleShortlist}
            disabled={shortlistLoading}
            title="Shortlist"
          >
            {shortlistLoading ? (
              <span className="pc-spinner-small" />
            ) : (
              <Bookmark size={16} fill={shortlisted ? "#6B3F69" : "none"} />
            )}
          </button>

          {/* SEND INTEREST */}
          <button
            className={`pc-action-btn interest ${interested ? "active" : ""}`}
            onClick={handleInterest}
            disabled={interested || interestLoading}
            title="Send Interest"
          >
            {interestLoading ? (
              <span className="pc-spinner-small white" />
            ) : (
              <Heart
                size={16}
                fill={interested ? "white" : "none"}
                color="white"
              />
            )}
          </button>

          {/* VIEW PROFILE */}
          <button
            className="pc-action-btn view"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${profile._id}`);
            }}
            title="View Profile"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;