import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthContext } from './AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';
import FAQ from './pages/FAQ';
import Feedback from './pages/Feedback';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

// Update browser tab title per page
const PAGE_TITLES = {
  '/':          'AromaOfEmotions — Campus Canteen',
  '/login':     'Login — AromaOfEmotions',
  '/dashboard': 'Dashboard — AromaOfEmotions',
  '/about':     'About Us — AromaOfEmotions',
  '/contact':   'Contact — AromaOfEmotions',
  '/faq':       'FAQ — AromaOfEmotions',
  '/feedback':  'Feedback — AromaOfEmotions',
};

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] || 'AromaOfEmotions';
  }, [pathname]);
  return null;
}

// Require auth — redirect with return path
function RequireAuth({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  return children;
}

// 404 Page
function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '2rem',
      color: 'var(--text-primary)'
    }}>
      <div style={{ fontSize: '5rem' }}>🍽️</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 360 }}>
        Oops! This page doesn't exist. Looks like you took a wrong turn on the way to the canteen.
      </p>
      <a href="/" style={{
        marginTop: '0.5rem', padding: '0.75rem 2rem', borderRadius: '0.625rem',
        background: 'var(--accent)', color: '#fff', fontWeight: 700,
        textDecoration: 'none', fontSize: '0.95rem',
        boxShadow: '0 4px 16px rgba(99,102,241,0.35)'
      }}>
        Go Home →
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageTitle />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '0.625rem',
              padding: '0.75rem 1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#16a34a', secondary: '#fff' },
              style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
            },
            error: {
              iconTheme: { primary: '#dc2626', secondary: '#fff' },
              style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
            },
          }}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/about"     element={<About />} />
              <Route path="/contact"   element={<Contact />} />
              <Route path="/faq"       element={<FAQ />} />
              <Route path="/feedback"  element={<Feedback />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="*"          element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
