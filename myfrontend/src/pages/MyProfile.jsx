import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyProfile.css";

/* ─────────────────────────────────────────
   SVG ICON COMPONENTS
───────────────────────────────────────── */
const IconUsers = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconCamera = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconEdit = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconLock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconCheck = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMapPin = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBriefcase = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
const IconGradCap = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconHeart = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const IconEye = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconChevronLeft = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconTrash = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconCrown = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M5 20l-2-12 7 6 2-8 2 8 7-6-2 12"/>
  </svg>
);
const IconUser = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconHome = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconSun = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconImage = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatDOB = (dob) => {
  if (!dob) return "—";
  return new Date(dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const getPrimaryPhoto = (photos) => {
  if (!photos || photos.length === 0) return null;
  const primary = photos.find(p => p.isPrimary);
  const photo = primary || photos[0];
  if (typeof photo === "string") return photo;
  return photo?.url || null;
};

/* ─────────────────────────────────────────
   PHOTO GALLERY MODAL
───────────────────────────────────────── */
const PhotoGalleryModal = ({ photos, startIndex, onClose, onDelete, onSetPrimary }) => {
  const [current, setCurrent] = useState(startIndex);
  const [deleting, setDeleting] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState(false);

  const prev = () => setCurrent(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrent(i => (i + 1) % photos.length);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(photos[current].publicId);
    setDeleting(false);
    if (photos.length <= 1) { onClose(); return; }
    setCurrent(i => Math.min(i, photos.length - 2));
  };

  const handleSetPrimary = async () => {
    setSettingPrimary(true);
    await onSetPrimary(photos[current].publicId);
    setSettingPrimary(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const photo = photos[current];
  const url = typeof photo === "string" ? photo : photo?.url;
  const isPrimary = photo?.isPrimary;

  return (
    <div className="gallery-modal-backdrop" onClick={onClose}>
      <div className="gallery-modal-box" onClick={e => e.stopPropagation()}>
        <button className="gallery-close" onClick={onClose}>✕</button>
        <div className="gallery-img-wrap">
          {photos.length > 1 && (
            <button className="gallery-nav left" onClick={prev}><IconChevronLeft size={22} color="#fff" /></button>
          )}
          <img src={url} alt="Profile" className="gallery-main-img" />
          {photos.length > 1 && (
            <button className="gallery-nav right" onClick={next}><IconChevronRight size={22} color="#fff" /></button>
          )}
        </div>
        <div className="gallery-actions">
          {!isPrimary && (
            <button className="gallery-action-btn set-primary" onClick={handleSetPrimary} disabled={settingPrimary}>
              {settingPrimary ? "Setting…" : "Set as Primary"}
            </button>
          )}
          {isPrimary && <span className="gallery-primary-badge"><IconCheck size={12} color="#2e7d32" /> Primary Photo</span>}
          <button className="gallery-action-btn delete" onClick={handleDelete} disabled={deleting}>
            <IconTrash size={14} color="#fff" /> {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
        <div className="gallery-counter">{current + 1} / {photos.length}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SECTION COMPONENT
───────────────────────────────────────── */
const ProfileSection = ({ id, icon, title, children }) => (
  <section className="mp-section" id={id}>
    <div className="mp-section-title">
      <span className="mp-section-icon">{icon}</span>
      <h2>{title}</h2>
      <div className="mp-section-line" />
    </div>
    <div className="mp-section-body">
      {children}
    </div>
  </section>
);

/* ─────────────────────────────────────────
   DETAIL ROW COMPONENT
───────────────────────────────────────── */
const DetailRow = ({ label, value }) => (
  <div className="mp-detail-row">
    <span className="mp-detail-label">{label}</span>
    <span className="mp-detail-value">{value || "—"}</span>
  </div>
);

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const [viewers, setViewers] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/profile/me");
      setProfile(res.data.profile);
    } catch (err) {
      console.error("Profile load failed:", err);
      setError("Failed to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchViewers = async () => {
    try {
      const res = await api.get("/profile/viewers");
      setViewers(res.data.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchProfile();
    fetchViewers();
  }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    setUploading(true);
    try {
      await api.post("/profile/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await fetchProfile();
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeletePhoto = async (publicId) => {
    try {
      await api.delete(`/profile/photo/${publicId}`);
      await fetchProfile();
    } catch { alert("Failed to delete photo"); }
  };

  const handleSetPrimary = async (publicId) => {
    try {
      await api.post("/profile/photo/set-primary", { publicId });
      await fetchProfile();
    } catch { alert("Failed to set primary photo"); }
  };

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location not specified";
  };

  if (loading) return (
    <div className="mp-loading">
      <div className="mp-loading-ring" />
      <p>Loading your profile…</p>
    </div>
  );

  if (error || !profile) return (
    <div className="mp-error">
      <p>{error || "Profile not found."}</p>
      <button onClick={fetchProfile}>Retry</button>
    </div>
  );

  const age = calculateAge(profile.dob);
  const primaryPhotoUrl = getPrimaryPhoto(profile.photos);
  const photos = profile.photos || [];
  const displayName = profile.name || profile.fullName || "Member";

  return (
    <div className="my-profile-page">
      <Navbar />

      {/* ── HERO COVER ── */}
      <div className="mp-hero-cover">
        <div className="mp-hero-overlay" />
        <div className="mp-hero-orb mp-hero-orb-1" />
        <div className="mp-hero-orb mp-hero-orb-2" />
      </div>

      <main className="mp-main">

        {/* ── PROFILE HEADER CARD ── */}
        <div className="mp-header-card">
          {/* Avatar */}
          <div className="mp-avatar-wrap">
            <div
              className="mp-avatar"
              onClick={() => { if (photos.length > 0) { setGalleryStart(0); setGalleryOpen(true); } }}
              style={{ cursor: photos.length > 0 ? "pointer" : "default" }}
            >
              {primaryPhotoUrl
                ? <img src={primaryPhotoUrl} alt={displayName} onError={e => { e.target.style.display = "none"; }} />
                : <div className="mp-avatar-placeholder"><IconUsers size={48} color="#6B3F69" /></div>
              }
              {photos.length > 0 && <div className="mp-avatar-count">{photos.length}</div>}
            </div>
            <button
              className="mp-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Add photo"
              disabled={uploading}
            >
              {uploading ? <div className="mp-mini-spinner" /> : <IconCamera size={16} color="#fff" />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
          </div>

          {/* Name + meta */}
          <div className="mp-header-info">
            <div className="mp-name-row">
              <h1 className="mp-name">{displayName}</h1>
              <div className="mp-badges">
                {profile.isVerified && (
                  <span className="mp-badge verified"><IconCheck size={11} color="#fff" /> Verified</span>
                )}
                {profile.isPremium && (
                  <span className="mp-badge premium"><IconCrown size={11} color="#fff" /> Premium</span>
                )}
              </div>
            </div>

            <p className="mp-tagline">
              {age ? `${age} yrs` : ""}
              {age && profile.height ? " · " : ""}
              {profile.height || ""}
              {profile.maritalStatus ? ` · ${profile.maritalStatus}` : ""}
            </p>

            <div className="mp-pills">
              {profile.religion && <span className="mp-pill"><IconHeart size={13} color="#6B3F69" />{profile.religion}</span>}
              {(profile.city || profile.state) && <span className="mp-pill"><IconMapPin size={13} color="#6B3F69" />{formatLocation(profile.city, profile.state)}</span>}
              {profile.occupation && <span className="mp-pill"><IconBriefcase size={13} color="#6B3F69" />{profile.occupation}</span>}
              {profile.education && <span className="mp-pill"><IconGradCap size={13} color="#6B3F69" />{profile.education}</span>}
            </div>

            <div className="mp-stat-strip">
              <div className="mp-stat">
                <span className="mp-stat-number">{photos.length}</span>
                <span className="mp-stat-label">Photos</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat">
                <span className="mp-stat-number">{viewers.length}</span>
                <span className="mp-stat-label">Profile Views</span>
              </div>
              <div className="mp-stat-divider" />
              <div className="mp-stat">
                <span className="mp-stat-number">{profile.profileComplete || "—"}</span>
                <span className="mp-stat-label">% Complete</span>
              </div>
            </div>

            <div className="mp-actions">
              <button className="mp-btn-primary" onClick={() => navigate("/profile-creation")}>
                <IconEdit size={15} color="#fff" /> Edit Profile
              </button>
              <button className="mp-btn-ghost" onClick={() => navigate("/privacy")}>
                <IconLock size={15} color="#6B3F69" /> Privacy
              </button>
            </div>
          </div>
        </div>

        {/* ── SINGLE PAGE CONTENT ── */}
        <div className="mp-page-content">

          {/* Bio Section */}
          {(profile.about || true) && (
            <ProfileSection id="about" icon={<IconUser size={18} color="#6B3F69" />} title="About Me">
              {profile.about
                ? <p className="mp-bio-text">{profile.about}</p>
                : <p className="mp-bio-empty">
                    No bio added yet.{" "}
                    <span className="mp-bio-link" onClick={() => navigate("/profile-creation")}>Add one →</span>
                  </p>
              }
            </ProfileSection>
          )}

          {/* General Info */}
          <ProfileSection id="basic" icon={<IconUser size={18} color="#6B3F69" />} title="General Information">
            <div className="mp-details-grid">
              <DetailRow label="Marital Status"  value={profile.maritalStatus} />
              <DetailRow label="Date of Birth"   value={formatDOB(profile.dob)} />
              <DetailRow label="Height"          value={profile.height} />
              <DetailRow label="Weight"          value={profile.weight} />
              <DetailRow label="Body Type"       value={profile.bodyType} />
              <DetailRow label="Complexion"      value={profile.complexion} />
              <DetailRow label="Mother Tongue"   value={profile.motherTongue} />
              <DetailRow label="Physical Status" value={profile.physicalStatus} />
              <DetailRow label="Diet"            value={profile.diet} />
              <DetailRow label="Drinking"        value={profile.drinking} />
              <DetailRow label="Smoking"         value={profile.smoking} />
            </div>
          </ProfileSection>

          {/* Career & Education */}
          <ProfileSection id="education" icon={<IconBriefcase size={18} color="#6B3F69" />} title="Career & Education">
            <div className="mp-details-grid">
              <DetailRow label="Education"     value={profile.education} />
              <DetailRow label="Profession"    value={profile.occupation} />
              <DetailRow label="Company"       value={profile.companyName} />
              <DetailRow label="Employed In"   value={profile.employedIn} />
              <DetailRow label="Annual Income" value={profile.annualIncome} />
              <DetailRow label="Work Location" value={profile.workLocation} />
            </div>
          </ProfileSection>

          {/* Family */}
          <ProfileSection id="family" icon={<IconHome size={18} color="#6B3F69" />} title="Family Details">
            <div className="mp-details-grid">
              <DetailRow label="Family Type"         value={profile.familyType} />
              <DetailRow label="Family Values"       value={profile.familyValues} />
              <DetailRow label="Family Status"       value={profile.familyStatus} />
              <DetailRow label="Father's Occupation" value={profile.fatherOccupation} />
              <DetailRow label="Mother's Occupation" value={profile.motherOccupation} />
              <DetailRow label="Siblings"            value={profile.siblings} />
              <DetailRow label="Living With Family"  value={profile.livingWithFamily} />
            </div>
          </ProfileSection>

          {/* Faith & Horoscope */}
          <ProfileSection id="horoscope" icon={<IconSun size={18} color="#6B3F69" />} title="Faith & Horoscope">
            <div className="mp-details-grid">
              <DetailRow label="Date of Birth" value={formatDOB(profile.dob)} />
              <DetailRow label="Birth Place"   value={profile.birthPlace} />
              <DetailRow label="Birth Time"    value={profile.birthTime} />
              <DetailRow label="Manglik"       value={profile.manglik} />
              <DetailRow label="Rashi"         value={profile.rashi} />
              <DetailRow label="Nakshatra"     value={profile.nakshatra} />
              <DetailRow label="Gotra"         value={profile.gotra} />
            </div>
          </ProfileSection>

          {/* Photos */}
          <ProfileSection id="photos" icon={<IconImage size={18} color="#6B3F69" />} title="Photos">
            <div className="mp-photos-grid">
              {photos.map((p, i) => {
                const url = typeof p === "string" ? p : p?.url;
                return (
                  <div
                    key={i}
                    className={`mp-photo-cell ${p.isPrimary ? "primary" : ""}`}
                    onClick={() => { setGalleryStart(i); setGalleryOpen(true); }}
                  >
                    <img src={url} alt={`Photo ${i + 1}`} />
                    {p.isPrimary && <div className="mp-photo-primary-label">Primary</div>}
                    <div className="mp-photo-hover-overlay">
                      <IconEye size={20} color="#fff" />
                    </div>
                  </div>
                );
              })}

              {photos.length < 10 && (
                <div className="mp-photo-add-cell" onClick={() => fileInputRef.current?.click()}>
                  <IconCamera size={28} color="#6B3F69" />
                  <span>Add Photo</span>
                  <span className="mp-photo-add-count">{photos.length}/10</span>
                </div>
              )}

              {photos.length === 0 && (
                <div className="mp-photos-empty">
                  <IconCamera size={40} color="#c9a0dc" />
                  <p>No photos yet</p>
                  <button onClick={() => fileInputRef.current?.click()}>Upload Your First Photo</button>
                </div>
              )}
            </div>
          </ProfileSection>

          {/* Profile Viewers */}
          {viewers.length > 0 && (
            <ProfileSection id="viewers" icon={<IconEye size={18} color="#6B3F69" />} title="Recent Profile Views">
              <div className="mp-viewers-list">
                {viewers.slice(0, 8).map((v, i) => {
                  const vp = getPrimaryPhoto(v.userId?.photos);
                  return (
                    <div
                      key={i}
                      className="mp-viewer-chip"
                      onClick={() => navigate(`/profile/${v.userId?._id}`)}
                      title={v.userId?.name || "Member"}
                    >
                      <div className="mp-viewer-avatar">
                        {vp
                          ? <img src={vp} alt={v.userId?.name} />
                          : <IconUsers size={18} color="#6B3F69" />
                        }
                      </div>
                      <div className="mp-viewer-info">
                        <span className="mp-viewer-name">{v.userId?.name || "Member"}</span>
                        <span className="mp-viewer-city">{v.userId?.city || ""}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ProfileSection>
          )}

        </div>
      </main>

      <Footer />

      {galleryOpen && photos.length > 0 && (
        <PhotoGalleryModal
          photos={photos}
          startIndex={galleryStart}
          onClose={() => setGalleryOpen(false)}
          onDelete={handleDeletePhoto}
          onSetPrimary={handleSetPrimary}
        />
      )}
    </div>
  );
};

export default MyProfile;