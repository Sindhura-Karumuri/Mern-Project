import React, { useContext, useState, useEffect } from 'react';
import '../styles/Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/feedback', label: 'Feedback' },
  ];

  return (
    <>
      <nav className={`header-nav${scrolled ? ' header-scrolled' : ''}`}>
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <span className="logo-icon">🍴</span>
            <span className="logo-text">AromaOfEmotions</span>
          </Link>

          {/* Desktop Links */}
          <div className="header-links">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`header-link${isActive(to) ? ' header-link-active' : ''}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="header-actions">
            {user ? (
              <>
                <span className="header-greeting">Hi, {user.name.split(' ')[0]} 👋</span>
                <button onClick={handleLogout} className="header-btn header-btn-outline">Logout</button>
              </>
            ) : (
              <Link to="/login" className="header-btn header-btn-filled">Login</Link>
            )}
            <button onClick={toggleDarkMode} className="theme-toggle-btn" aria-label="Toggle theme">
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="header-mobile-controls">
            <button onClick={toggleDarkMode} className="theme-toggle-btn" aria-label="Toggle theme">
              {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" aria-label="Menu">
              {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div className={`mobile-drawer${menuOpen ? ' mobile-drawer-open' : ''}`}>
          <div className="mobile-drawer-inner">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={`mobile-link${isActive(to) ? ' mobile-link-active' : ''}`}>
                {label}
              </Link>
            ))}
            <div className="mobile-drawer-footer">
              {user ? (
                <>
                  <span className="mobile-greeting">Hi, {user.name} 👋</span>
                  <button onClick={handleLogout} className="header-btn header-btn-outline w-full">Logout</button>
                </>
              ) : (
                <Link to="/login" className="header-btn header-btn-filled" style={{ display: 'block', textAlign: 'center' }}>Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer so content doesn't hide behind fixed nav */}
      <div className="header-spacer" />
    </>
  );
}
