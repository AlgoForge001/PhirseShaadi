import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShieldCheck,
  Users,
  Sparkles,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "What makes PhirseShaadi different from other matrimonial sites?",
      answer: "PhirseShaadi combines intelligent matchmaking with verified profiles and strong privacy controls. Our smart filters help you find partners based on location, values, and lifestyle preferences. We focus on meaningful connections for both individuals and families, with a transparent and secure environment.",
    },
    {
      id: 2,
      question: "How are profiles verified on PhirseShaadi?",
      answer: "All profiles go through a verification process to ensure authenticity. Members can add photos, complete their profile information, and optional background checks are available. This helps build trust and ensures you're connecting with genuine people.",
    },
    {
      id: 3,
      question: "Can I control who sees my profile?",
      answer: "Yes, we provide complete privacy controls. You can choose who views your profile, manage your visibility settings, and customize your privacy preferences. You also have the option to hide your profile at any time or make it visible only to specific users.",
    },
    {
      id: 4,
      question: "How does the matching algorithm work?",
      answer: "Our matching system considers multiple factors including location, age preferences, religion, lifestyle choices, and personal values. When you set your partner preferences and complete your profile, our system suggests relevant matches. You can also browse profiles using advanced filters.",
    },
    {
      id: 5,
      question: "Is my personal information safe on PhirseShaadi?",
      answer: "Your safety and privacy are our top priorities. We use secure encryption for all data, don't share information with third parties, and put you in control of what's visible. Messages are private, and you decide which contact details to share.",
    },
    {
      id: 6,
      question: "How do I get started?",
      answer: "Simply register with your basic details, complete your profile with photos and preferences, and start exploring matches. You can browse profiles, send interests, and chat with matched profiles. The entire signup process takes just a few minutes.",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-wrap nav-inner">
          <div className="brand" onClick={() => navigate("/")}>
            <Heart size={18} />
            <span>PhirseShaadi</span>
          </div>

          <div className="nav-links">
            <button className="link-btn" onClick={() => navigate("/about")}>About</button>
            <button className="link-btn" onClick={() => navigate("/login")}>Help</button>
          </div>

          <div className="nav-actions">
            <button className="btn ghost" onClick={() => navigate("/login")}>Login</button>
            <button className="btn solid" onClick={() => navigate("/register")}>Register Free</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="lp-wrap hero-content-wrap">
          <div className="hero-copy center">
            <p className="hero-kicker">India's Trusted Matrimonial Platform</p>
            <h1>Find Your Perfect Match with Confidence</h1>
            <p className="hero-lead">
              Meaningful connections for individuals and families. Verified profiles, smart filters, and complete privacy control.
            </p>

            <div className="hero-badges">
              <span><ShieldCheck size={15} /> Verified Profiles</span>
              <span><Users size={15} /> Smart Matching</span>
              <span><Sparkles size={15} /> Privacy Protected</span>
            </div>
          </div>

          {/* SEARCH SECTION */}
          <div className="search-strip-shell" role="region" aria-label="Partner search">
            <div className="search-strip-header">
              <div className="search-title-row">
                <span className="search-title-chip">
                  <Star size={14} /> Personalized Search
                </span>
              </div>
              <h3>Find Your Matches</h3>
              <p>Set your preferences and discover perfect matches</p>
              <div className="search-strip-meta" aria-label="Search highlights">
                <span>Curated matches</span>
                <span>Private & secure</span>
                <span>Fast search</span>
              </div>
            </div>

            <div className="search-strip">
              <div className="field-group">
                <label>Looking For</label>
                <select defaultValue="Bride">
                  <option>Bride</option>
                  <option>Groom</option>
                </select>
              </div>

              <div className="field-group">
                <label>Age</label>
                <select defaultValue="21 to 28">
                  <option>21 to 28</option>
                  <option>24 to 30</option>
                  <option>28 to 35</option>
                  <option>35 to 40</option>
                </select>
              </div>

              <div className="field-group">
                <label>Religion</label>
                <select defaultValue="Any">
                  <option>Any</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Sikh</option>
                </select>
              </div>

              <div className="field-group">
                <label>City</label>
                <input placeholder="Enter city" />
              </div>

              <button className="btn solid search-btn" onClick={() => navigate(token ? "/search" : "/register")}>
                <Search size={16} /> Find Matches
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose">
        <div className="lp-wrap">
          <div className="section-header">
            <h2 className="section-title">Why Choose PhirseShaadi?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <ShieldCheck size={32} className="feature-icon" />
              <h4>Verified & Safe</h4>
              <p>All profiles are verified. Advanced privacy controls let you decide who sees your information.</p>
            </div>
            <div className="feature-card">
              <Users size={32} className="feature-icon" />
              <h4>Smart Matching</h4>
              <p>Our intelligent system matches you based on preferences, values, and lifestyle choices.</p>
            </div>
            <div className="feature-card">
              <Heart size={32} className="feature-icon" />
              <h4>Meaningful Connections</h4>
              <p>Designed for serious relationships. Connect with people looking for the same commitment.</p>
            </div>
            <div className="feature-card">
              <Sparkles size={32} className="feature-icon" />
              <h4>Easy To Use</h4>
              <p>Simple profile creation, intuitive browse, and secure messaging. All in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="steps">
        <div className="lp-wrap">
          <div className="section-header">
            <h2 className="section-title">How PhirseShaadi Works</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span>1</span>
              <h4>Create Your Profile</h4>
              <p>Sign up and tell us about yourself. Add photos, preferences, and partner criteria in just minutes.</p>
            </div>
            <div className="step-card">
              <span>2</span>
              <h4>Get Smart Matches</h4>
              <p>Our system suggests relevant profiles. Use filters to refine your search by location, age, values.</p>
            </div>
            <div className="step-card">
              <span>3</span>
              <h4>Connect & Chat</h4>
              <p>Send interest to profiles you like. Chat securely and get to know your matches better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST METRICS SECTION */}
      <section className="trust-strip">
        <div className="lp-wrap trust-grid">
          <div>
            <strong>50L+</strong>
            <p>Active Members</p>
          </div>
          <div>
            <strong>10L+</strong>
            <p>Success Stories</p>
          </div>
          <div>
            <strong>4.8 ★</strong>
            <p>Member Rating</p>
          </div>
          <div>
            <strong>100%</strong>
            <p>Privacy Control</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="lp-wrap">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
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

      {/* FINAL CTA SECTION */}
      <section className="final-cta">
        <div className="lp-wrap final-cta-inner">
          <div className="cta-content">
            <h3>Ready to Start Your Journey?</h3>
            <p>Join thousands of members finding their perfect match on PhirseShaadi.</p>
          </div>
          <button className="btn solid cta-button" onClick={() => navigate(token ? "/dashboard" : "/register")}>
            {token ? "Go to Dashboard" : "Create Free Profile"} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>PhirseShaadi</h4>
            <p>Making matrimony accessible and authentic for everyone.</p>
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
          <p>&copy; 2026 PhirseShaadi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
