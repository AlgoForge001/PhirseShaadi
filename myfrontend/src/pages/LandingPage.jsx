import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Shield, Lock, Star, MessageCircle, Sparkles,
  CheckCircle, Users, Award, MapPin, ChevronRight,
  Menu, X, Phone, Mail, Instagram, Facebook, Twitter,
  Gem, Calendar, Camera, UserCheck, Search, Bell
} from "lucide-react";
import "./LandingPage.css";

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
        <span>BandhanSetu</span>
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
        <li><a href="#howitworks" onClick={() => setMenuOpen(false)}>How It Works</a></li>
        <li><a href="#stories" onClick={() => setMenuOpen(false)}>Success Stories</a></li>
        <li><a href="#plans" onClick={() => setMenuOpen(false)}>Plans</a></li>
      </ul>

      <div className="nav-buttons">
        {/* TODO [BACKEND]: GET /api/auth/login */}
        <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
        {/* TODO [BACKEND]: POST /api/auth/register */}
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
      <div className="hero-left">
        <div className="hero-tag">
          <Award size={14} />
          India's #1 Matrimonial Platform
        </div>
        <h1>
          Where Every<br />
          <span className="grad-text">Love Story</span><br />
          Begins
        </h1>
        <p>
          AI-powered matchmaking, verified profiles, and an end-to-end
          journey — from your first hello to your wedding day.
        </p>
        <div className="hero-btns">
          {/* TODO [BACKEND]: POST /api/auth/register */}
          <button className="btn-primary-lg" onClick={() => navigate("/register")}>
            Create Free Profile <ChevronRight size={18} />
          </button>
          <button className="btn-secondary-lg" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
        <div className="hero-stats">
          <div className="hstat"><span>50L+</span><p>Profiles</p></div>
          <div className="hstat-divider" />
          <div className="hstat"><span>10L+</span><p>Marriages</p></div>
          <div className="hstat-divider" />
          <div className="hstat"><span>500+</span><p>Communities</p></div>
          <div className="hstat-divider" />
          <div className="hstat"><span>4.8</span><p>Rating</p></div>
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-ring-bg" />
        <div className="profile-float pf1">
          <div className="pf-avatar"><Users size={28} color="#6B3F69" /></div>
          <div className="pf-info">
            <strong>Priya Sharma</strong>
            <span>Software Engineer • Mumbai</span>
            <span className="pf-verified">
              <CheckCircle size={12} color="#2e7d32" /> ID Verified
            </span>
          </div>
        </div>
        <div className="match-center">
          <Heart size={28} fill="#6B3F69" color="#6B3F69" />
          <div className="match-score">96% Match</div>
        </div>
        <div className="profile-float pf2">
          <div className="pf-avatar"><Users size={28} color="#6B3F69" /></div>
          <div className="pf-info">
            <strong>Arjun Mehta</strong>
            <span>Doctor • Pune</span>
            <span className="pf-verified">
              <CheckCircle size={12} color="#2e7d32" /> ID Verified
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
// TRUST BAR
// ─────────────────────────────────────────────
const TrustBar = () => (
  <div className="trust-bar">
    <span><Award size={15} /> Award Winning</span>
    <span><Shield size={15} /> Verified Profiles</span>
    <span><Sparkles size={15} /> AI Matchmaking</span>
    <span><Lock size={15} /> Secure Chats</span>
    <span><Star size={15} /> 4.8 Star Rated</span>
    <span><Users size={15} /> Global Community</span>
  </div>
);

// ─────────────────────────────────────────────
// FEATURES
// ─────────────────────────────────────────────
const features = [
  { icon: <Sparkles size={26} color="white" />, title: "AI Matchmaking", desc: "Smart compatibility engine analyses behaviour, values & life goals to find your perfect match.", color: "#6B3F69" },
  { icon: <UserCheck size={26} color="white" />, title: "Verified Profiles", desc: "Govt ID, Aadhaar, selfie & video KYC. Only real people, zero fakes.", color: "#8D5F8C" },
  { icon: <Shield size={26} color="white" />, title: "Privacy & Safety", desc: "Incognito mode, watermarked photos, anti-screenshot & encrypted documents.", color: "#A376A2" },
  { icon: <Star size={26} color="white" />, title: "Kundli Matching", desc: "Auto Kundli generation, Gun Milan & live astrologer consultations.", color: "#6B3F69" },
  { icon: <MessageCircle size={26} color="white" />, title: "Secure Chat", desc: "Masked calls, anti-forwarding & auto-delete for total privacy.", color: "#8D5F8C" },
  { icon: <Gem size={26} color="white" />, title: "Wedding Services", desc: "End-to-end wedding planning — venues, vendors, Pandit, Qazi & more.", color: "#A376A2" },
];

