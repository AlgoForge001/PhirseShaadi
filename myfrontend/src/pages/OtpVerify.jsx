import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ChevronRight, Shield } from "lucide-react";
import axios from "axios";
import "./OtpVerify.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [apiError, setApiError] = useState("");
  const inputRefs = useRef([]);

  // Get phone number from location state (passed from Register page)
  const phone = location.state?.phone || "XXXXXXXXXX";

  // ── COUNTDOWN TIMER ──
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ── HANDLE OTP INPUT ──
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);
    setError("");
    setApiError("");

    // auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ── HANDLE BACKSPACE ──
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ── HANDLE PASTE ──
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });
    setOtp(newOtp);
    // focus last filled
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // ── VERIFY OTP ──
  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setApiError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        phone: phone,
        otp: otpValue,
      });

      if (res.data.success) {
        // Save token to localStorage
        localStorage.setItem("token", res.data.token);

        // Save user data if needed
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Show success state
        setVerified(true);

        // Navigate to profile-creation after 1.5 seconds
        setTimeout(() => {
          navigate("/profile-creation");
        }, 1500);
      } else {
        setApiError(res.data.message || "Failed to verify OTP");
      }
    } catch (error) {
      // Handle different error types
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setApiError("Wrong OTP. Please try again.");
      } else if (error.response?.status === 404) {
        setApiError("Phone number not found.");
      } else if (error.message === "Network Error") {
        setApiError("Network error. Please check your connection.");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── RESEND OTP ──
  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setApiError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/resend-otp", {
        phone: phone,
      });

      if (res.data.success) {
        setOtp(["", "", "", "", "", ""]);
        setTimer(30);
        setCanResend(false);
        setError("");
        inputRefs.current[0]?.focus();
      } else {
        setApiError(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Failed to resend OTP. Please try again.");
      }
      console.error("Resend OTP error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">

      {/* LEFT PANEL */}
      <div className="otp-left">
        <div className="otp-left-content">
          <div className="otp-logo" onClick={() => navigate("/")}>
            <Heart size={22} fill="#fff" color="#fff" />
            <span>BandhanSetu</span>
          </div>
          <div className="otp-shield">
            <Shield size={64} color="rgba(255,255,255,0.9)" />
          </div>
          <h2>Secure Verification</h2>
          <p>
            We send a one-time password to verify your identity and keep
            your account safe from unauthorized access.
          </p>
          <div className="otp-steps">
            <div className="otp-step-item">
              <div className="otp-step-dot active">1</div>
              <span>Account Created</span>
            </div>
            <div className="otp-step-line active" />
            <div className="otp-step-item">
              <div className="otp-step-dot active">2</div>
              <span>Verify OTP</span>
            </div>
            <div className="otp-step-line" />
            <div className="otp-step-item">
              <div className="otp-step-dot">3</div>
              <span>Complete Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="otp-right">
        <div className="otp-form-wrap">

          {!verified ? (
            <>
              <div className="otp-icon-top">
                <Shield size={40} color="#6B3F69" />
              </div>

              <h2 className="otp-title">Verify Your Number</h2>
              <p className="otp-subtitle">
                We sent a 6-digit OTP to <strong>+91 {phone}</strong>
                <span className="change-number" onClick={() => navigate("/register")}>
                  Change
                </span>
              </p>

              {/* API ERROR MESSAGE */}
              {apiError && (
                <div className="api-error-msg">
                  {apiError}
                </div>
              )}

              {/* OTP INPUTS */}
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`otp-input ${digit ? "filled" : ""} ${error ? "error" : ""}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {error && <p className="otp-error">{error}</p>}

              {/* TIMER & RESEND */}
              <div className="otp-resend">
                {canResend ? (
                  <button className="resend-btn" onClick={handleResend} disabled={loading}>
                    {loading ? "Resending..." : "Resend OTP"}
                  </button>
                ) : (
                  <p className="otp-timer">
                    Resend OTP in <strong>{timer}s</strong>
                  </p>
                )}
              </div>

              {/* VERIFY BUTTON */}
              <button
                className="btn-verify"
                onClick={handleVerify}
                disabled={loading || otp.join("").length < 6}
              >
                {loading ? <span className="spinner" /> : <>Verify & Continue <ChevronRight size={17} /></>}
              </button>

              <p className="otp-note">
                Didn't receive the OTP? Check your spam folder or try resending.
              </p>
            </>
          ) : (
            // SUCCESS STATE
            <div className="otp-success">
              <div className="success-circle">
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="28" fill="#6B3F69" />
                  <path
                    d="M18 30 L26 38 L42 22"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    className="check-path"
                  />
                </svg>
              </div>
              <h2>Verified!</h2>
              <p>Your number has been verified successfully. Redirecting you to complete your profile...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpVerify;