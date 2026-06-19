import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Pages.css';

const faqs = [
  { q: 'How do I place an order?', a: 'Log in, browse our menu, and click "Order" on any item. Payment is handled securely via Razorpay.' },
  { q: 'What payment methods do you accept?', a: 'All major credit/debit cards and UPI through Razorpay. Meal plan credits are used if you have an active subscription.' },
  { q: 'How do meal plans work?', a: 'Meal plans are subscription packages for a fixed duration. Subscribe once and order meals using plan credits anytime during the period.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be changed within 15 minutes of placing. After that, the kitchen has begun preparation. Contact us immediately for help.' },
  { q: 'What are your operating hours?', a: 'Mon–Fri: 7AM–8PM, Sat: 8AM–6PM, Sun: 9AM–5PM. Online ordering is available 24/7 for advance orders.' },
  { q: 'Do you accommodate dietary restrictions?', a: 'Yes — vegetarian, vegan, and gluten-free options are available. Each item is labeled. Contact us for specific allergy queries.' },
  { q: 'How long does preparation take?', a: 'Typically 10–15 minutes. Up to 20–25 minutes during peak hours. You receive a notification when ready.' },
  { q: 'Can I get a refund for my meal plan?', a: 'Refunds available within 7 days of purchase if no meals consumed. After that, prorated based on unused meals.' },
  { q: 'How do I report an issue with my order?', a: 'Use the Contact form or call us immediately. We resolve issues promptly and ensure your satisfaction.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="page-hero-content">
          <span className="page-hero-tag">Help Center</span>
          <h1 className="page-hero-title">Frequently Asked Questions</h1>
          <p className="page-hero-sub">Everything you need to know about ordering, plans, and more.</p>
        </div>
      </div>

      <div className="page-container">
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item glass-card${open === i ? ' faq-open' : ''}`}>
              <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-icon">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        <div className="glass-card faq-cta">
          <div className="faq-cta-icon">💬</div>
          <h2 className="faq-cta-title">Still have questions?</h2>
          <p className="faq-cta-sub">Our support team is ready to help you anytime.</p>
          <Link to="/contact" className="submit-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
}
