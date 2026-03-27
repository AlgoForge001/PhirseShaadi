import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Target, Users, Leaf } from "lucide-react";
import "./About.css";

const About = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(1);

  const cards = [
    {
      id: 1,
      icon: <Target size={40} />,
      title: "Our Mission",
      shortDesc: "What we aim to achieve",
      fullDesc: `Our mission at PhirseShaadi is to revolutionize the matrimonial experience by creating a safe, transparent, and inclusive platform where genuine connections are fostered. We believe that finding a life partner should be a respectful and joyful journey. Through advanced technology and rigorous verification processes, we empower individuals and families to find their perfect match while maintaining the values and traditions that matter most to them.`
    },
    {
      id: 2,
      icon: <Heart size={40} />,
      title: "Our Vision",
      shortDesc: "Where we're headed",
      fullDesc: `Our vision is to become the world's most trusted matrimonial platform. We aspire to build a world where meaningful relationships are built on mutual respect, shared values, and genuine compatibility. By leveraging technology and human-centered design, we aim to create a seamless experience that helps people find not just a spouse, but a true life partner.`
    },
    {
      id: 3,
      icon: <Users size={40} />,
      title: "About Us",
      shortDesc: "Who we are",
      fullDesc: `PhirseShaadi is a modern matrimonial platform founded with the vision of transforming the way people find their life partners. Our team comprises experienced professionals from diverse backgrounds—engineers, developers, and matrimonial experts—all united by a single goal: to help people find genuine, lasting connections. Every feature on our platform is designed with our users in mind, ensuring that your journey to finding your perfect match is smooth, safe, and successful.`
    },
    {
      id: 4,
      icon: <Leaf size={40} />,
      title: "We Care",
      shortDesc: "Our commitment to you",
      fullDesc: `At PhirseShaadi, we care deeply about our community and the impact we make. We are committed to protecting your privacy and data security with industry-leading encryption and strict confidentiality policies. We actively work against fraud and deception by verifying every profile. Our customer support team is available to help you with any questions or concerns. Your trust is our most valuable asset, and we work tirelessly to earn and maintain it every single day.`
    }
  ];

  const selectedCardData = cards.find(card => card.id === selectedCard);

  return (
    <div className="about-page">
      {/* Navigation */}
      <nav className="about-navbar">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={() => navigate("/")}>
            <Heart size={24} fill="#fff" color="#fff" />
            <span>PhirseShaadi</span>
          </div>
          <button className="nav-btn" onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About PhirseShaadi</h1>
          <p>Building Meaningful Connections, Creating Happy Families</p>
        </div>
        <div className="hero-decoration">
          <div className="deco-blob blob-1"></div>
          <div className="deco-blob blob-2"></div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="about-intro">
        <div className="intro-container">
          <h2>Welcome to PhirseShaadi</h2>
          <p>
            We are more than just a matrimonial platform. We are a community dedicated to helping people find genuine, 
            lasting connections based on mutual respect, shared values, and true compatibility. Our journey began with a 
            simple belief: everyone deserves the chance to find their perfect life partner in a safe, transparent, and 
            respectful environment.
          </p>
        </div>
      </section>

      {/* Cards & Display Section */}
      <section className="about-cards">
        <div className="cards-container">
          <h2 className="section-title">Our Story</h2>
          
          {/* Cards Grid */}
          <div className="cards-grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card ${selectedCard === card.id ? "active" : ""}`}
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p className="card-short">{card.shortDesc}</p>
                <div className={`card-indicator ${selectedCard === card.id ? "active" : ""}`}>
                  {selectedCard === card.id ? "✓ Selected" : "Click to read"}
                </div>
              </div>
            ))}
          </div>

          {/* Paragraph Display Section */}
          <div className="paragraph-display">
            <div className="display-header">
              <div className="display-icon">{selectedCardData.icon}</div>
              <h3>{selectedCardData.title}</h3>
            </div>
            <div className="display-content">
              <p>{selectedCardData.fullDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="values-container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h4>Trust & Transparency</h4>
              <p>We believe in complete honesty and openness in all our operations and interactions with our community.</p>
            </div>
            <div className="value-card">
              <h4>Inclusivity</h4>
              <p>We celebrate diversity and welcome people from all backgrounds, religions, and communities.</p>
            </div>
            <div className="value-card">
              <h4>Innovation</h4>
              <p>We continuously improve our platform using technology to enhance user experience.</p>
            </div>
            <div className="value-card">
              <h4>Safety First</h4>
              <p>Protecting our users' privacy and security is our top priority in everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <h2>Ready to Find Your Perfect Match?</h2>
          <p>Join us in finding genuine connections</p>
          <button className="cta-btn" onClick={() => navigate("/register")}>
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
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

export default About;