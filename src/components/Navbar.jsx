import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

// Set to true when schedule is ready to be displayed
const SHOW_SCHEDULE = false;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Prevent background scrolling and pause Lenis while mobile menu is open
  useScrollLock(isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when location changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [location.pathname, location.search, location.hash]);

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    // If we are not on the homepage, navigate to homepage with hash
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          if (window.lenis) {
            window.lenis.start();
            window.lenis.resize();
            window.lenis.scrollTo(el, { offset: -70 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 40);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="navbar-container">
        <Link 
          to="/" 
          className="navbar-logo" 
          style={{ 
            textDecoration: 'none', 
            whiteSpace: 'nowrap', 
            flexShrink: 0, 
            display: 'flex', 
            alignItems: 'center' 
          }} 
          onClick={() => setIsMenuOpen(false)}
        >
          <span 
            className="text-glow" 
            style={{ 
              color: 'var(--color-neon-cyan)', 
              fontWeight: 'bold', 
              fontSize: 'clamp(1.2rem, 1.8vw, 1.5rem)', 
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap'
            }}
          >
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
              setIsMenuOpen(false);
              setTimeout(() => {
                if (window.lenis) {
                  window.lenis.start();
                  window.lenis.scrollTo(0, { immediate: false });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }, 40);
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
          
          <button 
            className="nav-link"
            onClick={() => scrollTo('events')}
          >
            EVENTS
          </button>

          <button 
            className="nav-link"
            onClick={() => scrollTo('themes')}
          >
            THEMES
          </button>

          {SHOW_SCHEDULE && (
            <button 
              className="nav-link"
              onClick={() => scrollTo('schedule')}
            >
              SCHEDULE
            </button>
          )}

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