const Features = () => (
  <section className="features" id="features">
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
  { icon: <UserCheck size={30} color="#6B3F69" />, step: "01", title: "Create Profile", desc: "Sign up and build your detailed profile with photos, horoscope & preferences." },
  { icon: <Shield size={30} color="#6B3F69" />, step: "02", title: "Get Verified", desc: "Complete ID & selfie verification to unlock all features and build trust." },
  { icon: <Search size={30} color="#6B3F69" />, step: "03", title: "Discover Matches", desc: "AI-recommended profiles filtered by community, location & compatibility." },
  { icon: <MessageCircle size={30} color="#6B3F69" />, step: "04", title: "Connect Safely", desc: "Chat, call and meet your match — all within our secure platform." },
];

const HowItWorks = () => (
  <section className="howitworks" id="howitworks">
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
// TESTIMONIALS
// ─────────────────────────────────────────────
const testimonials = [
  {
    names: "Rahul & Sneha",
    community: "Brahmin • Delhi",
    text: "We matched in 3 days and got married in 8 months. BandhanSetu made the whole journey magical and secure.",
    stars: 5,
  },
  {
    names: "Imran & Zara",
    community: "Muslim • Hyderabad",
    text: "The community filters and verified profiles gave our families so much confidence. Highly recommended!",
    stars: 5,
  },
  {
    names: "Karthik & Divya",
    community: "Tamil Brahmin • Chennai",
    text: "Kundli matching plus AI suggestions — the best combination! Our horoscopes matched perfectly.",
    stars: 5,
  },
];

const Testimonials = () => (
  <section className="testimonials" id="stories">
    <div className="sec-label">SUCCESS STORIES</div>
    <h2 className="sec-title">Thousands Found <span className="grad-text">Their Forever</span></h2>
    <div className="test-grid">
      {testimonials.map((t, i) => (
        <div className="test-card" key={i}>
          <div className="test-stars">
            {[...Array(t.stars)].map((_, j) => (
              <Star key={j} size={16} fill="#6B3F69" color="#6B3F69" />
            ))}
          </div>
          <p>"{t.text}"</p>
          <div className="test-author">
            <div className="test-avatar"><Heart size={18} fill="#6B3F69" color="#6B3F69" /></div>
            <div>
              <strong>{t.names}</strong>
              <span>{t.community}</span>
            </div>
          </div>
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
      <div className="sec-label">MEMBERSHIP</div>
      <h2 className="sec-title">Choose Your <span className="grad-text">Perfect Plan</span></h2>
      <div className="plans-grid">
        {plans.map((p, i) => (
          <div className={`plan-card ${p.popular ? "popular" : ""}`} key={i}>
            {p.popular && <div className="popular-tag"><Star size={13} fill="white" color="white" /> Most Popular</div>}
            <div className="plan-header" style={{ background: p.color }}>
              <h3>{p.name}</h3>
              <div className="plan-price">{p.price}</div>
            </div>
            <ul className="plan-features">
              {p.features.map((f, j) => (
                <li key={j}><CheckCircle size={16} color="#6B3F69" /> {f}</li>
              ))}
            </ul>
            {/* TODO [BACKEND]: POST /api/payments/subscribe?plan={p.name.toLowerCase()} */}
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
      <div className="cta-content">
        <Heart size={40} fill="white" color="white" className="cta-heart" />
        <h2>Ready to Find Your Soulmate?</h2>
        <p>Join millions of families who trust BandhanSetu for a safe, meaningful matrimonial experience.</p>
        {/* TODO [BACKEND]: POST /api/auth/register */}
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
    <div className="footer-top">
      <div className="footer-brand">
        <div className="footer-logo">
          <Heart size={20} fill="#DDC3C3" color="#DDC3C3" />
          <span>BandhanSetu</span>
        </div>
        <p>India's most trusted matrimonial platform — from match to marriage.</p>
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
      <p>© 2025 BandhanSetu. All rights reserved. Made with love in India.</p>
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
    <TrustBar />
    <Features />
    <HowItWorks />
    <Testimonials />
    <Plans />
    <CTABanner />
    <Footer />
  </div>
);

export default LandingPage;