import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    // If we are not on the homepage, navigate to homepage first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (window.lenis) {
            window.lenis.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el);
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }} onClick={() => setIsMenuOpen(false)}>
          <img
            src="/logo.jpg"
            alt="SPECTRUM 1.0"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1.5px solid rgba(0, 240, 255, 0.5)',
              boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
            }}
          />
          <span className="text-glow" style={{ color: 'var(--color-neon-cyan)', fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '0.1em' }}>
            SPECTRUM 1.0
          </span>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMenuOpen(false);
            }}
          >
            HOME
          </Link>

          <button 
            className="nav-link"
            onClick={() => scrollTo('about')}
          >
            ABOUT
          </button>
          
          <Link 
            to="/events" 
            className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            EVENTS
          </Link>

          <button 
            className="nav-link"
            onClick={() => scrollTo('schedule')}
          >
            SCHEDULE
          </button>

          <button 
            className="nav-link"
            onClick={() => scrollTo('coordinators')}
          >
            COORDINATORS
          </button>
          
          <button 
            className="nav-link"
            onClick={() => scrollTo('registration')}
          >
            REGISTER
          </button>

          <button 
            className="nav-link"
            onClick={() => scrollTo('contact')}
          >
            CONTACT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

