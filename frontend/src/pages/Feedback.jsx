import React, { useState } from 'react';
import '../styles/Pages.css';

const reasons = [
  { icon: '💡', title: 'Continuous Improvement', desc: 'Your feedback helps us identify areas to improve and implement meaningful changes.' },
  { icon: '🍽️', title: 'Better Food', desc: 'We use your input to enhance our menu and introduce new dishes you will love.' },
  { icon: '⚡', title: 'Faster Service', desc: 'Your suggestions help us streamline processes for a quicker, smoother experience.' },
  { icon: '🤝', title: 'Community', desc: 'We build our dining experience around the people who use it every day.' },
];

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, category: 'food', feedback: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', rating: 5, category: 'food', feedback: '' });
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Your Voice Matters</span>
          <h1 className="page-hero-title">Share Your Feedback</h1>
          <p className="page-hero-sub">Help us serve you better — every rating and suggestion counts.</p>
        </div>
      </div>

      <div className="page-container">
        <div className="feedback-grid">
          {/* Form */}
          <div className="glass-card feedback-form-card">
            <h2 className="col-title">Rate Your Experience</h2>

            {submitted && (
              <div className="success-banner">
                🎉 Thank you! Your feedback has been submitted successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="form-field" placeholder="Your name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="form-field" placeholder="you@example.com" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rating *</label>
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                      className={`star-btn${s <= form.rating ? ' star-active' : ''}`}>★</button>
                  ))}
                  <span className="star-label">{form.rating} / 5</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required className="form-field">
                  <option value="food">Food Quality</option>
                  <option value="service">Service</option>
                  <option value="website">Website / App</option>
                  <option value="pricing">Pricing</option>
                  <option value="cleanliness">Cleanliness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Feedback *</label>
                <textarea name="feedback" value={form.feedback} onChange={handleChange} required rows={5}
                  className="form-field" placeholder="Share your thoughts, suggestions, or any issues..."></textarea>
              </div>

              <button type="submit" className="submit-btn">Submit Feedback →</button>
            </form>
          </div>

          {/* Reasons */}
          <div className="feedback-reasons-col">
            <h2 className="col-title">Why Your Feedback Matters</h2>
            <div className="reasons-list">
              {reasons.map((r, i) => (
                <div key={i} className="reason-card glass-card">
                  <span className="reason-icon">{r.icon}</span>
                  <div>
                    <div className="reason-title">{r.title}</div>
                    <div className="reason-desc">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
