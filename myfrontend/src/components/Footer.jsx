import React from "react";
import { Heart } from "lucide-react";
import "../pages/LandingPage.css";

const Footer = () => (
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
);

export default Footer;
