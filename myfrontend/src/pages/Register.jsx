import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, SignUp } from "@clerk/clerk-react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Heart, ChevronRight, CheckCircle, Users, Calendar, AlertCircle } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const defaultBackendUrl = import.meta.env.PROD
    ? "https://phirseshaadi-2.onrender.com"
    : "http://localhost:5000";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackendUrl;
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const { signIn, isLoaded } = useSignIn();

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

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      const origin = window.location.origin;
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${origin}/sso-callback`,
        redirectUrlComplete: `${origin}/google-success`,
      });
    } catch (error) {
      console.error("Clerk Google sign-up failed:", error);
      // Fallback to existing backend Google OAuth if Clerk fails due to dashboard config.
      window.location.href = `${backendUrl}/api/auth/google`;
    }
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

  return (
    <div className="register-page">
      <div className="register-container">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "clerk-root",
              card: "clerk-card"
            }
          }}
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
};

export default Register;