import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Background from './components/Background';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import CrimsonChat from './components/CrimsonChat';

function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 1.25rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontWeight: 900,
          color: 'var(--color-neon-cyan)',
          letterSpacing: '0.1em',
        }}
      >
        404
      </h1>
      <p style={{ color: 'var(--color-star-white)', opacity: 0.85, margin: '0.75rem 0 1.75rem', maxWidth: '420px' }}>
        The page you requested does not exist in the Spectrum 1.0 portal.
      </p>
      <Link
        to="/"
        style={{
          padding: '0.85rem 1.75rem',
          backgroundColor: 'var(--color-neon-cyan)',
          color: 'var(--color-space-black)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          textDecoration: 'none',
          borderRadius: '4px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        Return Home
      </Link>
    </main>
  );
}

function App() {
  const isSuccessRoute =
    typeof window !== 'undefined' && window.location.pathname.includes('/registration-success');
  const [loading, setLoading] = useState(!isSuccessRoute);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    window.lenis = lenis;
    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {loading && <Loader onLoaded={() => setLoading(false)} />}

      <div className="app-container">
        <Background />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <CrimsonChat />
      </div>
    </BrowserRouter>
  );
}

export default App;
