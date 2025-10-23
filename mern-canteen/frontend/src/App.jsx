import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthContext } from './AuthContext';
import { FaSun, FaMoon } from 'react-icons/fa';

function RequireAuth({ children }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <BrowserRouter>
      <nav className="bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Canteen
          </Link>
          <div className="flex items-center space-x-2">
            <button
              className="sm:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            <div className={`sm:flex space-x-4 ${menuOpen ? 'block' : 'hidden'} mt-2 sm:mt-0`}>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
