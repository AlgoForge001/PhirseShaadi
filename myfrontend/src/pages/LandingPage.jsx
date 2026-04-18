import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Users,
  Sparkles,
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
      <section className="hero hero-modern">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="lp-wrap hero-content-wrap">
          <div className="hero-copy center">
            <div className="hero-heart-row">
              <img src="https://img2.shaadi.com/assests/2025/images/homepage/Heart_Icon_Flat.svg" alt="Heart" style={{height: 44, marginRight: 12}} />
              <p className="hero-kicker">India's Most Trusted Matrimonial Platform</p>
            </div>
            <h1 className="hero-main-title">Find Your Forever</h1>
            <p className="hero-lead">
              Discover a world beyond matrimony. Verified profiles, AI-powered matching, and complete privacy control.
            </p>
            <div className="hero-badges hero-badges-modern">
              <span><ShieldCheck size={15} /> Verified Profiles</span>
              <span><Users size={15} /> Smart Matching</span>
              <span><Sparkles size={15} /> Privacy Protected</span>
            </div>
            <div className="hero-login-wrap">
              <button className="btn solid hero-login-btn" onClick={() => navigate("/register")}> 
                Start Today <ArrowRight size={16} />
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
