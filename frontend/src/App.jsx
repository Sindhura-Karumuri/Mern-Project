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
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

const PAGE_TITLES = {
  '/':          'AromaOfEmotions — Campus Canteen',
  '/login':     'Login — AromaOfEmotions',
  '/dashboard': 'Dashboard — AromaOfEmotions',
  '/profile':   'My Profile — AromaOfEmotions',
};

function PageTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = PAGE_TITLES[pathname] || 'AromaOfEmotions';
  }, [pathname]);
  return null;
}

function RequireAuth({ children }) {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  return children;
}

function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '2rem',
      color: 'var(--text-primary)',
    }}>
      <div style={{ fontSize: '5rem' }}>🍽️</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 360 }}>
        This page doesn't exist. Looks like you took a wrong turn on the way to the canteen.
      </p>
      <a href="/" style={{
        marginTop: '0.5rem', padding: '0.75rem 2rem', borderRadius: '0.625rem',
        background: 'var(--accent)', color: '#fff', fontWeight: 700,
        textDecoration: 'none', fontSize: '0.95rem',
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
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, borderRadius: '0.625rem', padding: '0.75rem 1rem' },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' }, style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
            error:   { iconTheme: { primary: '#dc2626', secondary: '#fff' }, style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
          }}
        />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <main className="min-h-screen">
            <Routes>
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/profile"   element={<RequireAuth><Profile /></RequireAuth>} />
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
