import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import {
  Heart, Mail, Lock, Eye, EyeOff, ChevronRight, Phone
} from "lucide-react";
import api from "../utils/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("email"); // email | phone
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const { signIn, isLoaded } = useSignIn();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const errs = {};
    if (loginType === "email") {
      if (!formData.email.trim()) errs.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email address";
    } else {
      if (!formData.phone.trim()) errs.phone = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(formData.phone)) errs.phone = "Invalid Indian phone number";
    }
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 8) errs.password = "Minimum 8 characters";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await api.post("/auth/login", {
        identifier: loginType === "email" ? formData.email : formData.phone,
        password: formData.password,
      });

      if (res.data.success) {
        // Save token to localStorage
        localStorage.setItem("token", res.data.token);
        
        // Save user data if needed
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
        
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setApiError(res.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      // Handle different error types
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setApiError("Invalid email/phone or password. Please try again.");
      } else if (error.response?.status === 404) {
        setApiError("User not found. Please check your email/phone.");
      } else if (error.message === "Network Error") {
        setApiError("Network error. Please check your connection.");
      } else {
        setApiError("Something went wrong. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/google-success",
      });
    } catch (error) {
      console.error("Clerk Google login failed:", error);
      setApiError("Google sign-in failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    // TODO [BACKEND]: POST /api/auth/forgot-password
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo" onClick={() => navigate("/")}>
            <Heart size={22} fill="#fff" color="#fff" />
            <span>PhirseShaadi</span>
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your journey towards finding your perfect life partner.</p>
          <div className="login-illustration">
            <div className="ill-card ill-card--1">
              <Heart size={20} fill="#DDC3C3" color="#DDC3C3" />
              <span>New match found!</span>
            </div>
            <div className="ill-card ill-card--2">
              <ChevronRight size={16} color="#DDC3C3" />
              <span>Profile viewed</span>
            </div>
            <div className="ill-card ill-card--3">
              <MessageIcon />
              <span>New message</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-wrap">

          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Enter your details to access your account</p>

          {/* LOGIN TYPE TOGGLE */}
          <div className="login-toggle">
            <button
              className={loginType === "email" ? "active" : ""}
              onClick={() => { setLoginType("email"); setErrors({}); setApiError(""); }}
            >
              <Mail size={15} /> Email
            </button>
            <button
              className={loginType === "phone" ? "active" : ""}
              onClick={() => { setLoginType("phone"); setErrors({}); setApiError(""); }}
            >
              <Phone size={15} /> Phone
            </button>
          </div>

          {/* API ERROR MESSAGE */}
          {apiError && (
            <div className="api-error-msg">
              {apiError}
            </div>
          )}

          {/* EMAIL INPUT */}
          {loginType === "email" && (
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
          )}

          {/* PHONE INPUT */}
          {loginType === "phone" && (
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
          )}

          {/* PASSWORD INPUT */}
          <div className="form-group">
            <div className="label-row">
              <label>Password <span className="req">*</span></label>
              <span className="forgot-link" onClick={handleForgotPassword}>
                Forgot Password?
              </span>
            </div>
            <div className={`input-wrap ${errors.password ? "error" : ""}`}>
              <Lock size={17} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="err-msg">{errors.password}</span>}
          </div>

          {/* SUBMIT */}
          <button
            className="btn-login-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : <>Sign In <ChevronRight size={17} /></>}
          </button>

          {/* DIVIDER */}
          <div className="divider"><span>or continue with</span></div>

          {/* GOOGLE LOGIN */}
          {/* TODO [BACKEND]: GET /api/auth/google */}
          <button className="btn-google" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* REGISTER LINK */}
          <p className="register-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create Free Profile</span>
          </p>

        </div>
      </div>
    </div>
  );
};

// Small inline icon component
const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DDC3C3" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default Login;