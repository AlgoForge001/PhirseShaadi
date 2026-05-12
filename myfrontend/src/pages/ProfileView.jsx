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
  const [interestLoading, setInterestLoading] = useState(false);
  const [_shortlistLoading, _setShortlistLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/profile/${id}`);
        setProfile(res.data.profile);
        if (res.data.interestStatus) {
            setInterestStatus(res.data.interestStatus);
        }
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

  const Section = ({ title, children }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <h3 className="text-xs font-semibold text-pink-600 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="min-w-0">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 mt-0.5 truncate">
        {value || "Not Specified"}
      </p>
    </div>
  );

  const InfoGrid = ({ children }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        
        {/* Back button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {/* MAIN 2-COLUMN LAYOUT */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* LEFT: Photo + Actions */}
          <div className="w-full md:w-72 md:sticky md:top-24 flex-shrink-0 space-y-4">
            
            {/* Photo card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative aspect-square">
                {(() => {
                  const photo = profile.photos?.[activePhoto];
                  const url = normalizeImageUrl(photo?.url);
                  if (url && !imgFailed[url]) {
                    return (
                      <img
                        src={url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(url)}
                      />
                    );
                  }
                  return (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Users size={48} />
                    </div>
                  );
                })()}
                
                {profile.photos?.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="p-1 bg-white/80 rounded-full text-gray-800" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}><ChevronLeft size={20} /></button>
                    <button className="p-1 bg-white/80 rounded-full text-gray-800" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}><ChevronRight size={20} /></button>
                  </div>
                )}
              </div>

              {/* Badges below photo */}
              <div className="p-3 flex gap-2 flex-wrap">
                {profile.isVerified && (
                  <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 font-bold uppercase tracking-wider">
                    ✓ Verified
                  </span>
                )}
                {profile.isPremium && (
                  <span className="text-[10px] px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200 font-bold uppercase tracking-wider">
                    ★ Elite Member
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm space-y-2">
              {interestLoading ? (
                <button className="w-full py-2.5 bg-pink-100 text-pink-400 rounded-lg text-sm font-medium cursor-wait" disabled>
                  Processing...
                </button>
              ) : interestStatus.status === 'accepted' ? (
                <button 
                  className="w-full py-2.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center justify-center gap-2 transition-all shadow-md"
                  onClick={() => navigate(`/chat/${id}`)}
                >
                  <MessageCircle size={18} /> Send Message
                </button>
              ) : interestStatus.received && interestStatus.status === 'pending' ? (
                <div className="space-y-2">
                  <button 
                    className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2 transition-all"
                    onClick={() => handleRespond('accepted')}
                  >
                    <CheckCircle size={18} /> Accept Request
                  </button>
                  <button 
                    className="w-full py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all"
                    onClick={() => handleRespond('rejected')}
                  >
                    Decline
                  </button>
                </div>
              ) : interestStatus.sent && interestStatus.status === 'pending' ? (
                <button className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium flex items-center justify-center gap-2" disabled>
                  <Clock size={18} /> Request Sent
                </button>
              ) : (
                <button 
                  className="w-full py-2.5 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  onClick={handleInterest}
                >
                  <Heart size={18} /> Express Interest
                </button>
              )}

              <button 
                className="w-full py-2 border border-gray-100 text-gray-400 text-xs hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                onClick={() => {/* Report logic */}}
              >
                🚩 Report Profile
              </button>
            </div>

            {/* Match % if available */}
            {profile.matchPercentage && (
              <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {profile.matchPercentage}%
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 uppercase font-bold tracking-widest">
                  AI Match Score
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: All Info */}
          <div className="flex-1 space-y-4 min-w-0">
            
            {/* Name + basic tags */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${profile.online ? "text-green-500" : "text-gray-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${profile.online ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  {profile.online ? "Online Now" : "Active Recently"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {profile.fullName || profile.name}
              </h1>
              <p className="text-base text-gray-500 mt-2 font-medium">
                {profile.age} yrs 
                {profile.height && ` • ${profile.height}`}
                {profile.religion && ` • ${profile.religion}`}
                {profile.city && ` • ${profile.city}`}
              </p>
              {profile.about && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{profile.about}"
                  </p>
                </div>
              )}
            </div>

            {/* Basic Details */}
            <Section title="Basic Details">
              <InfoGrid>
                <InfoItem label="Marital Status" value={profile.maritalStatus} />
                <InfoItem label="Height" value={profile.height} />
                <InfoItem label="Weight" value={profile.weight ? `${profile.weight} kg` : null} />
                <InfoItem label="Complexion" value={profile.complexion} />
                <InfoItem label="Body Type" value={profile.bodyType} />
                <InfoItem label="Diet" value={profile.diet} />
                <InfoItem label="Smoking" value={profile.smoking} />
                <InfoItem label="Drinking" value={profile.drinking} />
                <InfoItem label="Mother Tongue" value={profile.motherTongue} />
              </InfoGrid>
            </Section>

            {/* Career & Education */}
            <Section title="Career & Education">
              <InfoGrid>
                <InfoItem label="Education" value={profile.education} />
                <InfoItem label="Profession" value={profile.occupation} />
                <InfoItem label="Annual Income" value={profile.annualIncome} />
                <InfoItem label="Company" value={profile.companyName} />
                <InfoItem label="Employed In" value={profile.employedIn} />
                <InfoItem label="Work Location" value={profile.workLocation} />
              </InfoGrid>
            </Section>

            {/* Family Details */}
            <Section title="Family Details">
              <InfoGrid>
                <InfoItem label="Family Type" value={profile.familyType} />
                <InfoItem label="Family Status" value={profile.familyStatus} />
                <InfoItem label="Father's Occ." value={profile.fatherOccupation} />
                <InfoItem label="Mother's Occ." value={profile.motherOccupation} />
                <InfoItem label="Siblings" value={profile.siblings} />
                <InfoItem label="Family Values" value={profile.familyValues} />
              </InfoGrid>
            </Section>

            {/* Horoscope */}
            <Section title="Horoscope">
              <InfoGrid>
                <InfoItem label="Manglik" value={profile.manglik} />
                <InfoItem label="Gotra" value={profile.gotra} />
                <InfoItem label="Birth Place" value={profile.birthPlace} />
                <InfoItem label="Birth Time" value={profile.birthTime} />
              </InfoGrid>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
