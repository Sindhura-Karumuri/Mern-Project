import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginImage from '../assets/login.jpg';
import '../styles/Login.css';

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || (isSignup && !form.name)) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      setLoading(true);
      if (isSignup) await signup({ name: form.name, email: form.email, password: form.password });
      else await login(form.email, form.password);
      nav(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — image */}
      <div className="login-left">
        <img src={LoginImage} alt="Canteen" className="login-bg-img" />
        <div className="login-left-overlay">
          <div className="login-left-content">
            <div className="login-brand">🍴 AromaOfEmotions</div>
            <h2 className="login-left-title">Fuel your day with fresh campus meals</h2>
            <p className="login-left-sub">Order food, subscribe to plans, and manage everything in one place.</p>
            <div className="login-stats">
              <div className="login-stat"><span className="stat-num">500+</span><span className="stat-label">Daily Orders</span></div>
              <div className="login-stat"><span className="stat-num">50+</span><span className="stat-label">Menu Items</span></div>
              <div className="login-stat"><span className="stat-num">4.9★</span><span className="stat-label">Rating</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-icon">🍴</div>
            <h2 className="login-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="login-subtitle">
              {isSignup ? 'Join our canteen community today' : 'Sign in to your dashboard'}
            </p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={submit} className="login-form">
            {isSignup && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} disabled={loading} className="form-field" required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} disabled={loading} className="form-field" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} disabled={loading} className="form-field" required />
            </div>

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? (
                <span className="login-spinner">
                  <span className="spinner-dot" /><span className="spinner-dot" /><span className="spinner-dot" />
                </span>
              ) : (isSignup ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="login-divider"><span>or</span></div>

          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} disabled={loading} className="login-toggle-btn">
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
