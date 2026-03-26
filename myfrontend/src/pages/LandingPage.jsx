import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart, faSearch, faCheckCircle, faShield,
  faArrowRight, faUsers, faComments, faStar,
  faChevronDown, faChevronUp, faMapPin, faInfoCircle,
  faQuestionCircle, faHeadset, faBell, faLock
} from "@fortawesome/free-solid-svg-icons";

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqItems = [
    {
      id: 1,
      icon: faQuestionCircle,
      category: "Getting Started",
      question: "How does PhirseShaadi work?",
      answer: "PhirseShaadi is an AI-powered matrimonial platform that uses advanced matching algorithms to connect you with compatible partners. Simply create a detailed profile, set your preferences, and let our system suggest matches based on values, lifestyle, location, and interests."
    },
    {
      id: 2,
      icon: faShield,
      category: "Safety & Security",
      question: "Is my personal information safe on PhirseShaadi?",
      answer: "Absolutely! We implement bank-level encryption (SSL 256-bit) for all data. Your personal details are never shared with third parties without consent. You have complete control over your visibility, and we employ 24/7 security monitoring to prevent fraud."
    },
    {
      id: 3,
      icon: faUsers,
      category: "Membership",
      question: "What is the difference between free and paid membership?",
      answer: "Free members can create profiles and browse matches. Premium members get unlimited messaging, advanced filters (caste, subcaste, education), priority visibility in search results, and profile verification badges. Premium also includes AI-powered match recommendations."
    },
    {
      id: 4,
      icon: faBell,
      category: "Communication",
      question: "How can I contact other members?",
      answer: "Send an interest to profiles you like. If they accept, you unlock direct messaging. You can also use our video chat feature (Premium only) to get to know matches better before deciding to meet. All conversations are private and encrypted."
    },
    {
      id: 5,
      icon: faLock,
      category: "Account Management",
      question: "Can I delete my profile anytime?",
      answer: "Yes! You can deactivate your profile temporarily (keeps data for 3 months) or permanently delete it from account settings. Permanent deletion removes all your data within 30 days per GDPR compliance. You won't be visible to others immediately after deactivation."
    },
    {
      id: 6,
      icon: faHeadset,
      category: "Mobile & Support",
      question: "Is there a mobile app and customer support?",
      answer: "Yes! PhirseShaadi is available on iOS and Android with the same features as the web version. Our customer support team is available 24/7 via chat, email, and phone. Premium members get priority support with response times under 2 hours."
    }
  ];

  const communities = [
    "All Communities", "Hindu", "Muslim", "Christian", "Sikh", 
    "Jain", "Buddhist", "Brahmin", "Kshatriya", "Vaishya"
  ];

  const locations = [
    "All Locations", "Mumbai", "Delhi", "Bangalore", "Hyderabad",
    "Chennai", "Kolkata", "Pune", "Ahmedabad", "Chandigarh"
  ];

  const religions = [
    "All Religions", "Hindu", "Muslim", "Christian", "Sikh",
    "Jain", "Buddhist", "Parsi", "Jewish"
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="landing-page">
      {/* ══════════════════════════════════════════════════════════ */}
      {/* NAVBAR */}
      {/* ══════════════════════════════════════════════════════════ */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            <FontAwesomeIcon icon={faHeart} size="lg" />
            <span>PhirseShaadi</span>
          </div>
          <div className="navbar-links">
            <a href="#about" className="navbar-link">
              <FontAwesomeIcon icon={faInfoCircle} /> About
            </a>
            <a href="#help" className="navbar-link">
              <FontAwesomeIcon icon={faQuestionCircle} /> Help
            </a>
          </div>
          <div className="navbar-spacer"></div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="hero-with-image">
        <div className="hero-image-bg">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop" 
            alt="Indian Wedding Couple"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content-overlay">
          <div className="hero-text-section">
            <h1 className="hero-title">
              "Love is not about finding a perfect person.<br />It's about finding someone perfect for you."
            </h1>

            <p className="hero-subtitle">
              At PhirseShaadi, we believe in genuine connections built on trust, 
              authenticity, and shared values. Start your matrimonial journey today.
            </p>

            {token ? (
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary-large"
                  onClick={() => navigate("/search")}
                >
                  <FontAwesomeIcon icon={faSearch} /> Browse Profiles
                </button>
                <button 
                  className="btn btn-secondary-large"
                  onClick={() => navigate("/dashboard")}
                >
                  <FontAwesomeIcon icon={faHeart} /> My Dashboard
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary-large"
                onClick={() => navigate("/register")}
              >
                Get Started <FontAwesomeIcon icon={faArrowRight} />
              </button>
            )}

            <div className="hero-trust">
              <FontAwesomeIcon icon={faShield} />
              <span>100% Secure & Verified Profiles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four Simple Steps to Find Your Match</p>
        </div>

        <div className="timeline-container">
          <div className="timeline-item">
            <div className="timeline-circle step-1">
              <FontAwesomeIcon icon={faHeart} size="2x" />
            </div>
            <div className="timeline-content">
              <h3>Create Your Profile</h3>
              <p>Share your details, upload photos, and describe what you're looking for in a partner.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-circle step-2">
              <FontAwesomeIcon icon={faSearch} size="2x" />
            </div>
            <div className="timeline-content">
              <h3>Explore Matches</h3>
              <p>Use our smart filters to find profiles that match your preferences and values.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-circle step-3">
              <FontAwesomeIcon icon={faHeart} size="2x" />
            </div>
            <div className="timeline-content">
              <h3>Send Interest</h3>
              <p>Show interest to the profiles you like and wait for their response.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-circle step-4">
              <FontAwesomeIcon icon={faComments} size="2x" />
            </div>
            <div className="timeline-content">
              <h3>Connect & Build</h3>
              <p>Chat with matched profiles and build meaningful connections.</p>
            </div>
          </div>
        </div>
      </section>
      {/* ══════════════════════════════════════════════════════════ */}
{/* FEATURES - WHY CHOOSE US */}
{/* ══════════════════════════════════════════════════════════ */}
<section className="features">
  <div className="features-background">
    <div className="features-blob features-blob-1"></div>
    <div className="features-blob features-blob-2"></div>
  </div>

  <div className="section-header">
    <h2>Why Choose PhirseShaadi?</h2>
    <p>Built on trust, authenticity, and genuine connections</p>
  </div>

  <div className="features-grid">
    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">01</div>
        <div className="feature-icon icon-verified">
          <FontAwesomeIcon icon={faCheckCircle} size="2x" />
        </div>
      </div>
      <h3>Verified Profiles</h3>
      <p>All members are verified for authenticity and safety. We ensure genuine, trustworthy connections.</p>
    </div>

    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">02</div>
        <div className="feature-icon icon-secure">
          <FontAwesomeIcon icon={faShield} size="2x" />
        </div>
      </div>
      <h3>Privacy First</h3>
      <p>Your information is encrypted and protected. You have complete control over your visibility and data.</p>
    </div>

    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">03</div>
        <div className="feature-icon icon-chat">
          <FontAwesomeIcon icon={faComments} size="2x" />
        </div>
      </div>
      <h3>Easy Communication</h3>
      <p>Connect directly with matches through our secure messaging platform. Build relationships at your pace.</p>
    </div>

    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">04</div>
        <div className="feature-icon icon-search">
          <FontAwesomeIcon icon={faSearch} size="2x" />
        </div>
      </div>
      <h3>Smart Filters</h3>
      <p>Find matches based on values, lifestyle, and preferences that truly matter to you.</p>
    </div>

    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">05</div>
        <div className="feature-icon icon-mobile">
          <FontAwesomeIcon icon={faHeart} size="2x" />
        </div>
      </div>
      <h3>Mobile App</h3>
      <p>Browse and connect on the go. Available on iOS and Android for your convenience.</p>
    </div>

    <div className="feature-box">
      <div className="feature-top">
        <div className="feature-number">06</div>
        <div className="feature-icon icon-support">
          <FontAwesomeIcon icon={faHeadset} size="2x" />
        </div>
      </div>
      <h3>24/7 Support</h3>
      <p>Get help anytime. Our dedicated support team is here to assist you throughout your journey.</p>
    </div>
  </div>
</section>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* BROWSE BY CATEGORY */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="browse-section">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find matches within your community and preferences</p>
        </div>

        <div className="browse-grid">
          <div className="browse-category">
            <div className="browse-header">
              <FontAwesomeIcon icon={faHeart} className="browse-icon" />
              <h3>By Community</h3>
            </div>
            <div className="browse-items">
              {communities.map((comm, i) => (
                <button 
                  key={i} 
                  className="browse-item"
                >
                  <span className="item-text">{comm}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="item-icon" />
                </button>
              ))}
            </div>
          </div>

          <div className="browse-category">
            <div className="browse-header">
              <FontAwesomeIcon icon={faMapPin} className="browse-icon" />
              <h3>By City</h3>
            </div>
            <div className="browse-items">
              {locations.map((loc, i) => (
                <button 
                  key={i} 
                  className="browse-item"
                >
                  <span className="item-text">{loc}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="item-icon" />
                </button>
              ))}
            </div>
          </div>

          <div className="browse-category">
            <div className="browse-header">
              <FontAwesomeIcon icon={faUsers} className="browse-icon" />
              <h3>By Religion</h3>
            </div>
            <div className="browse-items">
              {religions.map((rel, i) => (
                <button 
                  key={i} 
                  className="browse-item"
                >
                  <span className="item-text">{rel}</span>
                  <FontAwesomeIcon icon={faArrowRight} className="item-icon" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* FAQ */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="faq-section">
        <div className="faq-background">
          <div className="faq-blob faq-blob-1"></div>
          <div className="faq-blob faq-blob-2"></div>
          <div className="faq-blob faq-blob-3"></div>
        </div>

        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about PhirseShaadi</p>
        </div>

        <div className="faq-container">
          <div className="faq-items-wrapper">
            {faqItems.map((item) => (
              <div 
                key={item.id} 
                className={`faq-item ${expandedFAQ === item.id ? "expanded" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(item.id)}
                >
                  <div className="faq-question-content">
                    <div className="faq-icon-badge">
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <div className="faq-question-text">
                      <span className="faq-category">{item.category}</span>
                      <span className="faq-number">{String(item.id).padStart(2, '0')}</span>
                      <p>{item.question}</p>
                    </div>
                  </div>
                  
                  <div className="faq-toggle-icon">
                    {expandedFAQ === item.id ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </div>
                </button>

                {expandedFAQ === item.id && (
                  <div className="faq-answer">
                    <div className="faq-answer-content">
                      <div className="answer-icon">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>Our support team is here to help 24/7</p>
          <div className="faq-contact-buttons">
            <button className="faq-btn faq-btn-primary">
              <FontAwesomeIcon icon={faHeadset} /> Contact Support
            </button>
            <button className="faq-btn faq-btn-secondary">
              <FontAwesomeIcon icon={faQuestionCircle} /> Browse Help Center
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* FINAL CTA */}
      {/* ══════════════════════════════════════════════════════════ */}
      {!token && (
        <section className="final-cta">
          <h2>Ready to Find Your Match?</h2>
          <p>Join thousands who are building meaningful connections on PhirseShaadi</p>
          <button 
            className="btn btn-large"
            onClick={() => navigate("/register")}
          >
            Create Free Profile <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
{/* FOOTER */}
{/* ══════════════════════════════════════════════════════════ */}
<footer className="landing-footer">
  <div className="footer-content">
    {/* Footer Top */}
    <div className="footer-top">
      <div className="footer-column footer-brand">
        <div className="footer-logo">
          <FontAwesomeIcon icon={faHeart} style={{ color: '#A376A2' }} />
          <span>PhirseShaadi</span>
        </div>
        <p className="footer-description">
          A matrimonial platform dedicated to helping you find your perfect life partner with trust, authenticity, and genuine connections.
        </p>
        <div className="footer-social">
          <a href="#" className="social-icon" title="Facebook">
            <FontAwesomeIcon icon={faHeart} />
          </a>
          <a href="#" className="social-icon" title="Instagram">
            <FontAwesomeIcon icon={faHeart} />
          </a>
          <a href="#" className="social-icon" title="Twitter">
            <FontAwesomeIcon icon={faHeart} />
          </a>
          <a href="#" className="social-icon" title="LinkedIn">
            <FontAwesomeIcon icon={faHeart} />
          </a>
        </div>
      </div>

      {/* Platform Links */}
      <div className="footer-column">
        <h4>Platform</h4>
        <ul>
          <li><a href="#about">About Us</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#success">Success Stories</a></li>
          <li><a href="#blog">Blog & Articles</a></li>
          <li><a href="#careers">Careers</a></li>
          <li><a href="#press">Press Kit</a></li>
        </ul>
      </div>

      {/* Support Links */}
      <div className="footer-column">
        <h4>Support & Help</h4>
        <ul>
          <li><a href="#faq">FAQ</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="#safety">Safety Tips</a></li>
          <li><a href="#help">Help Center</a></li>
          <li><a href="#community">Community Guidelines</a></li>
          <li><a href="#report">Report Abuse</a></li>
        </ul>
      </div>

      {/* Legal Links */}
      <div className="footer-column">
        <h4>Legal & Privacy</h4>
        <ul>
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#cookies">Cookie Policy</a></li>
          <li><a href="#security">Security</a></li>
          <li><a href="#compliance">Compliance</a></li>
          <li><a href="#gdpr">GDPR</a></li>
        </ul>
      </div>

      {/* Download App */}
      <div className="footer-column footer-app">
        <h4>Download App</h4>
        <div className="app-download-buttons">
          <a href="#" className="app-download-btn ios-btn">
            <FontAwesomeIcon icon={faHeart} />
            <div>
              <div className="app-label">Download on</div>
              <div className="app-name">App Store</div>
            </div>
          </a>
          <a href="#" className="app-download-btn android-btn">
            <FontAwesomeIcon icon={faHeart} />
            <div>
              <div className="app-label">Get it on</div>
              <div className="app-name">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </div>

    {/* Footer Divider */}
    <div className="footer-divider"></div>

    {/* Footer Bottom */}
    <div className="footer-bottom">
      <div className="footer-bottom-left">
        <p>&copy; 2026 PhirseShaadi. All rights reserved.</p>
        <p className="footer-tagline">Building meaningful connections across India with trust and authenticity.</p>
      </div>

      <div className="footer-bottom-right">
        <div className="footer-languages">
          <span className="language-label">Available in:</span>
          <a href="#" className="language-badge">English</a>
          <a href="#" className="language-badge">हिंदी</a>
          <a href="#" className="language-badge">मराठी</a>
        </div>
      </div>
    </div>
  </div>

  {/* Floating decoration */}
  <div className="footer-decoration footer-deco-1"></div>
  <div className="footer-decoration footer-deco-2"></div>
</footer>
    </div>
  );
};

export default LandingPage;
