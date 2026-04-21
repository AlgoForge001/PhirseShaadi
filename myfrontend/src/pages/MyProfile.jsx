import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import "./MyProfile.css";

/* ─────────────────────────────────────────
   INLINE SVG ICON COMPONENTS
   All icons are self-contained SVGs —
   no icon library dependency needed.
───────────────────────────────────────── */

const IconUsers = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconCamera = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8
             a2 2 0 0 1 2-2h4l2-3h6l2 3h4
             a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconEdit = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14
             a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3
             L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconLock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconCheckCircle = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconStar = ({ size = 14, color = "currentColor", filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14
                     18.18 21.02 12 17.77 5.82 21.02
                     7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconMapPin = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10
             a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconBriefcase = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4
             a2 2 0 0 0-2 2v16"/>
  </svg>
);

const IconGradCap = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const IconHeart = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
             l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06
             L12 21.23l7.78-7.78 1.06-1.06
             a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconCalendar = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */

const MyProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState("basic");
  const [loading, setLoading]         = useState(true);
  const [_error, setError]            = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [profile, setProfile]         = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/profile/me");
        setProfile(res.data.profile);
      } catch (err) {
        console.error("Profile load failed:", err);
        setError("Failed to sync your profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading-screen">Preparing your profile…</div>;

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location not specified";
  };

  const renderDetail = (label, value) => (
    <div className="profile-detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "—"}</span>
    </div>
  );

  const tabs = [
    { id: "basic",     label: "General"   },
    { id: "education", label: "Career"    },
    { id: "family",    label: "Family"    },
    { id: "horoscope", label: "Faith"     },
  ];

  return (
    <div className="my-profile-premium">
      <Navbar />

      <main className="mp-container">

        {/* ── COVER BANNER ── */}
        <div className="mp-cover-strip">
          <div className="mp-cover-pattern" />
        </div>

        {/* ── IDENTITY CARD (floats over cover) ── */}
        <section className="mp-identity-card">

          {/* LEFT: avatar + thumbnails */}
          <div className="mp-avatar-col">
            <div className="mp-avatar-ring">
              <div className="mp-avatar-inner">
                {profile.photos?.[activePhoto]
                  ? <img src={profile.photos[activePhoto].url} alt="Profile" />
                  : <IconUsers size={52} color="#6B3F69" />
                }
              </div>
              <button
                className="mp-camera-btn"
                onClick={() => navigate("/upload-photos")}
                title="Update photos"
              >
                <IconCamera size={16} />
              </button>
            </div>

            {profile.photos?.length > 1 && (
              <div className="mp-thumbnails">
                {profile.photos.map((p, i) => (
                  <div
                    key={i}
                    className={`mp-thumb ${activePhoto === i ? "active" : ""}`}
                    onClick={() => setActivePhoto(i)}
                  >
                    <img src={p.url} alt={`Photo ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: info */}
          <div className="mp-info-col">

            {/* Name + badges */}
            <div className="mp-name-row">
              <h1>{profile.name}</h1>
              <div className="mp-badge-row">
                {profile.isVerified && (
                  <span className="verified-pill">
                    <IconCheckCircle size={13} color="#2e7d32" /> Verified
                  </span>
                )}
                {profile.isPremium && (
                  <span className="premium-pill">
                    <IconStar size={13} color="#c49a2e" filled /> Premium
                  </span>
                )}
              </div>
            </div>

            {/* Meta pills */}
            <div className="mp-meta-pills">
              <span className="mp-meta-pill">
                <IconHeart size={14} color="#6B3F69" />
                {profile.age} yrs · {profile.height}
              </span>

              {profile.religion && (
                <span className="mp-meta-pill">
                  {/* Om / faith SVG */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="#6B3F69" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {profile.religion}
                </span>
              )}

              {(profile.city || profile.state) && (
                <span className="mp-meta-pill">
                  <IconMapPin size={14} color="#6B3F69" />
                  {formatLocation(profile.city, profile.state)}
                </span>
              )}

              {profile.occupation && (
                <span className="mp-meta-pill">
                  <IconBriefcase size={14} color="#6B3F69" />
                  {profile.occupation}
                </span>
              )}

              {profile.education && (
                <span className="mp-meta-pill">
                  <IconGradCap size={14} color="#6B3F69" />
                  {profile.education}
                </span>
              )}
            </div>

            {/* Bio */}
            <p className="mp-biography">
              {profile.about || "Add a bio to let others know you better."}
            </p>

            {/* Actions */}
            <div className="mp-action-row">
              <button className="mp-btn-primary" onClick={() => navigate("/profile-creation")}>
                <IconEdit size={16} color="#fff" /> Edit Profile
              </button>
              <button className="mp-btn-outline" onClick={() => navigate("/privacy")}>
                <IconLock size={16} color="#6B3F69" /> Privacy Settings
              </button>
            </div>
          </div>
        </section>

        {/* ── DETAILS SECTION ── */}
        <section className="mp-details-section">

          {/* Tab nav */}
          <div className="mp-tabs-nav">
            {tabs.map(t => (
              <button
                key={t.id}
                className={activeTab === t.id ? "active" : ""}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mp-tab-pane">
            {activeTab === "basic" && (
              <div className="details-grid-premium">
                {renderDetail("Marital Status",   profile.maritalStatus)}
                {renderDetail("Body Type",        profile.bodyType)}
                {renderDetail("Complexion",       profile.complexion)}
                {renderDetail("Mother Tongue",    profile.motherTongue)}
                {renderDetail("Weight",           profile.weight)}
                {renderDetail("Physical Status",  profile.physicalStatus)}
              </div>
            )}
            {activeTab === "education" && (
              <div className="details-grid-premium">
                {renderDetail("Education",   profile.education)}
                {renderDetail("Profession",  profile.occupation)}
                {renderDetail("Company",     profile.companyName)}
                {renderDetail("Income",      profile.annualIncome)}
                {renderDetail("Employed In", profile.employedIn)}
              </div>
            )}
            {activeTab === "family" && (
              <div className="details-grid-premium">
                {renderDetail("Family Type",          profile.familyType)}
                {renderDetail("Family Values",        profile.familyValues)}
                {renderDetail("Father's Occupation",  profile.fatherOccupation)}
                {renderDetail("Mother's Occupation",  profile.motherOccupation)}
                {renderDetail("Siblings",             profile.siblings)}
              </div>
            )}
            {activeTab === "horoscope" && (
              <div className="details-grid-premium">
                {renderDetail("Date of Birth",      profile.dob)}
                {renderDetail("Birth Place",        profile.birthPlace)}
                {renderDetail("Manglik",            profile.manglik)}
                {renderDetail("Rashi / Moon Sign",  profile.rashi)}
                {renderDetail("Gotra",              profile.gotra)}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default MyProfile;