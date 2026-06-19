import React, { useState } from 'react';
import '../styles/Pages.css';

const contactInfo = [
  { icon: '📍', title: 'Address', lines: ['Campus Building A, Ground Floor', 'University Campus, City 560001'] },
  { icon: '📞', title: 'Phone', lines: ['+91 98765 43210'] },
  { icon: '📧', title: 'Email', lines: ['info@aromaofemotions.com'] },
  { icon: '🕒', title: 'Hours', lines: ['Mon–Fri: 7:00 AM – 8:00 PM', 'Sat: 8:00 AM – 6:00 PM', 'Sun: 9:00 AM – 5:00 PM'] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Get In Touch</span>
          <h1 className="page-hero-title">We'd Love to Hear From You</h1>
          <p className="page-hero-sub">Have a question, suggestion, or just want to say hello? We're here.</p>
        </div>
      </div>

      <div className="page-container">
        <div className="contact-grid">
          {/* Info */}
          <div className="contact-info-col">
            <h2 className="col-title">Contact Details</h2>
            <div className="contact-info-list">
              {contactInfo.map((item) => (
                <div key={item.title} className="contact-info-item glass-card">
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <div className="contact-info-title">{item.title}</div>
                    {item.lines.map((l, i) => <div key={i} className="contact-info-line">{l}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass-card contact-form-card">
            <h2 className="col-title">Send a Message</h2>

            {submitted && (
              <div className="success-banner">
                ✅ Message sent! We'll get back to you within 24 hours.
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
                <label className="form-label">Subject *</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required className="form-field" placeholder="What's this about?" />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="form-field" placeholder="Tell us more..."></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message →</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
