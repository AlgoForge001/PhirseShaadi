import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, X, Star, Heart, ChevronRight, Image
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./UploadPhotos.css";

const UploadPhotos = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── HANDLE FILE SELECT ──
  const handleFiles = (files) => {
    setError("");
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const newPhotos = [];

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        setError("Only JPG, PNG and WEBP images are allowed.");
        return;
      }
      if (file.size > maxSize) {
        setError("Each photo must be under 5MB.");
        return;
      }
      if (photos.length + newPhotos.length >= 10) {
        setError("Maximum 10 photos allowed.");
        return;
      }

      const preview = URL.createObjectURL(file);
      newPhotos.push({
        file,
        preview,
        publicId: null,   // will be set after upload
        uploaded: false,
        uploading: false,
      });
    });

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  // ── DRAG & DROP ──
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  // ── DELETE PHOTO ──
  const handleDelete = async (index) => {
    const photo = photos[index];

    // If already uploaded to backend, delete from server
    if (photo.publicId) {
      try {
        // TODO [BACKEND]: DELETE /api/profile/photo/:publicId
        // Headers: { Authorization: Bearer token }
        await api.delete(
          `/profile/photo/${photo.publicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        setError("Failed to delete photo. Please try again.");
        return;
      }
    }

    // Remove from local state
    const updated = photos.filter((_, i) => i !== index);
    setPhotos(updated);

    // Fix primary index if needed
    if (primaryIndex >= updated.length) {
      setPrimaryIndex(0);
    } else if (primaryIndex === index) {
      setPrimaryIndex(0);
    }
  };

  // ── SET PRIMARY ──
  const handleSetPrimary = (index) => {
    setPrimaryIndex(index);
  };

  // ── UPLOAD SINGLE PHOTO ──
  const uploadPhoto = async (photo, index) => {
    if (photo.uploaded) return photo; // already uploaded

    const formData = new FormData();
    formData.append("photo", photo.file);

    setUploadingIndex(index);

    try {
      // TODO [BACKEND]: POST /api/profile/photo
      // Headers: { Authorization: Bearer token, Content-Type: multipart/form-data }
      // Response: { success: true, publicId: "...", url: "..." }
      const res = await api.post(
        "/profile/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        ...photo,
        publicId: res.data.publicId,
        url: res.data.url,
        uploaded: true,
      };
    } catch (err) {
      throw new Error(`Failed to upload photo ${index + 1}`);
    } finally {
      setUploadingIndex(null);
    }
  };

  // ── SAVE ALL PHOTOS ──
  const handleSave = async () => {
    if (photos.length === 0) {
      setError("Please add at least one photo.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Upload all photos one by one
      const uploadedPhotos = [];
      for (let i = 0; i < photos.length; i++) {
        const uploaded = await uploadPhoto(photos[i], i);
        uploadedPhotos.push(uploaded);
      }

      setPhotos(uploadedPhotos);

      // TODO [BACKEND]: POST /api/profile/photo/set-primary
      // Body: { publicId: uploadedPhotos[primaryIndex].publicId }
      // Headers: { Authorization: Bearer token }
      await api.post(
        "/profile/photo/set-primary",
        { publicId: uploadedPhotos[primaryIndex].publicId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg("Photos saved successfully!");

      // Navigate to next step after 1.5s
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      {/* LEFT PANEL */}
      <div className="upload-left">
        <div className="upload-left-content">
          <div className="upload-logo" onClick={() => navigate("/")}>
            <Heart size={22} fill="#fff" color="#fff" />
            <span>PhirseShaadi</span>
          </div>

          <div className="upload-left-icon">
            <Image size={64} color="rgba(255,255,255,0.9)" />
          </div>

          <h2>Add Your Photos</h2>
          <p>Profiles with photos get 10x more responses. Add your best photos to attract the right matches.</p>

          <div className="upload-tips">
            <h4>Photo Tips</h4>
            <ul>
              <li>Use clear, well-lit photos</li>
              <li>Face should be clearly visible</li>
              <li>Avoid group photos as primary</li>
              <li>Recent photos work best</li>
              <li>Max 10 photos, 5MB each</li>
            </ul>
          </div>

          {/* PROGRESS */}
          <div className="upload-progress-steps">
            <div className="up-step done">1. Basic Info</div>
            <div className="up-step done">2. Personal Details</div>
            <div className="up-step active">3. Upload Photos</div>
            <div className="up-step">4. Complete Profile</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="upload-right">
        <div className="upload-form-wrap">

          <h2 className="upload-title">Upload Your Photos</h2>
          <p className="upload-subtitle">
            Add up to 10 photos. Click the <Star size={14} color="#6B3F69" /> to set your primary photo.
          </p>

          {/* DRAG & DROP AREA */}
          <div
            className={`drop-zone ${dragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              multiple
              onChange={handleInputChange}
              hidden
            />
            <Upload size={36} color="#A376A2" />
            <h3>Click to upload or drag photos here</h3>
            <p>JPG, PNG, WEBP • Max 5MB each • Up to 10 photos</p>
          </div>

          {/* PHOTO GRID */}
          {photos.length > 0 && (
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`photo-thumb ${primaryIndex === index ? "primary" : ""} ${uploadingIndex === index ? "uploading" : ""}`}
                >
                  {/* PHOTO IMAGE */}
                  <img src={photo.preview} alt={`Photo ${index + 1}`} />

                  {/* UPLOADING OVERLAY */}
                  {uploadingIndex === index && (
                    <div className="thumb-uploading">
                      <span className="spinner-dark" />
                    </div>
                  )}

                  {/* PRIMARY BADGE */}
                  {primaryIndex === index && (
                    <div className="primary-badge">Primary</div>
                  )}

                  {/* ACTIONS */}
                  <div className="thumb-actions">
                    {/* SET PRIMARY */}
                    <button
                      className={`thumb-star ${primaryIndex === index ? "active" : ""}`}
                      onClick={() => handleSetPrimary(index)}
                      title="Set as primary photo"
                    >
                      <Star
                        size={15}
                        fill={primaryIndex === index ? "#f59e0b" : "none"}
                        color={primaryIndex === index ? "#f59e0b" : "white"}
                      />
                    </button>

                    {/* DELETE */}
                    <button
                      className="thumb-delete"
                      onClick={() => handleDelete(index)}
                      title="Delete photo"
                    >
                      <X size={15} color="white" />
                    </button>
                  </div>
                </div>
              ))}

              {/* ADD MORE */}
              {photos.length < 10 && (
                <div
                  className="photo-thumb add-more"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={24} color="#A376A2" />
                  <span>Add More</span>
                </div>
              )}
            </div>
          )}

          {/* PHOTO COUNT */}
          {photos.length > 0 && (
            <p className="photo-count">
              {photos.length} / 10 photos added •
              <span> Star = Primary Photo</span>
            </p>
          )}

          {/* ERROR */}
          {error && <div className="upload-error">{error}</div>}

          {/* SUCCESS */}
          {successMsg && <div className="upload-success">{successMsg}</div>}

          {/* SAVE BUTTON */}
          <div className="upload-actions">
            <button
              className="btn-skip-upload"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
            >
              Skip for now
            </button>
            <button
              className="btn-save-photos"
              onClick={handleSave}
              disabled={loading || photos.length === 0}
            >
              {loading ? (
                <><span className="spinner" /> Uploading...</>
              ) : (
                <>Save Photos <ChevronRight size={17} /></>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadPhotos;