import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import couplesImg from "../couples.jpg";
import {
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Star,
  MessageCircleHeart,
  Lock,
  Search,
  UserCheck,
  Send,
} from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What makes MarriageSphere different from other matrimonial sites?",
      answer:
        "MarriageSphere combines intelligent matchmaking with verified profiles and strong privacy controls. Our smart filters help you find partners based on location, values, and lifestyle preferences. We focus on meaningful connections for both individuals and families, with a transparent and secure environment.",
    },
    {
      id: 2,
      question: "How are profiles verified on MarriageSphere?",
      answer:
        "All profiles go through a verification process to ensure authenticity. Members can add photos, complete their profile information, and optional background checks are available. This helps build trust and ensures you're connecting with genuine people.",
    },
    {
      id: 3,
      question: "Can I control who sees my profile?",
      answer:
        "Yes, we provide complete privacy controls. You can choose who views your profile, manage your visibility settings, and customize your privacy preferences. You also have the option to hide your profile at any time or make it visible only to specific users.",
    },
    {
      id: 4,
      question: "How does the matching algorithm work?",
      answer:
        "Our matching system considers multiple factors including location, age preferences, religion, lifestyle choices, and personal values. When you set your partner preferences and complete your profile, our system suggests relevant matches. You can also browse profiles using advanced filters.",
    },
    {
      id: 5,
      question: "Is my personal information safe on MarriageSphere?",
      answer:
        "Your safety and privacy are our top priorities. We use secure encryption for all data, don't share information with third parties, and put you in control of what's visible. Messages are private, and you decide which contact details to share.",
    },
    {
      id: 6,
      question: "How do I get started?",
      answer:
        "Simply register with your basic details, complete your profile with photos and preferences, and start exploring matches. You can browse profiles, send interests, and chat with matched profiles. The entire signup process takes just a few minutes.",
    },
  ];

  const successStories = [
    {
      names: "Priya & Rahul",
      location: "Mumbai",
      quote:
        "We never thought an online platform could lead to something so real. MarriageSphere helped us find each other effortlessly.",
      rating: 5,
    },
    {
      names: "Anita & Vikram",
      location: "Delhi",
      quote:
        "The matching algorithm truly understood our preferences. We're now happily married and grateful for this beautiful journey.",
      rating: 5,
    },
    {
      names: "Sneha & Arjun",
      location: "Bangalore",
      quote:
        "Privacy controls gave us the confidence to explore. We found a genuine connection and it's been magical ever since.",
      rating: 5,
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="lp">
      {/* ── NAVBAR ── */}
      <header className="lp-nav">
        <div className="lp-wrap nav-inner">
          <div className="brand" onClick={() => navigate("/")}>
            <img
              src="/Media.jpg"
              alt="MarriageSphere"
              className="lp-navbar-logo-img"
            />
          </div>

          <nav className="nav-links">
            <button className="link-btn" onClick={() => navigate("/about")}>
              About
            </button>
            <button className="link-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.openChatbot?.(); }}>
              Help
            </button>
          </nav>

          <div className="nav-actions">
            <button className="btn ghost" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn solid" onClick={() => navigate("/register")}>
              Register Free
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        {/* Full-width background image */}
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${couplesImg})` }}
        />
        {/* Gradient overlay */}
        <div className="hero-overlay" />

        <div className="lp-wrap hero-content-wrap">
          <div className="hero-copy">
            <div className="hero-kicker">
              <Sparkles size={12} />
              <span>India's Most Trusted Matrimonial Platform</span>
            </div>

            <h1 className="hero-main-title">
              Don't just search —<br />
              find your <span className="hero-highlight">life partner</span>
            </h1>

            {/* Gold decorative divider */}
            <div className="hero-divider">
              <Heart size={14} className="hero-divider-icon" fill="currentColor" />
            </div>

            <p className="hero-lead">
              Verified profiles, intelligent matching, and complete privacy
              control — everything you need to find the one who truly matters.
            </p>

            <div className="hero-badges">
              <span className="hero-badge">
                <ShieldCheck size={13} /> Verified Profiles
              </span>
              <span className="hero-badge">
                <Users size={13} /> Smart Matching
              </span>
              <span className="hero-badge">
                <Lock size={13} /> Privacy Protected
              </span>
            </div>

            <div className="hero-cta-group">
              <button
                className="btn solid hero-primary-btn"
                onClick={() => navigate("/register")}
              >
                Start Your Journey <ArrowRight size={16} />
              </button>
              <button
                className="btn hero-secondary-btn"
                onClick={() => navigate("/login")}
              >
                Already a Member?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE ── */}
      <section className="why-choose">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">Why Us</span>
            <h2 className="section-title">
              Everything You Need to Find <em>The One</em>
            </h2>
            <span className="section-title-underline" />
            <p className="section-subtitle">
              Built with care, security, and the latest technology to make your
              journey smooth and joyful.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <ShieldCheck size={28} />,
                title: "Verified & Safe",
                desc: "Every profile goes through a rigorous verification process. Advanced privacy controls let you decide who sees your information.",
              },
              {
                icon: <Search size={28} />,
                title: "Smart Matching",
                desc: "Our intelligent algorithm learns your preferences and suggests the most compatible matches based on values and lifestyle.",
              },
              {
                icon: <MessageCircleHeart size={28} />,
                title: "Meaningful Connections",
                desc: "Designed for serious relationships. Connect with people who share your vision of love, commitment, and family.",
              },
              {
                icon: <Sparkles size={28} />,
                title: "Premium Experience",
                desc: "Beautiful interface, intuitive navigation, and secure messaging. Everything crafted for a delightful experience.",
              },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="steps">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">
              Three Simple Steps to <em>Your Story</em>
            </h2>
            <span className="section-title-underline" />
            <p className="section-subtitle">
              Getting started is easy. Create your profile, discover matches, and
              begin a beautiful conversation.
            </p>
          </div>

          <div className="steps-grid">
            {[
              {
                num: "01",
                icon: <UserCheck size={24} />,
                title: "Create Your Profile",
                desc: "Sign up and tell us about yourself. Add photos, preferences, and partner criteria in just minutes.",
              },
              {
                num: "02",
                icon: <Search size={24} />,
                title: "Discover Matches",
                desc: "Our system suggests the most compatible profiles. Use smart filters to refine by location, age, and values.",
              },
              {
                num: "03",
                icon: <Send size={24} />,
                title: "Connect & Chat",
                desc: "Send interest to profiles you like. Chat securely and get to know your matches on a deeper level.",
              },
            ].map((s, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="stories-section">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">Love Stories</span>
            <h2 className="section-title">
              Real People, <em>Real Love</em>
            </h2>
            <span className="section-title-underline" />
            <p className="section-subtitle">
              Thousands of couples have found their soulmate through
              MarriageSphere. Here are some of their stories.
            </p>
          </div>

          <div className="stories-grid">
            {successStories.map((s, i) => (
              <div className="story-card" key={i}>
                <div className="story-quote-icon">
                  <Heart size={20} />
                </div>
                <p className="story-quote">"{s.quote}"</p>
                <div className="story-stars">
                  {[...Array(s.rating)].map((_, j) => (
                    <Star key={j} size={14} />
                  ))}
                </div>
                <div className="story-meta">
                  <span className="story-names">{s.names}</span>
                  <span className="story-location">{s.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-section">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">FAQ</span>
            <h2 className="section-title">
              Got Questions? <em>We've Got Answers</em>
            </h2>
            <span className="section-title-underline" />
          </div>

          <div className="faq-container">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className={`faq-item ${expandedFaq === item.id ? "expanded" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={expandedFaq === item.id}
                >
                  <span className="faq-number">{item.id}</span>
                  <span className="faq-text">{item.question}</span>
                  <ChevronDown size={18} className="faq-toggle-icon" />
                </button>
                {expandedFaq === item.id && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="lp-wrap final-cta-inner">
          <div className="cta-content">
            <Heart size={28} className="cta-heart-icon" />
            <h3>Ready to Start Your Journey?</h3>
            <p>
              Join thousands of happy members finding their perfect match on
              MarriageSphere. Your love story starts here.
            </p>
            <button
              className="btn solid cta-button"
              onClick={() =>
                navigate(
                  token
                    ? user?.role === "admin"
                      ? "/admin-dashboard"
                      : "/dashboard"
                    : "/register"
                )
              }
            >
              {token ? "Go to Dashboard" : "Create Free Profile"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="footer-content">
          <div className="footer-column footer-brand-col">
            <div className="footer-brand">
              <Heart size={16} />
              <h4>MarriageSphere</h4>
            </div>
            <p>
              Making matrimony accessible and authentic for everyone. Your
              trusted partner in finding love.
            </p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Tips</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Report Abuse</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MarriageSphere. All rights reserved.</p>
          <p className="footer-tagline">Made with ❤️ for meaningful connections</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;