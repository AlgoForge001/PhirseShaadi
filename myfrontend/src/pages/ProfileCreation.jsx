import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, ChevronRight, ChevronLeft, User, MapPin,
  Briefcase, GraduationCap, Camera, CheckCircle,
  Users, Star, FileText
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./ProfileCreation.css";

const ProfileCreation = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [step, setStep] = useState(1); // 5 steps total
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1 — About You
    bio: "",
    height: "",
    weight: "",
    bodyType: "",
    complexion: "",
    physicalStatus: "normal",

    // Step 2 — Location
    country: "India",
    state: "",
    city: "",
    residencyStatus: "",
    growingUpIn: "",

    // Step 3 — Education & Career
    education: "",
    educationDetail: "",
    occupation: "",
    employedIn: "",
    annualIncome: "",
    companyName: "",

    // Step 4 — Family Details
    familyType: "",
    familyStatus: "",
    familyValues: "",
    fatherOccupation: "",
    motherOccupation: "",
    siblings: "",
    aboutFamily: "",

    // Step 5 — Partner Preferences
    prefAgeFrom: "",
    prefAgeTo: "",
    prefHeightFrom: "",
    prefHeightTo: "",
    prefReligion: "",
    prefCommunity: "",
    prefEducation: "",
    prefOccupation: "",
    prefLocation: "",
    prefAbout: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO [BACKEND]: POST /api/profile/upload-photo
      // Send file as FormData
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ── VALIDATION ──
  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!formData.height) errs.height = "Please select height";
      if (!formData.complexion) errs.complexion = "Please select complexion";
    }
    if (step === 2) {
      if (!formData.state) errs.state = "Please select state";
      if (!formData.city.trim()) errs.city = "City is required";
    }
    if (step === 3) {
      if (!formData.education) errs.education = "Please select education";
      if (!formData.occupation) errs.occupation = "Please select occupation";
    }
    if (step === 4) {
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.put("/profile/update", formData);
      if (res.data.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── DATA OPTIONS ──
  const heights = ["4'6\"","4'7\"","4'8\"","4'9\"","4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""];
  const weights = Array.from({ length: 81 }, (_, i) => `${40 + i} kg`);
  const complexions = ["Very Fair", "Fair", "Wheatish", "Wheatish Brown", "Dark"];
  const bodyTypes = ["Slim", "Athletic", "Average", "Heavy"];
  const states = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];
  const residencyStatuses = ["Citizen", "Permanent Resident", "Student Visa", "Work Permit", "Other"];
  const educations = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "MBBS", "Engineering", "CA/CS", "Other"];
  const occupations = ["Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee", "Lawyer", "Accountant", "Architect", "Student", "Other"];
  const employedIns = ["Private Sector", "Government", "Business / Self Employed", "Defence", "Civil Services", "Not Working"];
  const incomes = ["Below ₹2L", "₹2L - ₹5L", "₹5L - ₹10L", "₹10L - ₹15L", "₹15L - ₹20L", "₹20L - ₹30L", "₹30L - ₹50L", "Above ₹50L"];
  const familyTypes = ["Joint Family", "Nuclear Family"];
  const familyStatuses = ["Middle Class", "Upper Middle Class", "Rich", "Affluent"];
  const familyValues = ["Orthodox", "Traditional", "Moderate", "Liberal"];
  const siblingOptions = ["No Siblings", "1 Brother", "2 Brothers", "1 Sister", "2 Sisters", "1 Brother 1 Sister", "Other"];
  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
  const ages = Array.from({ length: 43 }, (_, i) => `${18 + i}`);

  const steps = [
    { label: "About", icon: <User size={16} /> },
    { label: "Location", icon: <MapPin size={16} /> },
    { label: "Career", icon: <Briefcase size={16} /> },
    { label: "Family", icon: <Users size={16} /> },
    { label: "Partner", icon: <Heart size={16} /> },
  ];

  return (
    <div className="pc-page">

      {/* HEADER */}
      <div className="pc-header">
        <div className="pc-logo" onClick={() => navigate("/")}>
          <Heart size={20} fill="#6B3F69" color="#6B3F69" />
          <span>PhirseShaadi</span>
        </div>
        <div className="pc-progress">
          <div className="pc-progress-bar">
            <div
              className="pc-progress-fill"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <span>{Math.round((step / 5) * 100)}% Complete</span>
        </div>
      </div>

      <div className="pc-body">

        {/* STEP TABS */}
        <div className="pc-steps">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`pc-step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
            >
              <div className="pc-step-icon">
                {step > i + 1 ? <CheckCircle size={16} color="white" /> : s.icon}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="pc-card">

          {/* ── STEP 1 — ABOUT YOU ── */}
          {step === 1 && (
            <div className="pc-form">
              <h2>About You</h2>
              <p className="pc-form-desc">Tell us about yourself to help find better matches.</p>

              {/* PHOTO UPLOAD */}
              <div className="photo-upload-section">
                <div className="photo-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" />
                  ) : (
                    <div className="photo-placeholder">
                      <Camera size={32} color="#A376A2" />
                      <span>Add Photo</span>
                    </div>
                  )}
                </div>
                <div className="photo-upload-info">
                  <h4>Profile Photo</h4>
                  <p>Upload a clear photo of your face. This helps others recognize you.</p>
                  <label className="photo-upload-btn">
                    <Camera size={15} />
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                    {/* TODO [BACKEND]: POST /api/profile/upload-photo */}
                    <input type="file" accept="image/*" onChange={handlePhoto} hidden />
                  </label>
                </div>
              </div>

              {/* BIO */}
              <div className="form-group">
                <label>About Yourself</label>
                <textarea
                  name="bio"
                  placeholder="Write a brief description about yourself, your interests, and what you're looking for..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="pc-textarea"
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

              {/* PHYSICAL STATUS */}
              <div className="form-group">
                <label>Physical Status</label>
                <div className="radio-group">
                  {["Normal", "Physically Challenged"].map((opt) => (
                    <label key={opt} className="radio-label">
                      <input
                        type="radio"
                        name="physicalStatus"
                        value={opt.toLowerCase()}
                        checked={formData.physicalStatus === opt.toLowerCase()}
                        onChange={handleChange}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 — LOCATION ── */}
          {step === 2 && (
            <div className="pc-form">
              <h2>Location Details</h2>
              <p className="pc-form-desc">Where are you currently based?</p>

              {/* COUNTRY */}
              <div className="form-group">
                <label>Country</label>
                <div className="input-wrap">
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="UAE">UAE</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* STATE */}
              <div className="form-group">
                <label>State <span className="req">*</span></label>
                <div className={`input-wrap ${errors.state ? "error" : ""}`}>
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {errors.state && <span className="err-msg">{errors.state}</span>}
              </div>

              {/* CITY */}
              <div className="form-group">
                <label>City <span className="req">*</span></label>
                <div className={`input-wrap ${errors.city ? "error" : ""}`}>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                {errors.city && <span className="err-msg">{errors.city}</span>}
              </div>

              {/* RESIDENCY STATUS */}
              <div className="form-group">
                <label>Residency Status</label>
                <div className="input-wrap">
                  <select name="residencyStatus" value={formData.residencyStatus} onChange={handleChange}>
                    <option value="">Select Residency Status</option>
                    {residencyStatuses.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* GREW UP IN */}
              <div className="form-group">
                <label>Grew Up In</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="growingUpIn"
                    placeholder="City/Town where you grew up"
                    value={formData.growingUpIn}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 — EDUCATION & CAREER ── */}
          {step === 3 && (
            <div className="pc-form">
              <h2>Education & Career</h2>
              <p className="pc-form-desc">Share your educational and professional background.</p>

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
                    placeholder="e.g. B.Tech in Computer Science from IIT"
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
                      placeholder="Company / Organisation"
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

          {/* ── STEP 4 — FAMILY ── */}
          {step === 4 && (
            <div className="pc-form">
              <h2>Family Details</h2>
              <p className="pc-form-desc">Tell us about your family background.</p>

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
                    {siblingOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* ABOUT FAMILY */}
              <div className="form-group">
                <label>About Family</label>
                <textarea
                  name="aboutFamily"
                  placeholder="Describe your family background, values and lifestyle..."
                  value={formData.aboutFamily}
                  onChange={handleChange}
                  rows={3}
                  className="pc-textarea"
                  maxLength={300}
                />
                <span className="char-count">{(formData.aboutFamily || "").length}/300</span>
              </div>
            </div>
          )}

          {/* ── STEP 5 — PARTNER PREFERENCES ── */}
          {step === 5 && (
            <div className="pc-form">
              <h2>Partner Preferences</h2>
              <p className="pc-form-desc">What are you looking for in your life partner?</p>

              {/* AGE RANGE */}
              <div className="form-group">
                <label>Preferred Age Range</label>
                <div className="form-row">
                  <div className="input-wrap">
                    <select name="prefAgeFrom" value={formData.prefAgeFrom} onChange={handleChange}>
                      <option value="">From</option>
                      {ages.map((a) => <option key={a} value={a}>{a} yrs</option>)}
                    </select>
                  </div>
                  <div className="input-wrap">
                    <select name="prefAgeTo" value={formData.prefAgeTo} onChange={handleChange}>
                      <option value="">To</option>
                      {ages.map((a) => <option key={a} value={a}>{a} yrs</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* HEIGHT RANGE */}
              <div className="form-group">
                <label>Preferred Height Range</label>
                <div className="form-row">
                  <div className="input-wrap">
                    <select name="prefHeightFrom" value={formData.prefHeightFrom} onChange={handleChange}>
                      <option value="">From</option>
                      {heights.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="input-wrap">
                    <select name="prefHeightTo" value={formData.prefHeightTo} onChange={handleChange}>
                      <option value="">To</option>
                      {heights.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* RELIGION & COMMUNITY */}
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Religion</label>
                  <div className="input-wrap">
                    <select name="prefReligion" value={formData.prefReligion} onChange={handleChange}>
                      <option value="">Any Religion</option>
                      {religions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Preferred Community</label>
                  <div className="input-wrap">
                    <input
                      type="text"
                      name="prefCommunity"
                      placeholder="Any community"
                      value={formData.prefCommunity}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* EDUCATION & OCCUPATION */}
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Education</label>
                  <div className="input-wrap">
                    <select name="prefEducation" value={formData.prefEducation} onChange={handleChange}>
                      <option value="">Any Education</option>
                      {educations.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Preferred Occupation</label>
                  <div className="input-wrap">
                    <select name="prefOccupation" value={formData.prefOccupation} onChange={handleChange}>
                      <option value="">Any Occupation</option>
                      {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label>Preferred Location</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="prefLocation"
                    placeholder="e.g. Mumbai, Delhi or Any"
                    value={formData.prefLocation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ABOUT PARTNER */}
              <div className="form-group">
                <label>About Your Ideal Partner</label>
                <textarea
                  name="prefAbout"
                  placeholder="Describe the kind of person you are looking for..."
                  value={formData.prefAbout}
                  onChange={handleChange}
                  rows={4}
                  className="pc-textarea"
                  maxLength={500}
                />
                <span className="char-count">{(formData.prefAbout || "").length}/500</span>
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="pc-nav">
            {step > 1 && (
              <button className="btn-back" onClick={handleBack}>
                <ChevronLeft size={17} /> Back
              </button>
            )}
            {step < 5 ? (
              <button className="btn-next" onClick={handleNext}>
                Continue <ChevronRight size={17} />
              </button>
            ) : (
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : <>Complete Profile <ChevronRight size={17} /></>}
              </button>
            )}
          </div>

          {/* SKIP */}
          {step < 5 && (
            <button className="btn-skip" onClick={() => setStep((s) => s + 1)}>
              Skip for now
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;