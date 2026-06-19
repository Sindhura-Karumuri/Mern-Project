import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Home.css";

const FEATURES = [
  { icon: "🍽️", title: "Fresh Daily Menu",     desc: "Breakfast, lunch, snacks & beverages crafted fresh every day." },
  { icon: "💳", title: "Meal Plans",            desc: "Subscribe to weekly or monthly plans and never skip a meal." },
  { icon: "⚡", title: "Instant Ordering",      desc: "Order in seconds with secure Razorpay payments." },
  { icon: "📦", title: "Order Tracking",        desc: "Track every order from placed to delivered in real time." },
  { icon: "🔒", title: "Secure Payments",       desc: "UPI, cards, wallets — all transactions are encrypted." },
  { icon: "📊", title: "Smart Dashboard",       desc: "View your orders, subscriptions and history in one place." },
];

const STATS = [
  { num: "500+", label: "Daily Orders" },
  { num: "50+",  label: "Menu Items" },
  { num: "4.9★", label: "Rating" },
  { num: "200+", label: "Students" },
];

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to AromaOfEmotions</h1>
            <p className="hero-subtitle">
              Fresh campus meals, flexible meal plans, and seamless ordering — all in one place.
            </p>
            {user ? (
              <button className="hero-btn" onClick={() => navigate("/dashboard")}>
                Go to Dashboard →
              </button>
            ) : (
              <Link to="/login" className="hero-btn">Get Started →</Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        {STATS.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="container">
        <h2 className="section-title">Everything you need</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {!user && (
          <div className="home-cta">
            <h2>Ready to order?</h2>
            <p>Login to browse the menu, subscribe to meal plans and track your orders.</p>
            <Link to="/login" className="hero-btn" style={{ display: "inline-block" }}>Login / Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
}
