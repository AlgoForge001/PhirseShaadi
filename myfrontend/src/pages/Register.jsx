import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, Heart, ChevronRight, CheckCircle, Users, Calendar, AlertCircle } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const defaultBackendUrl = import.meta.env.PROD
    ? "https://phirseshaadi.onrender.com"
    : "http://localhost:5000";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileFor: "myself",
    gender: "",
    dob: "",
    religion: "",
    community: "",
    motherTongue: "",
    maritalStatus: "",
    height: "",
    country: "India",
    city: "",
    state: "",
    education: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  // ── VALIDATION ──
  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = "Invalid Indian phone number";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8) errs.password = "Minimum 8 characters";
    if (!formData.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match";
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
    if (!formData.country) errs.country = "Country is required";
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
    setApiError("");

    try {
      const res = await api.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        profileFor: formData.profileFor,
        gender: formData.gender,
        dob: formData.dob,
        religion: formData.religion,
        community: formData.community,
        motherTongue: formData.motherTongue,
        maritalStatus: formData.maritalStatus,
        height: formData.height,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        education: formData.education,
        profession: formData.profession,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        navigate("/otp-verify", { state: { phone: formData.phone } });
      }

    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
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
  const heights = ["4'6\"","4'7\"","4'8\"","4'9\"","4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\""];
  const educations = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "MBA", "PhD", "MBBS", "Engineering", "CA/CS", "Other"];
  const professions = ["Software Engineer", "Doctor", "Engineer", "Teacher", "Business Owner", "Government Employee", "Lawyer", "Accountant", "Architect", "Other"];
  const maritalStatuses = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
  const indianStates = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal", "Other"];
  const countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "UAE", "Saudi Arabia", "Kuwait", "Qatar", "South Africa", "New Zealand", "Other"
  ];

  return (
    <div className="register-page">
      {/* LEFT PANEL */}
      <div className="register-left">
        <div className="reg-left-content">
          <div className="reg-logo" onClick={() => navigate("/")}>
            <Heart size={26} fill="#fff" color="#fff" />
            <span>PhirseShaadi</span>
          </div>
          <h2>Find Your Perfect Life Partner</h2>
          <p>Join thousands of happy couples who found their soulmate on PhirseShaadi. Your journey starts here.</p>
          
          <div className="reg-trust-points">
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>100% Manual Profile Verification</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>Strict Privacy Controls</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>Verified Contact Details</span>
            </div>
            <div className="trust-point">
              <CheckCircle size={18} color="#DDC3C3" />
              <span>Matching Based on Values</span>
            </div>
          </div>

          <div className="reg-stats">
            <div className="reg-stat">
              <span>5M+</span>
              <p>Active Users</p>
            </div>
            <div className="reg-stat">
              <span>10k+</span>
              <p>Success Stories</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="register-right">
        <div className="reg-form-wrap">
          
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>
          
          <p className="step-label">
            {step === 1 && "Account Information"}
            {step === 2 && "Personal Details"}
            {step === 3 && "Professional & Location"}
          </p>

          {apiError && <div className="api-error"><AlertCircle size={16} /> {apiError}</div>}

          {/* STEP 1: ACCOUNT INFO */}
          {step === 1 && (
            <div className="form-step">
              <div className="form-group">
                <label>Profile Created For <span className="req">*</span></label>
                <div className="profile-for-grid">
                  {profileForOptions.map(opt => (
                    <button 
                      key={opt.value}
                      className={`pf-option ${formData.profileFor === opt.value ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, profileFor: opt.value})}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <div className={`input-wrap ${errors.fullName ? 'error' : ''}`}>
                  <User size={18} className="input-icon" />
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

              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <div className={`input-wrap ${errors.email ? 'error' : ''}`}>
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="example@email.com" 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="err-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number <span className="req">*</span></label>
                <div className={`input-wrap ${errors.phone ? 'error' : ''}`}>
                  <Phone size={18} className="input-icon" />
                  <span className="phone-code">+91</span>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="10-digit number" 
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                  />
                </div>
                {errors.phone && <span className="err-msg">{errors.phone}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.password ? 'error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      placeholder="Min 8 chars" 
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <span className="err-msg">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label>Confirm Password <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.confirmPassword ? 'error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirmPassword"
                      placeholder="Repeat password" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="err-msg">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-nav">
                <button className="btn-next" onClick={handleNext}>
                  Next: Personal Details <ChevronRight size={18} />
                </button>
              </div>

              <div className="divider"><span>or join with</span></div>
              <button className="social-btn" onClick={handleGoogleLogin}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="form-step">
              <div className="form-group">
                <label>I am a <span className="req">*</span></label>
                <div className="gender-options">
                  <button 
                    className={`gender-btn ${formData.gender === 'male' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, gender: 'male'})}
                  >
                    <Users size={18} /> Male
                  </button>
                  <button 
                    className={`gender-btn ${formData.gender === 'female' ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, gender: 'female'})}
                  >
                    <Users size={18} /> Female
                  </button>
                </div>
                {errors.gender && <span className="err-msg">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth <span className="req">*</span></label>
                <div className={`input-wrap ${errors.dob ? 'error' : ''}`}>
                  <Calendar size={18} className="input-icon" />
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                {errors.dob && <span className="err-msg">{errors.dob}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Religion <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.religion ? 'error' : ''}`}>
                    <select name="religion" value={formData.religion} onChange={handleChange}>
                      <option value="">Select</option>
                      {religions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  {errors.religion && <span className="err-msg">{errors.religion}</span>}
                </div>
                <div className="form-group">
                  <label>Mother Tongue <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.motherTongue ? 'error' : ''}`}>
                    <select name="motherTongue" value={formData.motherTongue} onChange={handleChange}>
                      <option value="">Select</option>
                      {motherTongues.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  {errors.motherTongue && <span className="err-msg">{errors.motherTongue}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Community / Caste (Optional)</label>
                <div className="input-wrap">
                  <Users size={18} className="input-icon" />
                  <input 
                    type="text" 
                    name="community"
                    placeholder="e.g. Agarwal, Sunni, Brahmin" 
                    value={formData.community}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-nav">
                <button className="btn-back" onClick={() => setStep(1)}>Back</button>
                <button className="btn-next" onClick={handleNext}>
                  Next: Professionals <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROFESSIONAL INFO */}
          {step === 3 && (
            <div className="form-step">
              <div className="form-row">
                <div className="form-group">
                  <label>Marital Status <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.maritalStatus ? 'error' : ''}`}>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                      <option value="">Select</option>
                      {maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  {errors.maritalStatus && <span className="err-msg">{errors.maritalStatus}</span>}
                </div>
                <div className="form-group">
                  <label>Height <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.height ? 'error' : ''}`}>
                    <select name="height" value={formData.height} onChange={handleChange}>
                      <option value="">Select</option>
                      {heights.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  {errors.height && <span className="err-msg">{errors.height}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.country ? 'error' : ''}`}>
                    <select name="country" value={formData.country} onChange={handleChange}>
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {errors.country && <span className="err-msg">{errors.country}</span>}
                </div>
                <div className="form-group">
                  <label>State <span className="req">*</span></label>
                  <div className={`input-wrap`}>
                    <select name="state" value={formData.state} onChange={handleChange}>
                      <option value="">Select</option>
                      {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>City <span className="req">*</span></label>
                  <div className={`input-wrap ${errors.city ? 'error' : ''}`}>
                    <input 
                      type="text" 
                      name="city"
                      placeholder="e.g. Mumbai" 
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.city && <span className="err-msg">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Highest Education <span className="req">*</span></label>
                <div className={`input-wrap ${errors.education ? 'error' : ''}`}>
                  <select name="education" value={formData.education} onChange={handleChange}>
                    <option value="">Select Education</option>
                    {educations.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                {errors.education && <span className="err-msg">{errors.education}</span>}
              </div>

              <div className="form-group">
                <label>Profession (Optional)</label>
                <div className="input-wrap">
                  <select name="profession" value={formData.profession} onChange={handleChange}>
                    <option value="">Select Profession</option>
                    {professions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <p className="terms-text">
                By clicking "Complete Registration", you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>

              <div className="form-nav">
                <button className="btn-back" onClick={() => setStep(2)}>Back</button>
                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? <span className="spinner"></span> : <>Complete Registration <ChevronRight size={18} /></>}
                </button>
              </div>
            </div>
          )}

          <p className="login-link">
            Already have an account? <span onClick={() => navigate('/login')}>Sign In</span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;