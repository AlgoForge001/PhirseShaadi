import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Target, Users, Leaf, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

const About = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(1);

  const cards = [
    {
      id: 1,
      icon: <Target size={28} />,
      title: "Our Mission",
      shortDesc: "What we aim to achieve",
      fullDesc: `Our mission at Phirse Shaadi is to revolutionize the matrimonial experience by creating a safe, transparent, and inclusive platform where genuine connections are fostered. We believe that finding a life partner should be a respectful and joyful journey. Through advanced technology and rigorous verification processes, we empower individuals and families to find their perfect match while maintaining the values and traditions that matter most to them.`
    },
    {
      id: 2,
      icon: <Heart size={28} />,
      title: "Our Vision",
      shortDesc: "Where we're headed",
      fullDesc: `Our vision is to become the world's most trusted matrimonial platform. We aspire to build a world where meaningful relationships are built on mutual respect, shared values, and genuine compatibility. By leveraging technology and human-centered design, we aim to create a seamless experience that helps people find not just a spouse, but a true life partner.`
    },
    {
      id: 3,
      icon: <Users size={28} />,
      title: "About Us",
      shortDesc: "Who we are",
      fullDesc: `Phirse Shaadi is a modern matrimonial platform founded with the vision of transforming the way people find their life partners. Our team comprises experienced professionals from diverse backgrounds—engineers, developers, and matrimonial experts—all united by a single goal: to help people find genuine, lasting connections. Every feature on our platform is designed with our users in mind, ensuring that your journey to finding your perfect match is smooth, safe, and successful.`
    },
    {
      id: 4,
      icon: <Leaf size={28} />,
      title: "We Care",
      shortDesc: "Our commitment to you",
      fullDesc: `At Phirse Shaadi, we care deeply about our community and the impact we make. We are committed to protecting your privacy and data security with industry-leading encryption and strict confidentiality policies. We actively work against fraud and deception by verifying every profile. Our customer support team is available to help you with any questions or concerns. Your trust is our most valuable asset, and we work tirelessly to earn and maintain it every single day.`
    }
  ];

  const selectedCardData = cards.find(card => card.id === selectedCard);

  return (
    <div className="lp about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero hero">
        <div className="hero-overlay" />
        <div className="lp-wrap hero-content-wrap">
          <div className="hero-copy">
            <div className="hero-kicker">
              <Sparkles size={12} />
              <span>Building Meaningful Connections</span>
            </div>

            <h1 className="hero-main-title">
              About <span className="hero-highlight">Phirse Shaadi</span>
            </h1>

            <div className="hero-divider">
              <Heart size={14} className="hero-divider-icon" fill="currentColor" />
            </div>

            <p className="hero-lead">
              Creating Happy Families through verified profiles, intelligent matching, and a simple belief that everyone deserves their perfect life partner.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn solid hero-primary-btn"
                onClick={() => navigate("/register")}
              >
                Join Our Community <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-cards why-choose">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">Our Story</span>
            <h2 className="section-title">
              The Journey of <em>Phirse Shaadi</em>
            </h2>
            <span className="section-title-underline" />
            <p className="section-subtitle">
              Learn about our mission, vision, and deep commitment to helping you find a genuine, lasting connection.
            </p>
          </div>

          <div className="cards-grid features-grid">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`card feature-card ${selectedCard === card.id ? "active" : ""}`}
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="feature-icon-wrap">{card.icon}</div>
                <h4>{card.title}</h4>
                <p>{card.shortDesc}</p>
                <div className="card-click-hint">Click to read more</div>
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
      <section className="about-values steps">
        <div className="lp-wrap">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "56px" }}>
            <span className="section-eyebrow">Core Values</span>
            <h2 className="section-title">
              What We <em>Stand For</em>
            </h2>
            <span className="section-title-underline" />
            <p className="section-subtitle">
              Our principles guide everything we do, ensuring a safe and successful experience for every member.
            </p>
          </div>

          <div className="values-grid steps-grid">
            <div className="value-card step-card">
              <div className="step-icon"><Target size={24} /></div>
              <h4>Trust & Transparency</h4>
              <p>We believe in complete honesty and openness in all our operations and interactions with our community.</p>
            </div>
            <div className="value-card step-card">
              <div className="step-icon"><Users size={24} /></div>
              <h4>Inclusivity</h4>
              <p>We celebrate diversity and welcome people from all backgrounds, religions, and communities.</p>
            </div>
            <div className="value-card step-card">
              <div className="step-icon"><Sparkles size={24} /></div>
              <h4>Innovation</h4>
              <p>We continuously improve our platform using technology to enhance user experience.</p>
            </div>
            <div className="value-card step-card">
              <div className="step-icon"><ShieldCheck size={24} /></div>
              <h4>Safety First</h4>
              <p>Protecting our users' privacy and security is our top priority in everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <div className="lp-wrap final-cta-inner">
          <div className="cta-content">
            <Heart size={28} className="cta-heart-icon" />
            <h3>Ready to Start Your Journey?</h3>
            <p>
              Join thousands of happy members finding their perfect match on
              Phirse Shaadi. Your love story starts here.
            </p>
            <button
              className="btn solid cta-button"
              onClick={() => navigate("/register")}
            >
              Create Free Profile <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

