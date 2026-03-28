import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, MapPin, Briefcase, CheckCircle, Star,
  Send, Bookmark, Eye, Users, Calendar, MessageCircle
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
    <div className="profile-card" onClick={() => navigate(`/profile/${profile._id}`)}>
      {/* FULL PHOTO BACKGROUND */}
      <div className="pc-photo-wrapper">
        {profile.photos && profile.photos.length > 0 ? (
          <img src={profile.photos[0].url} alt={profile.fullName} className="pc-main-photo" />
        ) : (
          <div className="pc-photo-placeholder">
            <Users size={60} color="#6B3F69" />
          </div>
        )}

        {/* OVERLAY CONTENT */}
        <div className="pc-overlay-gradient">
          {/* TOP BADGES */}
          <div className="pc-top-badges">
            {profile.isVerified && (
              <span className="pc-verified-dot" title="Verified">
                <CheckCircle size={14} fill="#6B3F69" color="white" />
              </span>
            )}
            {profile.matchPercentage !== undefined && (
              <span className={`pc-match-badge ${profile.matchPercentage >= 80 ? 'high' : ''}`}>
                {profile.matchPercentage}% Match
              </span>
            )}
          </div>

          {/* BOTTOM INFO */}
          <div className="pc-bottom-wrap">
            <div className="pc-text-content">
              <div className="pc-name-row">
                <span className="pc-user-name">{profile.fullName}</span>
                {profile.isVerified && <CheckCircle size={14} fill="white" color="#6B3F69" className="pc-verified-icon" />}
              </div>
              <p className="pc-user-subtitle">
                {profile.occupation || "Member"} • {age}yrs
              </p>
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
                className={`pc-icon-action ${interested ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleInterest(e); }}
                disabled={interested || interestLoading}
              >
                <Heart size={18} fill={interested ? "white" : "none"} color="white" />
              </button>
              <button 
                className={`pc-icon-action ${shortlisted ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleShortlist(e); }}
                disabled={shortlistLoading}
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