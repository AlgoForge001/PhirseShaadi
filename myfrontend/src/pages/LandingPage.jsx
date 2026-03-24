import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Shield, Lock, Star, MessageCircle, Sparkles,
  CheckCircle, Users, Award, ChevronRight,
  Menu, X, Instagram, Facebook, Twitter,
  Gem, UserCheck, Search
} from "lucide-react";
import "./LandingPage.css";

// ─────────────────────────────────────────────
// FLOWER DECORATIONS (SVG)
// ─────────────────────────────────────────────
const FlowerDecor = ({ size = 60, color = "#DDC3C3", opacity = 0.4, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`flower-decor ${className}`}
    style={{ opacity }}
  >
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="50"
        rx="8"
        ry="20"
        fill={color}
        transform={`rotate(${angle} 50 50) translate(0 -15)`}
      />
    ))}
    <circle cx="50" cy="50" r="10" fill={color} />
  </svg>
);

const MandalaDecor = ({ size = 80, color = "#A376A2", opacity = 0.15, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`mandala-decor ${className}`}
    style={{ opacity }}
  >
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        <ellipse cx="50" cy="20" rx="4" ry="12" fill={color} />
        <circle cx="50" cy="10" r="3" fill={color} />
      </g>
    ))}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i + 12} transform={`rotate(${angle} 50 50)`}>
        <ellipse cx="50" cy="32" rx="3" ry="8" fill={color} />
      </g>
    ))}
    <circle cx="50" cy="50" r="8" fill="none" stroke={color} strokeWidth="1.5" />
    <circle cx="50" cy="50" r="4" fill={color} />
  </svg>
);

const PetalRing = ({ size = 120, color = "#8D5F8C", opacity = 0.1, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`petal-ring ${className}`}
    style={{ opacity }}
  >
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
      <ellipse
        key={i}
        cx="50"
        cy="50"
        rx="6"
        ry="18"
        fill={color}
        transform={`rotate(${angle} 50 50) translate(0 -18)`}
      />
    ))}
    <circle cx="50" cy="50" r="7" fill={color} />
    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
      <ellipse
        key={i + 10}
        cx="50"
        cy="50"
        rx="3"
        ry="9"
        fill={color}
        transform={`rotate(${angle + 18} 50 50) translate(0 -30)`}
      />
    ))}
  </svg>
);

// ─────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-logo">
        <Heart size={22} fill="#6B3F69" color="#6B3F69" />
        <span>PhirseShaadi</span>
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
        <li><a href="#howitworks" onClick={() => setMenuOpen(false)}>How It Works</a></li>
        <li><a href="#plans" onClick={() => setMenuOpen(false)}>Plans</a></li>
      </ul>

      <div className="nav-buttons">
        <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
        <button className="btn-register" onClick={() => navigate("/register")}>Register Free</button>
      </div>

      <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
};

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      {/* FLOWER DECORATIONS */}
      <MandalaDecor size={300} color="#6B3F69" opacity={0.07} className="hero-mandala-1" />
      <MandalaDecor size={200} color="#A376A2" opacity={0.08} className="hero-mandala-2" />
      <FlowerDecor size={80} color="#DDC3C3" opacity={0.5} className="hero-flower-1" />
      <FlowerDecor size={50} color="#A376A2" opacity={0.4} className="hero-flower-2" />
      <FlowerDecor size={40} color="#8D5F8C" opacity={0.3} className="hero-flower-3" />
      <PetalRing size={160} color="#6B3F69" opacity={0.06} className="hero-petal-1" />

      <div className="hero-left">
        <div className="hero-tag">
          <Award size={14} />
          India's Trusted Matrimonial Platform
        </div>
        <h1>
          Find Your<br />
          <span className="grad-text">Perfect Match</span><br />
          Today
        </h1>
        <p>
          AI-powered matchmaking, verified profiles, and a safe journey
          from your first connection to your wedding day.
        </p>
        <div className="hero-btns">
          <button className="btn-primary-lg" onClick={() => navigate("/register")}>
            Create Free Profile <ChevronRight size={18} />
          </button>
          <button className="btn-secondary-lg" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-ring-bg" />
        <PetalRing size={320} color="#6B3F69" opacity={0.08} className="hero-right-petal" />
        <div className="profile-float pf1">
          <div className="pf-avatar"><Users size={28} color="#6B3F69" /></div>
          <div className="pf-info">
            <strong>Priya S.</strong>
            <span>Software Engineer • Mumbai</span>
            <span className="pf-verified">
              <CheckCircle size={12} color="#2e7d32" /> Verified
            </span>
          </div>
        </div>
        <div className="match-center">
          <Heart size={28} fill="#6B3F69" color="#6B3F69" />
          <div className="match-score">Great Match!</div>
        </div>
        <div className="profile-float pf2">
          <div className="pf-avatar"><Users size={28} color="#6B3F69" /></div>
          <div className="pf-info">
            <strong>Arjun M.</strong>
            <span>Doctor • Pune</span>
            <span className="pf-verified">
              <CheckCircle size={12} color="#2e7d32" /> Verified
            </span>
          </div>
        </div>
        <div className="hero-badge-float hb1">
          <Lock size={13} /> 100% Secure
        </div>
        <div className="hero-badge-float hb2">
          <Sparkles size={13} /> AI Powered
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────
const features = [
  { icon: <Sparkles size={26} color="white" />, title: "AI Matchmaking", desc: "Smart compatibility engine that finds your best matches based on preferences and values.", color: "#6B3F69" },
  { icon: <UserCheck size={26} color="white" />, title: "Verified Profiles", desc: "Government ID, selfie and video KYC verification for every profile.", color: "#8D5F8C" },
  { icon: <Shield size={26} color="white" />, title: "Privacy & Safety", desc: "Incognito browsing, watermarked photos, anti-screenshot and encrypted documents.", color: "#A376A2" },
  { icon: <Star size={26} color="white" />, title: "Kundli Matching", desc: "Automatic Kundli generation, Gun Milan analysis and astrologer consultations.", color: "#6B3F69" },
  { icon: <MessageCircle size={26} color="white" />, title: "Secure Chat", desc: "Masked calls, anti-forwarding messages and auto-delete for complete privacy.", color: "#8D5F8C" },
  { icon: <Gem size={26} color="white" />, title: "Wedding Services", desc: "End-to-end wedding planning including venues, vendors and religious ceremonies.", color: "#A376A2" },
];

