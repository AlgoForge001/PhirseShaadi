import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, ChevronRight, ChevronLeft, Edit, MapPin,
  Briefcase, GraduationCap, Users, Sun, CheckCircle
} from "lucide-react";
import api from "../utils/api";

import "./EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 4 steps: Basic, Education, Family, Horoscope
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [formData, setFormData] = useState({
    // Basic
    fullName: "",
    bio: "",
    height: "",
    weight: "",
    bodyType: "",
    complexion: "",
    city: "",
    state: "",
    profileFor: "",
    mothertongue: "",
    religion: "",
    community: "",
    physicalStatus: "normal",

    // Education
    education: "",
    educationDetail: "",
    occupation: "",
    employedIn: "",
    annualIncome: "",
    companyName: "",

    // Family
    familyType: "",
    familyStatus: "",
    familyValues: "",
    fatherOccupation: "",
    motherOccupation: "",
    siblings: "",
    aboutFamily: "",

    // Horoscope
    dob: "",
    birthTime: "",
    birthPlace: "",
    manglik: "",
    gotra: "",
    nakshatra: "",
    rashi: "",
  });

  // ── FETCH PROFILE DATA ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setApiError(null);
        // Using interceptor
        const response = await api.get("/profile/me");
        
        // Merge API data with default state to avoid undefined fields
        const profileData = response.data.profile || {};
        setFormData(prev => ({
          ...prev,
          ...profileData,
          fullName: profileData.fullName || profileData.name || prev.fullName || "",
          bio: profileData.bio || "",
          aboutFamily: profileData.aboutFamily || "",
          // Ensure other fields are strings to avoid crashes
        }));
      } catch (err) {
        console.error("Failed to load profile:", err);
        setApiError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Name is required";
      if (!formData.height) errs.height = "Please select height";
      if (!formData.complexion) errs.complexion = "Please select complexion";
      if (!formData.city.trim()) errs.city = "City is required";
    }
    if (step === 2) {
      if (!formData.education) errs.education = "Please select education";
      if (!formData.occupation) errs.occupation = "Please select occupation";
    }
    if (step === 3) {
      if (!formData.familyType) errs.familyType = "Please select family type";
      if (!formData.familyValues) errs.familyValues = "Please select family values";
    }
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Step 1 - Basic Info
      if (step === 1) {
        await api.put("/profile/basic", {
          fullName: formData.fullName,
          bio: formData.bio,
          height: formData.height,
          weight: formData.weight,
          bodyType: formData.bodyType,
          complexion: formData.complexion,
          city: formData.city,
          state: formData.state,
          profileFor: formData.profileFor,
          motherTongue: formData.motherTongue,
          religion: formData.religion,
          community: formData.community,
          physicalStatus: formData.physicalStatus,
        });
      }

      // Step 2 - Education
      if (step === 2) {
        await api.put("/profile/education", {
          education: formData.education,
          educationDetail: formData.educationDetail,
          occupation: formData.occupation,
          employedIn: formData.employedIn,
          annualIncome: formData.annualIncome,
          companyName: formData.companyName,
        });
      }

      // Step 3 - Family
      if (step === 3) {
        await api.put("/profile/family", {
          familyType: formData.familyType,
          familyStatus: formData.familyStatus,
          familyValues: formData.familyValues,
          fatherOccupation: formData.fatherOccupation,
          motherOccupation: formData.motherOccupation,
          siblings: formData.siblings,
          aboutFamily: formData.aboutFamily,
        });
      }

      // Step 4 - Horoscope
      if (step === 4) {
        await api.put("/profile/horoscope", {
          dob: formData.dob,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          manglik: formData.manglik,
          gotra: formData.gotra,
          nakshatra: formData.nakshatra,
          rashi: formData.rashi,
        });
      }

      if (step === 4) {
        setTimeout(() => {
          setSaving(false);
          navigate("/my-profile");
        }, 1500);
      } else {
        setSaving(false);
        handleNext();
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      setSaving(false);
    }
  };

  // ── DATA OPTIONS ──
  const heights = ["4'6\"","4'7\"","4'8\"","4'9\"","4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""];
  const weights = Array.from({ length: 81 }, (_, i) => `${40 + i} kg`);
  const complexions = ["Very Fair", "Fair", "Wheatish", "Wheatish Brown", "Dark"];
  const bodyTypes = ["Slim", "Athletic", "Average", "Heavy"];
  const states = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
  const educations = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "MBBS", "Engineering", "CA/CS", "Other"];
  const occupations = ["Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee", "Lawyer", "Accountant", "Architect", "Student", "Other"];
  const employedIns = ["Private Sector", "Government", "Business / Self Employed", "Defence", "Civil Services", "Not Working"];
  const incomes = ["Below ₹2L", "₹2L - ₹5L", "₹5L - ₹10L", "₹10L - ₹15L", "₹15L - ₹20L", "₹20L - ₹30L", "₹30L - ₹50L", "Above ₹50L"];
  const familyTypes = ["Joint Family", "Nuclear Family"];
  const familyStatuses = ["Middle Class", "Upper Middle Class", "Rich", "Affluent"];
  const familyValues = ["Orthodox", "Traditional", "Moderate", "Liberal"];
  const siblings = ["No Siblings", "1 Brother", "2 Brothers", "1 Sister", "2 Sisters", "1 Brother 1 Sister", "Other"];
  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
  const manglikOptions = ["No", "Yes", "Not Sure"];
  const rashis = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  const steps = [
    { label: "Basic", icon: <Users size={16} /> },
    { label: "Education", icon: <GraduationCap size={16} /> },
    { label: "Family", icon: <Heart size={16} /> },
    { label: "Horoscope", icon: <Sun size={16} /> },
  ];

  if (loading) {
    return (
      <div className="ep-loading">
        <div className="ep-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="ep-page">
      {/* HEADER */}
      <div className="ep-header">
        <div className="ep-logo" onClick={() => navigate("/")}>
          <Heart size={20} fill="#6B3F69" color="#6B3F69" />
          <span>PhirseShaadi</span>
        </div>
        <div className="ep-progress">
          <div className="ep-progress-bar">
            <div
              className="ep-progress-fill"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <span>{Math.round((step / 4) * 100)}% Complete</span>
        </div>
      </div>

      <div className="ep-body">
        {/* STEP TABS */}
        <div className="ep-steps">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`ep-step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
            >
              <div className="ep-step-icon">
                {step > i + 1 ? <CheckCircle size={16} color="white" /> : s.icon}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="ep-card">

          {/* ── STEP 1 — BASIC ── */}
          {step === 1 && (
            <div className="ep-form">
              <h2><Edit size={18} /> Edit Basic Info</h2>
              <p className="ep-form-desc">Update your basic profile information.</p>

              {/* NAME */}
              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <div className={`input-wrap ${errors.fullName ? "error" : ""}`}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
              </div>

              {/* BIO */}
              <div className="form-group">
                <label>About Yourself</label>
                <textarea
                  name="bio"
                  placeholder="Write about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                />
                <span className="char-count">{(formData.bio || "").length}/500</span>
              </div>

              {/* HEIGHT & WEIGHT */}
              <div className="form-row">
                <div className="form-group">
                  <label>Height <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.height ? "error" : ""}`}>
                    <select name="height" value={formData.height} onChange={handleChange}>
                      <option value="">Select Height</option>
                      {heights.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  {errors.height && <span className="err-msg">{errors.height}</span>}
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <div className="input-wrap">
                    <select name="weight" value={formData.weight} onChange={handleChange}>
                      <option value="">Select Weight</option>
                      {weights.map((w) => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* BODY TYPE & COMPLEXION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Body Type</label>
                  <div className="input-wrap">
                    <select name="bodyType" value={formData.bodyType} onChange={handleChange}>
                      <option value="">Select Body Type</option>
                      {bodyTypes.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Complexion <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.complexion ? "error" : ""}`}>
                    <select name="complexion" value={formData.complexion} onChange={handleChange}>
                      <option value="">Select Complexion</option>
                      {complexions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.complexion && <span className="err-msg">{errors.complexion}</span>}
                </div>
              </div>

              {/* CITY & STATE */}
              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.city ? "error" : ""}`}>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.city && <span className="err-msg">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <div className="input-wrap">
                    <select name="state" value={formData.state} onChange={handleChange}>
                      <option value="">Select State</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* RELIGION & COMMUNITY */}
              <div className="form-row">
                <div className="form-group">
                  <label>Religion</label>
                  <div className="input-wrap">
                    <select name="religion" value={formData.religion} onChange={handleChange}>
                      <option value="">Select Religion</option>
                      {religions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Community</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="community"
                      placeholder="Enter community"
                      value={formData.community}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* MOTHER TONGUE */}
              <div className="form-group">
                <label>Mother Tongue</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="motherTongue"
                    placeholder="e.g. Hindi, Tamil"
                    value={formData.motherTongue}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 — EDUCATION ── */}
          {step === 2 && (
            <div className="ep-form">
              <h2><GraduationCap size={18} /> Edit Education & Career</h2>
              <p className="ep-form-desc">Update your education and professional details.</p>

              {/* EDUCATION */}
              <div className="form-group">
                <label>Highest Education <span className="req">*</span></label>
                <div className={`input-wrap ${errors.education ? "error" : ""}`}>
                  <select name="education" value={formData.education} onChange={handleChange}>
                    <option value="">Select Education</option>
                    {educations.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                {errors.education && <span className="err-msg">{errors.education}</span>}
              </div>

              {/* EDUCATION DETAIL */}
              <div className="form-group">
                <label>Education Details</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="educationDetail"
                    placeholder="e.g. B.Tech in CS from IIT"
                    value={formData.educationDetail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* OCCUPATION */}
              <div className="form-group">
                <label>Occupation <span className="req">*</span></label>
                <div className={`input-wrap ${errors.occupation ? "error" : ""}`}>
                  <select name="occupation" value={formData.occupation} onChange={handleChange}>
                    <option value="">Select Occupation</option>
                    {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                {errors.occupation && <span className="err-msg">{errors.occupation}</span>}
              </div>

              {/* EMPLOYED IN */}
              <div className="form-group">
                <label>Employed In</label>
                <div className="input-wrap">
                  <select name="employedIn" value={formData.employedIn} onChange={handleChange}>
                    <option value="">Select Sector</option>
                    {employedIns.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              {/* COMPANY & INCOME */}
              <div className="form-row">
                <div className="form-group">
                  <label>Company Name</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Company name"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Annual Income</label>
                  <div className="input-wrap">
                    <select name="annualIncome" value={formData.annualIncome} onChange={handleChange}>
                      <option value="">Select Income</option>
                      {incomes.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 — FAMILY ── */}
          {step === 3 && (
            <div className="ep-form">
              <h2><Users size={18} /> Edit Family Details</h2>
              <p className="ep-form-desc">Update your family information.</p>

              {/* FAMILY TYPE & STATUS */}
              <div className="form-row">
                <div className="form-group">
                  <label>Family Type <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.familyType ? "error" : ""}`}>
                    <select name="familyType" value={formData.familyType} onChange={handleChange}>
                      <option value="">Select Type</option>
                      {familyTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  {errors.familyType && <span className="err-msg">{errors.familyType}</span>}
                </div>
                <div className="form-group">
                  <label>Family Status</label>
                  <div className="input-wrap">
                    <select name="familyStatus" value={formData.familyStatus} onChange={handleChange}>
                      <option value="">Select Status</option>
                      {familyStatuses.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* FAMILY VALUES */}
              <div className="form-group">
                <label>Family Values <span className="req">*</span></label>
                <div className={`input-wrap ${errors.familyValues ? "error" : ""}`}>
                  <select name="familyValues" value={formData.familyValues} onChange={handleChange}>
                    <option value="">Select Values</option>
                    {familyValues.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                {errors.familyValues && <span className="err-msg">{errors.familyValues}</span>}
              </div>

              {/* FATHER & MOTHER */}
              <div className="form-row">
                <div className="form-group">
                  <label>Father's Occupation</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="fatherOccupation"
                      placeholder="e.g. Retired, Business"
                      value={formData.fatherOccupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mother's Occupation</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="motherOccupation"
                      placeholder="e.g. Homemaker, Teacher"
                      value={formData.motherOccupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* SIBLINGS */}
              <div className="form-group">
                <label>Siblings</label>
                <div className="input-wrap">
                  <select name="siblings" value={formData.siblings} onChange={handleChange}>
                    <option value="">Select</option>
                    {siblings.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* ABOUT FAMILY */}
              <div className="form-group">
                <label>About Family</label>
                <textarea
                  name="aboutFamily"
                  placeholder="Describe your family..."
                  value={formData.aboutFamily}
                  onChange={handleChange}
                  rows={3}
                  maxLength={300}
                />
                <span className="char-count">{(formData.aboutFamily || "").length}/300</span>
              </div>
            </div>
          )}

          {/* ── STEP 4 — HOROSCOPE ── */}
          {step === 4 && (
            <div className="ep-form">
              <h2><Sun size={18} /> Edit Horoscope Details</h2>
              <p className="ep-form-desc">Update your astrological information.</p>

              {/* DOB & BIRTH TIME */}
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <div className="input-wrap">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Birth Time</label>
                  <div className="input-wrap">
                    <input
                      type="time"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* BIRTH PLACE */}
              <div className="form-group">
                <label>Birth Place</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="birthPlace"
                    placeholder="City of birth"
                    value={formData.birthPlace}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* MANGLIK & RASHI */}
              <div className="form-row">
                <div className="form-group">
                  <label>Manglik</label>
                  <div className="input-wrap">
                    <select name="manglik" value={formData.manglik} onChange={handleChange}>
                      <option value="">Select</option>
                      {manglikOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Rashi</label>
                  <div className="input-wrap">
                    <select name="rashi" value={formData.rashi} onChange={handleChange}>
                      <option value="">Select Rashi</option>
                      {rashis.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* GOTRA & NAKSHATRA */}
              <div className="form-row">
                <div className="form-group">
                  <label>Gotra</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="gotra"
                      placeholder="e.g. Kashyap"
                      value={formData.gotra}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nakshatra</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="nakshatra"
                      placeholder="e.g. Rohini"
                      value={formData.nakshatra}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="ep-nav">
            {step > 1 && (
              <button className="btn-back" onClick={handleBack}>
                <ChevronLeft size={17} /> Back
              </button>
            )}
            <button className="btn-next" onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="spinner" />
              ) : (
                <>
                  {step === 4 ? "Save Changes" : "Continue"}
                  <ChevronRight size={17} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;