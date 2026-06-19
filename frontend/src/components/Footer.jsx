import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Footer.css';

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export default function Footer() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [location]);

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <div className="footer-logo">🍴 AromaOfEmotions</div>
            </Link>
            <p className="footer-tagline">
              Fresh meals, seamless orders, and flexible plans — crafted for your campus life.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter / X">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
            <Link to="/feedback" className="footer-link">Feedback</Link>
          </div>

          {/* Services — navigate to home sections */}
          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <Link to="/" className="footer-link">Fresh Meals</Link>
            <Link to="/" className="footer-link">Meal Plans</Link>
            <Link to="/dashboard#my-orders" className="footer-link">Online Ordering</Link>
            <Link to="/faq" className="footer-link">Help & Support</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <a href="mailto:info@aromaofemotions.com" className="footer-contact-item footer-link">
              ✉️ info@aromaofemotions.com
            </a>
            <a href="tel:+919876543210" className="footer-contact-item footer-link">
              📞 +91 98765 43210
            </a>
            <span className="footer-contact-item">📍 Campus Block A, Ground Floor</span>
            <span className="footer-contact-item">🕒 Mon–Fri: 7AM – 8PM</span>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AromaOfEmotions. All rights reserved.</p>
          <p>Made with ❤️ for campus dining</p>
        </div>
      </div>
    </footer>
  );
}