const Features = () => (
  <section className="features" id="features">
    {/* FLOWER DECORATIONS */}
    <FlowerDecor size={70} color="#DDC3C3" opacity={0.5} className="features-flower-1" />
    <FlowerDecor size={50} color="#A376A2" opacity={0.3} className="features-flower-2" />
    <MandalaDecor size={180} color="#6B3F69" opacity={0.05} className="features-mandala" />

    <div className="sec-label">WHY CHOOSE US</div>
    <h2 className="sec-title">Everything You Need,<br /><span className="grad-text">All in One Place</span></h2>
    <div className="features-grid">
      {features.map((f, i) => (
        <div className="feat-card" key={i}>
          <div className="feat-icon" style={{ background: f.color }}>{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const steps = [
  { icon: <UserCheck size={30} color="#6B3F69" />, step: "01", title: "Create Profile", desc: "Sign up and build your detailed profile with photos, horoscope and preferences." },
  { icon: <Shield size={30} color="#6B3F69" />, step: "02", title: "Get Verified", desc: "Complete ID and selfie verification to unlock all features and build trust." },
  { icon: <Search size={30} color="#6B3F69" />, step: "03", title: "Discover Matches", desc: "Browse AI-recommended profiles filtered by community, location and compatibility." },
  { icon: <MessageCircle size={30} color="#6B3F69" />, step: "04", title: "Connect Safely", desc: "Chat, call and meet your match — all within our secure platform." },
];

const HowItWorks = () => (
  <section className="howitworks" id="howitworks">
    {/* FLOWER DECORATIONS */}
    <FlowerDecor size={90} color="#DDC3C3" opacity={0.45} className="hiw-flower-1" />
    <FlowerDecor size={55} color="#8D5F8C" opacity={0.3} className="hiw-flower-2" />
    <PetalRing size={200} color="#A376A2" opacity={0.07} className="hiw-petal" />

    <div className="sec-label">SIMPLE PROCESS</div>
    <h2 className="sec-title">Your Journey to <span className="grad-text">Forever</span></h2>
    <div className="steps-grid">
      {steps.map((s, i) => (
        <div className="step-card" key={i}>
          <div className="step-num">{s.step}</div>
          <div className="step-icon-wrap">{s.icon}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          {i < steps.length - 1 && <div className="step-arrow"><ChevronRight size={22} color="#DDC3C3" /></div>}
        </div>
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────
// PLANS
// ─────────────────────────────────────────────
const plans = [
  {
    name: "Basic",
    price: "Free",
    color: "#A376A2",
    features: ["Create Profile", "Browse Matches", "Send Interest", "Basic Search"],
    cta: "Get Started",
    path: "/register",
  },
  {
    name: "Gold",
    price: "₹999/mo",
    color: "#8D5F8C",
    popular: true,
    features: ["All Basic Features", "Unlimited Chat", "View Profile Visitors", "Priority Listing", "Kundli Matching"],
    cta: "Go Gold",
    path: "/register?plan=gold",
  },
  {
    name: "Platinum",
    price: "₹1999/mo",
    color: "#6B3F69",
    features: ["All Gold Features", "Dedicated Relationship Manager", "Video KYC", "Wedding Services", "Incognito Mode"],
    cta: "Go Platinum",
    path: "/register?plan=platinum",
  },
];

const Plans = () => {
  const navigate = useNavigate();
  return (
    <section className="plans" id="plans">
      {/* FLOWER DECORATIONS */}
      <FlowerDecor size={75} color="#DDC3C3" opacity={0.45} className="plans-flower-1" />
      <FlowerDecor size={45} color="#6B3F69" opacity={0.25} className="plans-flower-2" />
      <MandalaDecor size={220} color="#8D5F8C" opacity={0.05} className="plans-mandala" />

      <div className="sec-label">MEMBERSHIP</div>
      <h2 className="sec-title">Choose Your <span className="grad-text">Perfect Plan</span></h2>
      <div className="plans-grid">
        {plans.map((p, i) => (
          <div className={`plan-card ${p.popular ? "popular" : ""}`} key={i}>
            {p.popular && <div className="popular-tag"><Star size={13} fill="white" color="white" /> Most Popular</div>}
            <div className="plan-header" style={{ background: p.color }}>
              <FlowerDecor size={40} color="rgba(255,255,255,0.15)" opacity={1} className="plan-header-flower" />
              <h3>{p.name}</h3>
              <div className="plan-price">{p.price}</div>
            </div>
            <ul className="plan-features">
              {p.features.map((f, j) => (
                <li key={j}><CheckCircle size={16} color="#6B3F69" /> {f}</li>
              ))}
            </ul>
            <button className="plan-cta" style={{ background: p.color }} onClick={() => navigate(p.path)}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// CTA BANNER
// ─────────────────────────────────────────────
const CTABanner = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-banner">
      {/* FLOWER DECORATIONS */}
      <MandalaDecor size={300} color="white" opacity={0.06} className="cta-mandala-1" />
      <MandalaDecor size={180} color="white" opacity={0.07} className="cta-mandala-2" />
      <FlowerDecor size={80} color="white" opacity={0.1} className="cta-flower-1" />
      <FlowerDecor size={55} color="white" opacity={0.08} className="cta-flower-2" />
      <PetalRing size={200} color="white" opacity={0.05} className="cta-petal" />

      <div className="cta-content">
        <Heart size={40} fill="white" color="white" className="cta-heart" />
        <h2>Ready to Begin Your Journey?</h2>
        <p>Create your free profile today and let us help you find your perfect life partner.</p>
        <button className="btn-white-lg" onClick={() => navigate("/register")}>
          Create Your Free Profile <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
const Footer = () => (
  <footer className="footer">
    {/* FLOWER DECORATIONS */}
    <FlowerDecor size={60} color="#DDC3C3" opacity={0.15} className="footer-flower-1" />
    <FlowerDecor size={40} color="#A376A2" opacity={0.12} className="footer-flower-2" />

    <div className="footer-top">
      <div className="footer-brand">
        <div className="footer-logo">
          <Heart size={20} fill="#DDC3C3" color="#DDC3C3" />
          <span>PhirseShaadi</span>
        </div>
        <p>A trusted matrimonial platform — from match to marriage.</p>
        <div className="footer-social">
          <a href="#"><Instagram size={18} /></a>
          <a href="#"><Facebook size={18} /></a>
          <a href="#"><Twitter size={18} /></a>
        </div>
      </div>
      <div className="footer-links">
        <div className="footer-col">
          <h4>Platform</h4>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
          <a href="/search">Search</a>
          <a href="/premium">Premium</a>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">Wedding Planning</a>
          <a href="#">Honeymoon Packages</a>
          <a href="#">Astrology</a>
          <a href="#">Vendor Marketplace</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2025 PhirseShaadi. All rights reserved.</p>
    </div>
  </footer>
);

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
const LandingPage = () => (
  <div className="landing">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <Plans />
    <CTABanner />
    <Footer />
  </div>
);

export default LandingPage;