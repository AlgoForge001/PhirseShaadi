import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, Heart, ChevronRight, CheckCircle, Users, Calendar } from "lucide-react";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 3 steps total
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1 - Basic Auth
    fullName: "",
    email: "",
    phone: "",
    password: "",
    profileFor: "myself", // myself | son | daughter | brother | sister | friend

    // Step 2 - Personal Details
    gender: "",
    dob: "",
    religion: "",
    community: "",
    motherTongue: "",

    // Step 3 - Preferences
    maritalStatus: "",
    height: "",
    city: "",
    state: "",
    education: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── VALIDATION ──────────────────────────────
  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = "Invalid Indian phone number";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.gender) errs.gender = "Please select gender";
    if (!formData.dob) errs.dob = "Date of birth is required";
    if (!formData.religion) errs.religion = "Please select religion";
    if (!formData.motherTongue) errs.motherTongue = "Please select mother tongue";
    return errs;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.maritalStatus) errs.maritalStatus = "Please select marital status";
    if (!formData.height) errs.height = "Please select height";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.education) errs.education = "Please select education";
    return errs;
  };

  const handleNext = () => {
    let errs = {};
    if (step === 1) errs = validateStep1();
    if (step === 2) errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    const errs = validateStep3();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    // TODO [BACKEND]: POST /api/auth/register
    // Send formData to backend
    // Expected response: { success: true, userId: "...", token: "..." }
    // On success: navigate to /otp-verify with phone number
    // Example:
    // const res = await fetch("/api/auth/register", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
    // const data = await res.json();
    // if (data.success) navigate("/otp-verify");

    setTimeout(() => {
      setLoading(false);
      navigate("/otp-verify");
    }, 1500);
  };

  const profileForOptions = [
    { value: "myself", label: "Myself" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "friend", label: "Friend" },
  ];

  const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Parsi", "Jewish", "Other"];
  const motherTongues = ["Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu", "Odia", "Other"];
  const heights = ["4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""];
  const educations = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "MBBS", "Engineering", "CA/CS", "Other"];
  const professions = ["Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee", "Lawyer", "Accountant", "Architect", "Other"];
  const maritalStatuses = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];

  const indianStates = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];

  return (
    <div className="register-page">
      {/* LEFT PANEL */}
      <div className="register-left">
        <div className="reg-left-content">
          <div className="reg-logo" onClick={() => navigate("/")}>
            <Heart size={22} fill="#fff" color="#fff" />
            <span>BandhanSetu</span>
          </div>
          <h2>Find Your Perfect Life Partner</h2>
          <p>Join millions of families who found happiness through BandhanSetu.</p>

          <div className="reg-trust-points">
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>100% Verified Profiles</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>AI-Powered Matchmaking</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>Secure & Private</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>500+ Communities</span>
            </div>
          </div>

          <div className="reg-stats">
            <div className="reg-stat"><span>50L+</span><p>Profiles</p></div>
            <div className="reg-stat"><span>10L+</span><p>Marriages</p></div>
            <div className="reg-stat"><span>4.8★</span><p>Rating</p></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">
        <div className="reg-form-wrap">

          {/* STEP INDICATOR */}
          <div className="step-indicator">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`step-dot ${step >= s ? "active" : ""} ${step > s ? "done" : ""}`}>
                  {step > s ? <CheckCircle size={14} color="white" /> : s}
                </div>
                {s < 3 && <div className={`step-line ${step > s ? "active" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="step-label">
            {step === 1 && "Account Details"}
            {step === 2 && "Personal Information"}
            {step === 3 && "More About You"}
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div className="form-step">
              {/* Profile For */}
              <div className="form-group">
                <label>Creating profile for</label>
                <div className="profile-for-grid">
                  {profileForOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`pf-option ${formData.profileFor === opt.value ? "selected" : ""}`}
                      onClick={() => setFormData((p) => ({ ...p, profileFor: opt.value }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <div className={`input-wrap ${errors.fullName ? "error" : ""}`}>
                  <User size={17} className="input-icon" />
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

              {/* Email */}
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <div className={`input-wrap ${errors.email ? "error" : ""}`}>
                  <Mail size={17} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="err-msg">{errors.email}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Mobile Number <span className="req">*</span></label>
                <div className={`input-wrap ${errors.phone ? "error" : ""}`}>
                  <Phone size={17} className="input-icon" />
                  <span className="phone-code">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                  />
                </div>
                {errors.phone && <span className="err-msg">{errors.phone}</span>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label>Password <span className="req">*</span></label>
                <div className={`input-wrap ${errors.password ? "error" : ""}`}>
                  <Lock size={17} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && <span className="err-msg">{errors.password}</span>}
                {formData.password && (
                  <div className="password-strength">
                    <div className={`strength-bar ${formData.password.length >= 8 ? "strong" : formData.password.length >= 5 ? "medium" : "weak"}`} />
                    <span>{formData.password.length >= 8 ? "Strong" : formData.password.length >= 5 ? "Medium" : "Weak"}</span>
                  </div>
                )}
              </div>

              {/* Social Login */}
              <div className="divider"><span>or register with</span></div>
              <div className="social-btns">
                {/* TODO [BACKEND]: GET /api/auth/google */}
                <button type="button" className="social-btn google">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div className="form-step">
              {/* Gender */}
              <div className="form-group">
                <label>Gender <span className="req">*</span></label>
                <div className="gender-options">
                  {["Male", "Female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`gender-btn ${formData.gender === g ? "selected" : ""}`}
                      onClick={() => { setFormData((p) => ({ ...p, gender: g })); setErrors((p) => ({ ...p, gender: "" })); }}
                    >
                      <Users size={18} />
                      {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <span className="err-msg">{errors.gender}</span>}
              </div>

              {/* Date of Birth */}
              <div className="form-group">
                <label>Date of Birth <span className="req">*</span></label>
                <div className={`input-wrap ${errors.dob ? "error" : ""}`}>
                  <Calendar size={17} className="input-icon" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                  />
                </div>
                {errors.dob && <span className="err-msg">{errors.dob}</span>}
              </div>

              {/* Religion */}
              <div className="form-group">
                <label>Religion <span className="req">*</span></label>
                <div className={`input-wrap ${errors.religion ? "error" : ""}`}>
                  <select name="religion" value={formData.religion} onChange={handleChange}>
                    <option value="">Select Religion</option>
                    {religions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {errors.religion && <span className="err-msg">{errors.religion}</span>}
              </div>

              {/* Community */}
              <div className="form-group">
                <label>Community / Caste</label>
                <div className="input-wrap">
                  <input
                    type="text"
                    name="community"
                    placeholder="e.g. Brahmin, Sunni, etc."
                    value={formData.community}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mother Tongue */}
              <div className="form-group">
                <label>Mother Tongue <span className="req">*</span></label>
                <div className={`input-wrap ${errors.motherTongue ? "error" : ""}`}>
                  <select name="motherTongue" value={formData.motherTongue} onChange={handleChange}>
                    <option value="">Select Mother Tongue</option>
                    {motherTongues.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {errors.motherTongue && <span className="err-msg">{errors.motherTongue}</span>}
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div className="form-step">
              {/* Marital Status */}
              <div className="form-group">
                <label>Marital Status <span className="req">*</span></label>
                <div className={`input-wrap ${errors.maritalStatus ? "error" : ""}`}>
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                    <option value="">Select Marital Status</option>
                    {maritalStatuses.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                {errors.maritalStatus && <span className="err-msg">{errors.maritalStatus}</span>}
              </div>

              {/* Height */}
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

              {/* City & State */}
              <div className="form-row">
                <div className="form-group">
                  <label>City <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.city ? "error" : ""}`}>
                    <input
                      type="text"
                      name="city"
                      placeholder="Your city"
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
                      {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Education */}
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

              {/* Profession */}
              <div className="form-group">
                <label>Profession</label>
                <div className="input-wrap">
                  <select name="profession" value={formData.profession} onChange={handleChange}>
                    <option value="">Select Profession</option>
                    {professions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Terms */}
              <p className="terms-text">
                By registering, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </p>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="form-nav">
            {step > 1 && (
              <button className="btn-back" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
            {step < 3 ? (
              <button className="btn-next" onClick={handleNext}>
                Continue <ChevronRight size={17} />
              </button>
            ) : (
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? <span className="spinner" /> : <>Create Account <ChevronRight size={17} /></>}
              </button>
            )}
          </div>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;