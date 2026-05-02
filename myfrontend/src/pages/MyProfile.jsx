import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./MyProfile.css";

<<<<<<< HEAD
/* ─────────────────────────────────────────
   SVG ICON COMPONENTS
───────────────────────────────────────── */
const IconUsers = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconCamera = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconEdit = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconLock = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconCheck = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconStar = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconMapPin = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconBriefcase = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const IconGradCap = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const IconHeart = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconEye = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconChevronLeft = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconChevronRight = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconTrash = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconCrown = ({ size = 13, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M5 20l-2-12 7 6 2-8 2 8 7-6-2 12" />
  </svg>
);
const IconFileText = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconUpload = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
=======
const IconCamera   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconEdit     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconLock     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconCheck    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconMapPin   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconBag      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconEye      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconChevL    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IconChevR    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconTrash    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconCrown    = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M5 20l-2-12 7 6 2-8 2 8 7-6-2 12"/></svg>;
const IconUser     = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconHeart    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
>>>>>>> f2612df3af43531b8aec92fdc497c8e6896db5b5

const calculateAge = (dob) => {
  if (!dob) return null;
  const today = new Date(), birth = new Date(dob);
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
  const p = photos.find(p => p.isPrimary) || photos[0];
  return typeof p === "string" ? p : p?.url || null;
};

const PhotoGalleryModal = ({ photos, startIndex, onClose, onDelete, onSetPrimary }) => {
  const [current, setCurrent] = useState(startIndex);
  const [deleting, setDeleting] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent(i => (i - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight") setCurrent(i => (i + 1) % photos.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const photo = photos[current];
  const url = typeof photo === "string" ? photo : photo?.url;
  return (
    <div className="gm-backdrop" onClick={onClose}>
      <div className="gm-box" onClick={e => e.stopPropagation()}>
        <button className="gm-close" onClick={onClose}>✕</button>
        <div className="gm-img-wrap">
          {photos.length > 1 && <button className="gm-nav gm-left" onClick={() => setCurrent(i => (i - 1 + photos.length) % photos.length)}><IconChevL /></button>}
          <img src={url} alt="Profile" className="gm-img" />
          {photos.length > 1 && <button className="gm-nav gm-right" onClick={() => setCurrent(i => (i + 1) % photos.length)}><IconChevR /></button>}
        </div>
        <div className="gm-footer">
          {!photo?.isPrimary && (
            <button className="gm-btn gm-primary-btn" onClick={async () => { setSettingPrimary(true); await onSetPrimary(photo.publicId); setSettingPrimary(false); }} disabled={settingPrimary}>
              {settingPrimary ? "Setting…" : "Set as Primary"}
            </button>
          )}
          {photo?.isPrimary && <span className="gm-badge"><IconCheck /> Primary</span>}
          <button className="gm-btn gm-del-btn" onClick={async () => { setDeleting(true); await onDelete(photo.publicId); setDeleting(false); if (photos.length <= 1) onClose(); else setCurrent(i => Math.min(i, photos.length - 2)); }} disabled={deleting}>
            <IconTrash /> {deleting ? "Deleting…" : "Delete"}
          </button>
          <span className="gm-counter">{current + 1} / {photos.length}</span>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}</span>
    <span className="info-value">{value || "—"}</span>
  </div>
);

const MyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const [viewers, setViewers] = useState([]);
  const [activeTab, setActiveTab] = useState("about");
  const fileInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  const fetchProfile = async () => {
    try { setLoading(true); const res = await api.get("/profile/me"); setProfile(res.data.profile); }
    catch { setError("Failed to load your profile."); }
    finally { setLoading(false); }
  };
  const fetchViewers = async () => {
<<<<<<< HEAD
    try {
      const res = await api.get("/profile/viewers");
      setViewers(res.data.data || []);
    } catch { }
=======
    try { const res = await api.get("/profile/viewers"); setViewers(res.data.data || []); } catch {}
>>>>>>> f2612df3af43531b8aec92fdc497c8e6896db5b5
  };
  useEffect(() => { fetchProfile(); fetchViewers(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("photo", file);
    setUploading(true);
    try { await api.post("/profile/photo", fd, { headers: { "Content-Type": "multipart/form-data" } }); await fetchProfile(); }
    catch (err) { alert(err?.response?.data?.message || "Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };
  const handleDeletePhoto = async (id) => { try { await api.delete(`/profile/photo/${id}`); await fetchProfile(); } catch { alert("Delete failed"); } };
  const handleSetPrimary  = async (id) => { try { await api.post("/profile/photo/set-primary", { publicId: id }); await fetchProfile(); } catch { alert("Failed"); } };

<<<<<<< HEAD
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

  /* ── CV handlers ── */
  const handleCvSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB.");
      e.target.value = "";
      return;
    }
    setCvFile(file);
  };

  const handleCvUpload = async () => {
    if (!cvFile) return;
    setUploadingCv(true);
    try {
      const fd = new FormData();
      fd.append("cvFile", cvFile);
      const res = await api.post("/profile/cv", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        setCvFile(null);
        if (cvInputRef.current) cvInputRef.current.value = "";
        await fetchProfile();
        alert("CV uploaded successfully!");
      }
    } catch (err) {
      console.error("CV Upload Failed", err);
      alert(err?.response?.data?.message || "Failed to upload CV.");
    } finally {
      setUploadingCv(false);
    }
  };

  /* ── Render helpers ── */
  const renderDetail = (label, value) => (
    <div className="mp-detail-row" key={label}>
      <span className="mp-detail-label">{label}</span>
      <span className="mp-detail-value">{value || "—"}</span>
    </div>
  );

  const formatLocation = (city, state) => {
    if (city && state) return `${city}, ${state}`;
    return city || state || "Location not specified";
  };

  /* ── States ── */
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
=======
  if (loading) return <div className="mp-loading"><div className="mp-spinner" /><p>Loading your profile…</p></div>;
  if (error || !profile) return <div className="mp-error"><p>{error || "Profile not found."}</p><button onClick={fetchProfile}>Retry</button></div>;
>>>>>>> f2612df3af43531b8aec92fdc497c8e6896db5b5

  const age = calculateAge(profile.dob);
  const photos = profile.photos || [];
  const primaryPhotoUrl = getPrimaryPhoto(photos);
  const displayName = profile.name || profile.fullName || "Member";
  const location = [profile.city, profile.state].filter(Boolean).join(", ") || null;

  const tabs = [
<<<<<<< HEAD
    { id: "basic", label: "General" },
    { id: "education", label: "Career" },
    { id: "family", label: "Family" },
    { id: "horoscope", label: "Faith" },
    { id: "photos", label: "Photos" },
=======
    { id: "about",  label: "About"   },
    { id: "career", label: "Career"  },
    { id: "family", label: "Family"  },
    { id: "faith",  label: "Faith"   },
    { id: "photos", label: "Photos"  },
>>>>>>> f2612df3af43531b8aec92fdc497c8e6896db5b5
  ];

  return (
    <div className="mp-page">
      <Navbar />

      <div className="mp-wrapper">
        <div className="mp-layout">

          {/* ────────── LEFT SIDEBAR ────────── */}
          <aside className="mp-sidebar">

            {/* Main photo */}
            <div className="sidebar-photo-card">
              <div
                className="sidebar-photo"
                onClick={() => photos.length > 0 && (setGalleryStart(0), setGalleryOpen(true))}
                style={{ cursor: photos.length > 0 ? "pointer" : "default" }}
              >
                {primaryPhotoUrl
                  ? <img src={primaryPhotoUrl} alt={displayName} />
                  : <div className="sidebar-photo-placeholder"><IconUser /></div>
                }
                <button
                  className="sidebar-upload-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  disabled={uploading}
                  title="Upload photo"
                >
                  {uploading ? <div className="mini-spin" /> : <IconCamera />}
                </button>
                {photos.length > 1 && <div className="photo-badge">{photos.length}</div>}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />

<<<<<<< HEAD
              {/* Upload button */}
              <button
                className="mp-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Add photo"
                disabled={uploading}
              >
                {uploading ? <div className="mp-mini-spinner" /> : <IconCamera size={16} color="#fff" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
            </div>

            {/* Thumbnail strip */}
            {photos.length > 1 && (
              <div className="mp-thumb-strip">
                {photos.slice(0, 5).map((p, i) => {
                  const url = typeof p === "string" ? p : p?.url;
                  return (
                    <div
                      key={i}
                      className={`mp-thumb-item ${p.isPrimary ? "is-primary" : ""}`}
                      onClick={() => { setGalleryStart(i); setGalleryOpen(true); }}
                    >
                      <img src={url} alt={`Photo ${i + 1}`} />
                      {p.isPrimary && <div className="mp-thumb-primary-dot" />}
                    </div>
                  );
                })}
                {photos.length > 5 && (
                  <div className="mp-thumb-more" onClick={() => { setGalleryStart(5); setGalleryOpen(true); }}>
                    +{photos.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile info */}
          <div className="mp-profile-info">
            <div className="mp-name-row">
              <h1 className="mp-name">{displayName}</h1>
              <div className="mp-badges">
                {profile.isVerified && (
                  <span className="mp-badge verified">
                    <IconCheck size={11} color="#fff" /> Verified
                  </span>
                )}
                {profile.isPremium && (
                  <span className="mp-badge premium">
                    <IconCrown size={11} color="#fff" /> Premium
                  </span>
                )}
              </div>
            </div>

            {/* Sub-line */}
            <p className="mp-tagline">
              {age ? `${age} yrs` : ""}
              {age && profile.height ? " · " : ""}
              {profile.height || ""}
              {profile.maritalStatus ? ` · ${profile.maritalStatus}` : ""}
            </p>

            {/* Pills */}
            <div className="mp-pills">
              {profile.religion && (
                <span className="mp-pill"><IconHeart size={13} color="#6B3F69" />{profile.religion}</span>
              )}
              {(profile.city || profile.state) && (
                <span className="mp-pill"><IconMapPin size={13} color="#6B3F69" />{formatLocation(profile.city, profile.state)}</span>
              )}
              {profile.occupation && (
                <span className="mp-pill"><IconBriefcase size={13} color="#6B3F69" />{profile.occupation}</span>
              )}
              {profile.education && (
                <span className="mp-pill"><IconGradCap size={13} color="#6B3F69" />{profile.education}</span>
              )}
            </div>

            {/* Bio */}
            {profile.about && (
              <p className="mp-bio">{profile.about}</p>
            )}
            {!profile.about && (
              <p className="mp-bio mp-bio-empty">
                No bio added yet.{" "}
                <span className="mp-bio-link" onClick={() => navigate("/profile-creation")}>Add one →</span>
              </p>
            )}

            {/* Stat strip */}
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

            {/* Action buttons */}
            <div className="mp-actions">
              <button className="mp-btn-primary" onClick={() => navigate("/profile-creation")}>
                <IconEdit size={15} color="#fff" /> Edit Profile
              </button>
              <button className="mp-btn-ghost" onClick={() => navigate("/privacy")}>
                <IconLock size={15} color="#6B3F69" /> Privacy
              </button>
            </div>
          </div>
        </section>

        {/* ── DETAILS CARD ── */}
        <section className="mp-details-card">
          <div className="mp-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`mp-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mp-tab-body">

            {activeTab === "basic" && (
              <div className="mp-details-grid">
                {renderDetail("Marital Status", profile.maritalStatus)}
                {renderDetail("Date of Birth", formatDOB(profile.dob))}
                {renderDetail("Height", profile.height)}
                {renderDetail("Weight", profile.weight)}
                {renderDetail("Body Type", profile.bodyType)}
                {renderDetail("Complexion", profile.complexion)}
                {renderDetail("Mother Tongue", profile.motherTongue)}
                {renderDetail("Physical Status", profile.physicalStatus)}
                {renderDetail("Diet", profile.diet)}
                {renderDetail("Drinking", profile.drinking)}
                {renderDetail("Smoking", profile.smoking)}
              </div>
            )}

            {activeTab === "education" && (
              <>
                <div className="mp-details-grid">
                  {renderDetail("Education", profile.education)}
                  {renderDetail("Profession", profile.occupation)}
                  {renderDetail("Company", profile.companyName)}
                  {renderDetail("Employed In", profile.employedIn)}
                  {renderDetail("Annual Income", profile.annualIncome)}
                  {renderDetail("Work Location", profile.workLocation)}
                </div>

                {/* ── CV SECTION ── */}
                <div className="mp-cv-section">
                  <div className="mp-cv-header">
                    <IconFileText size={16} color="#6B3F69" />
                    <h4>CV / Resume</h4>
                  </div>

                  {profile.cvUrl ? (
                    <div className="mp-cv-uploaded">
                      <div className="mp-cv-file-info">
                        <IconFileText size={24} color="#6B3F69" />
                        <div>
                          <span className="mp-cv-filename">Resume uploaded</span>
                          <span className="mp-cv-status">✓ Available</span>
                        </div>
                      </div>
                      <div className="mp-cv-actions">
                        <a
                          href={profile.cvUrl.startsWith('http') ? profile.cvUrl : profile.cvUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mp-cv-view-btn"
                        >
                          <IconEye size={14} color="#fff" /> View CV
                        </a>
                        <button
                          className="mp-cv-replace-btn"
                          onClick={() => cvInputRef.current?.click()}
                        >
                          <IconUpload size={14} color="#6B3F69" /> Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mp-cv-empty">
                      <IconFileText size={32} color="#c9a0dc" />
                      <p>No CV uploaded yet</p>
                      <button
                        className="mp-cv-upload-btn"
                        onClick={() => cvInputRef.current?.click()}
                      >
                        <IconUpload size={15} color="#fff" /> Upload CV
                      </button>
                    </div>
                  )}

                  {/* Hidden file input for CV */}
                  <input
                    ref={cvInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleCvSelect}
                  />

                  {/* Show selected file + upload button */}
                  {cvFile && (
                    <div className="mp-cv-pending">
                      <span className="mp-cv-pending-name">{cvFile.name}</span>
                      <button
                        className="mp-cv-upload-now-btn"
                        onClick={handleCvUpload}
                        disabled={uploadingCv}
                      >
                        {uploadingCv ? "Uploading…" : "Upload Now"}
                      </button>
                      <button
                        className="mp-cv-cancel-btn"
                        onClick={() => { setCvFile(null); if (cvInputRef.current) cvInputRef.current.value = ""; }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "family" && (
              <div className="mp-details-grid">
                {renderDetail("Family Type", profile.familyType)}
                {renderDetail("Family Values", profile.familyValues)}
                {renderDetail("Family Status", profile.familyStatus)}
                {renderDetail("Father's Occupation", profile.fatherOccupation)}
                {renderDetail("Mother's Occupation", profile.motherOccupation)}
                {renderDetail("Siblings", profile.siblings)}
                {renderDetail("Living With Family", profile.livingWithFamily)}
              </div>
            )}

            {activeTab === "horoscope" && (
              <div className="mp-details-grid">
                {renderDetail("Date of Birth", formatDOB(profile.dob))}
                {renderDetail("Birth Place", profile.birthPlace)}
                {renderDetail("Birth Time", profile.birthTime)}
                {renderDetail("Manglik", profile.manglik)}
                {renderDetail("Rashi", profile.rashi)}
                {renderDetail("Nakshatra", profile.nakshatra)}
                {renderDetail("Gotra", profile.gotra)}
              </div>
            )}

            {activeTab === "photos" && (
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
=======
              {photos.length > 1 && (
                <div className="thumb-row">
                  {photos.slice(0, 4).map((p, i) => {
                    const u = typeof p === "string" ? p : p?.url;
                    return (
                      <div key={i} className={`thumb ${p.isPrimary ? "thumb-active" : ""}`} onClick={() => { setGalleryStart(i); setGalleryOpen(true); }}>
                        <img src={u} alt="" />
>>>>>>> f2612df3af43531b8aec92fdc497c8e6896db5b5
                      </div>
                    );
                  })}
                  {photos.length > 4 && (
                    <div className="thumb thumb-more" onClick={() => { setGalleryStart(4); setGalleryOpen(true); }}>
                      +{photos.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick facts */}
            <div className="sidebar-card">
              <div className="sb-section-label">QUICK INFO</div>
              {profile.occupation && <div className="sb-row"><IconBag /><span>{profile.occupation}</span></div>}
              {profile.companyName && <div className="sb-row"><span className="sb-dot" /><span>{profile.companyName}</span></div>}
              {location && <div className="sb-row"><IconMapPin /><span>{location}</span></div>}
              {profile.religion && <div className="sb-row"><IconHeart /><span>{profile.religion}</span></div>}
              {profile.maritalStatus && <div className="sb-row"><span className="sb-dot" /><span>{profile.maritalStatus}</span></div>}
              {profile.education && <div className="sb-row"><span className="sb-dot" /><span>{profile.education}</span></div>}
            </div>

            {/* Stats */}
            <div className="sidebar-card sidebar-stats">
              <div className="stat-block">
                <span className="stat-num">{photos.length}</span>
                <span className="stat-lbl">Photos</span>
              </div>
              <div className="stat-sep" />
              <div className="stat-block">
                <span className="stat-num">{viewers.length}</span>
                <span className="stat-lbl">Views</span>
              </div>
              <div className="stat-sep" />
              <div className="stat-block">
                <span className="stat-num">{profile.profileComplete || 0}<small>%</small></span>
                <span className="stat-lbl">Done</span>
              </div>
            </div>

            {/* Viewers */}
            {viewers.length > 0 && (
              <div className="sidebar-card">
                <div className="sb-section-label">RECENT VIEWERS</div>
                <div className="viewer-list">
                  {viewers.slice(0, 5).map((v, i) => {
                    const vp = getPrimaryPhoto(v.userId?.photos);
                    return (
                      <div key={i} className="viewer-item" onClick={() => navigate(`/profile/${v.userId?._id}`)}>
                        <div className="viewer-av">
                          {vp ? <img src={vp} alt="" /> : <span>{(v.userId?.name || "M")[0].toUpperCase()}</span>}
                        </div>
                        <div className="viewer-info">
                          <span className="viewer-name">{v.userId?.name || "Member"}</span>
                          {v.userId?.city && <span className="viewer-city">{v.userId.city}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </aside>

          {/* ────────── RIGHT MAIN ────────── */}
          <div className="mp-main">

            {/* Profile header */}
            <div className="profile-header-card">
              <div className="ph-top">
                <div>
                  <div className="ph-name-row">
                    <h1 className="ph-name">{displayName}</h1>
                    {age && <span className="ph-age">{age} yrs</span>}
                  </div>
                  {profile.occupation && (
                    <p className="ph-role">{profile.occupation}{profile.companyName ? <span className="ph-company"> · {profile.companyName}</span> : ""}</p>
                  )}
                  {location && <p className="ph-location"><IconMapPin /> {location}</p>}
                  <div className="ph-badges">
                    {profile.isVerified && <span className="badge-verified"><IconCheck /> Verified</span>}
                    {profile.isPremium && <span className="badge-premium"><IconCrown /> Premium</span>}
                    {profile.height && <span className="badge-info">{profile.height}</span>}
                    {profile.maritalStatus && <span className="badge-info">{profile.maritalStatus}</span>}
                    {profile.religion && <span className="badge-info">{profile.religion}</span>}
                  </div>
                </div>
                <div className="ph-actions">
                  <button className="btn-primary" onClick={() => navigate("/profile-creation")}><IconEdit /> Edit Profile</button>
                  <button className="btn-ghost" onClick={() => navigate("/privacy")}><IconLock /> Privacy</button>
                </div>
              </div>

              {/* Tab nav — exactly like the reference */}
              <div className="tab-nav">
                {tabs.map(t => (
                  <button key={t.id} className={`tab-btn ${activeTab === t.id ? "tab-active" : ""}`} onClick={() => setActiveTab(t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="tab-content">

              {activeTab === "about" && (
                <>
                  {/* About */}
                  <div className="content-block">
                    <div className="block-label">ABOUT ME</div>
                    {profile.about
                      ? <p className="about-text">{profile.about}</p>
                      : <p className="about-empty">No bio added yet. <span className="add-link" onClick={() => navigate("/profile-creation")}>Add one →</span></p>
                    }
                  </div>

                  {/* Basic info */}
                  <div className="content-block">
                    <div className="block-label">BASIC INFORMATION</div>
                    <div className="info-table">
                      <InfoRow label="Date of Birth"   value={formatDOB(profile.dob)} />
                      <InfoRow label="Age"             value={age ? `${age} years` : null} />
                      <InfoRow label="Height"          value={profile.height} />
                      <InfoRow label="Weight"          value={profile.weight} />
                      <InfoRow label="Marital Status"  value={profile.maritalStatus} />
                      <InfoRow label="Mother Tongue"   value={profile.motherTongue} />
                      <InfoRow label="Body Type"       value={profile.bodyType} />
                      <InfoRow label="Complexion"      value={profile.complexion} />
                      <InfoRow label="Physical Status" value={profile.physicalStatus} />
                      <InfoRow label="Diet"            value={profile.diet} />
                      <InfoRow label="Drinking"        value={profile.drinking} />
                      <InfoRow label="Smoking"         value={profile.smoking} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "career" && (
                <div className="content-block">
                  <div className="block-label">CAREER & EDUCATION</div>
                  <div className="info-table">
                    <InfoRow label="Education"     value={profile.education} />
                    <InfoRow label="Profession"    value={profile.occupation} />
                    <InfoRow label="Company"       value={profile.companyName} />
                    <InfoRow label="Employed In"   value={profile.employedIn} />
                    <InfoRow label="Annual Income" value={profile.annualIncome} />
                    <InfoRow label="Work Location" value={profile.workLocation} />
                  </div>
                </div>
              )}

              {activeTab === "family" && (
                <div className="content-block">
                  <div className="block-label">FAMILY DETAILS</div>
                  <div className="info-table">
                    <InfoRow label="Family Type"         value={profile.familyType} />
                    <InfoRow label="Family Values"       value={profile.familyValues} />
                    <InfoRow label="Family Status"       value={profile.familyStatus} />
                    <InfoRow label="Father's Occupation" value={profile.fatherOccupation} />
                    <InfoRow label="Mother's Occupation" value={profile.motherOccupation} />
                    <InfoRow label="Siblings"            value={profile.siblings} />
                    <InfoRow label="Living With Family"  value={profile.livingWithFamily} />
                  </div>
                </div>
              )}

              {activeTab === "faith" && (
                <div className="content-block">
                  <div className="block-label">FAITH & HOROSCOPE</div>
                  <div className="info-table">
                    <InfoRow label="Religion"      value={profile.religion} />
                    <InfoRow label="Date of Birth" value={formatDOB(profile.dob)} />
                    <InfoRow label="Birth Place"   value={profile.birthPlace} />
                    <InfoRow label="Birth Time"    value={profile.birthTime} />
                    <InfoRow label="Manglik"       value={profile.manglik} />
                    <InfoRow label="Rashi"         value={profile.rashi} />
                    <InfoRow label="Nakshatra"     value={profile.nakshatra} />
                    <InfoRow label="Gotra"         value={profile.gotra} />
                  </div>
                </div>
              )}

              {activeTab === "photos" && (
                <div className="content-block">
                  <div className="block-label">PHOTOS</div>
                  <div className="photos-grid">
                    {photos.map((p, i) => {
                      const u = typeof p === "string" ? p : p?.url;
                      return (
                        <div key={i} className={`photo-cell ${p.isPrimary ? "photo-primary" : ""}`} onClick={() => { setGalleryStart(i); setGalleryOpen(true); }}>
                          <img src={u} alt={`Photo ${i + 1}`} />
                          {p.isPrimary && <div className="photo-primary-tag">Primary</div>}
                          <div className="photo-hover"><IconEye /></div>
                        </div>
                      );
                    })}
                    {photos.length < 10 && (
                      <div className="photo-add" onClick={() => fileInputRef.current?.click()}>
                        <IconCamera />
                        <span>Add Photo</span>
                        <span className="photo-add-count">{photos.length}/10</span>
                      </div>
                    )}
                    {photos.length === 0 && (
                      <div className="photos-empty">
                        <p>No photos yet</p>
                        <button onClick={() => fileInputRef.current?.click()}>Upload First Photo</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />

      {galleryOpen && photos.length > 0 && (
        <PhotoGalleryModal photos={photos} startIndex={galleryStart} onClose={() => setGalleryOpen(false)} onDelete={handleDeletePhoto} onSetPrimary={handleSetPrimary} />
      )}
    </div>
  );
};

export default MyProfile;