import React from 'react';
import '../styles/Pages.css';

const features = [
  { icon: '🍽️', title: 'Fresh Ingredients', desc: 'Locally sourced, fresh ingredients delivered daily for the highest quality meals.' },
  { icon: '⚡', title: 'Quick Service', desc: 'Fast ordering and preparation to fit your busy schedule between classes.' },
  { icon: '💳', title: 'Flexible Plans', desc: 'Various meal plans to suit different budgets and dietary preferences.' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Order from anywhere on campus with our seamless online platform.' },
  { icon: '🌿', title: 'Sustainable', desc: 'Eco-friendly packaging and sustainable sourcing practices.' },
  { icon: '🤝', title: 'Community First', desc: 'Built for and by the campus community with love and care.' },
];

export default function About() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Our Story</span>
          <h1 className="page-hero-title">Crafting Campus Dining<br />with Heart & Flavor</h1>
          <p className="page-hero-sub">
            Since 2020, AromaOfEmotions has been the heartbeat of campus dining — fresh, fast, and always delicious.
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Mission & Vision */}
        <div className="two-col-grid">
          <div className="glass-card accent-card">
            <div className="accent-card-icon">🎯</div>
            <h2 className="glass-card-title">Our Mission</h2>
            <p className="glass-card-text">
              To provide fresh, nutritious, and delicious meals to our campus community while offering
              convenient meal plans and exceptional service that enhances the student experience every single day.
            </p>
          </div>
          <div className="glass-card accent-card">
            <div className="accent-card-icon">🔭</div>
            <h2 className="glass-card-title">Our Vision</h2>
            <p className="glass-card-text">
              To be the premier dining destination on campus — known for quality food, sustainable practices,
              and innovative technology that makes dining convenient, healthy, and enjoyable for all.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="section-header">
          <h2 className="section-heading">Why Choose Us?</h2>
          <p className="section-desc">Everything you need for a great dining experience</p>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card glass-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="glass-card story-card">
          <div className="story-badge">📖 Our Journey</div>
          <h2 className="glass-card-title" style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>From a Small Kitchen to Campus Favorite</h2>
          <div className="story-text">
            <p>Founded in 2020, our canteen has been serving the campus community with dedication and passion.
              What started as a small food service has grown into a comprehensive dining solution that caters to diverse tastes.</p>
            <p>We believe good food brings people together and fuels academic success. Our team of experienced chefs
              works tirelessly to create meals that not only taste great but also provide the nutrition students need to excel.</p>
            <p>With our modern online ordering system and flexible meal plans, we've made campus dining more convenient
              than ever. Join thousands of satisfied students who trust us for their daily meals.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[['3+', 'Years Serving'], ['500+', 'Daily Orders'], ['50+', 'Menu Items'], ['4.9★', 'Avg Rating']].map(([num, label]) => (
            <div key={label} className="stat-card glass-card">
              <span className="stat-big">{num}</span>
              <span className="stat-small">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
