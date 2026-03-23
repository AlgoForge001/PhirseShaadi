import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronRight, Shield } from "lucide-react";
import "./OtpVerify.css";

const OtpVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  // TODO [BACKEND]: Get phone number from location state or redux/context
  // const phone = location.state?.phone || "";
  const phone = "XXXXXXXXXX"; // replace with actual phone from state

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

    // TODO [BACKEND]: POST /api/auth/verify-otp
    // Body: { phone, otp: otpValue }
    // Response: { success: true, token: "...", user: {...} }
    // On success: save token, navigate to /profile-creation
    // Example:
    // const res = await fetch("/api/auth/verify-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ phone, otp: otpValue }),
    // });
    // const data = await res.json();
    // if (data.success) {
    //   localStorage.setItem("token", data.token);
    //   navigate("/profile-creation");
    // } else {
    //   setError("Invalid OTP. Please try again.");
    // }

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => navigate("/profile-creation"), 1500);
    }, 1500);
  };

  // ── RESEND OTP ──
  const handleResend = async () => {
    if (!canResend) return;

    // TODO [BACKEND]: POST /api/auth/resend-otp
    // Body: { phone }
    // Response: { success: true }
    // Example:
    // await fetch("/api/auth/resend-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ phone }),
    // });

    setOtp(["", "", "", "", "", ""]);
    setTimer(30);
    setCanResend(false);
    setError("");
    inputRefs.current[0]?.focus();
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
                  <button className="resend-btn" onClick={handleResend}>
                    Resend OTP
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