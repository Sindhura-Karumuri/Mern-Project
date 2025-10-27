import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            🍴 Canteen
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/faq" className="nav-link">FAQ</Link>
            <Link to="/feedback" className="nav-link">Feedback</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  Hi, {user.name}
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
            
            <button onClick={toggleDarkMode} className="theme-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleDarkMode} className="theme-toggle">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              <Link to="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              {user && (
                <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}
              <Link to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/faq" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                FAQ
              </Link>
              <Link to="/feedback" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
                Feedback
              </Link>
              
              {user ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="block text-gray-700 dark:text-gray-300 mb-2">
                    Hi, {user.name}
                  </span>
                  <button onClick={handleLogout} className="btn-secondary w-full">
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary w-full text-center" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}