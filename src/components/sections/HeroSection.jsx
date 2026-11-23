import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Share2 } from 'lucide-react';
import NeonButton from '../ui/NeonButton';
import LiveCountdownTracker from '../LiveCountdownTracker';
import { triggerShare } from '../../utils/share';

const HeroSection = () => {
  return (
    <section id="event" className="section-container hero-section">
      <div className="hero-content">
        
        {/* College Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          style={{ marginBottom: '1rem', width: '100%', maxWidth: '100%', padding: '0 0.5rem' }}
        >
          <span className="hero-subtitle">
            <span style={{ color: '#F4EACC' }}>GURU NANAK DEV ENGINEERING COLLEGE BIDAR</span>
            <span style={{ display: 'block', fontSize: '0.74em', letterSpacing: '0.24em', color: '#D4AF37', marginTop: '0.35rem', fontWeight: 800, textShadow: '0 1px 8px rgba(0, 0, 0, 0.95), 0 0 12px rgba(212, 175, 55, 0.5)' }}>
              PRESENTS
            </span>
          </span>
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        >
          <span className="text-gradient" style={{ color: '#D32F2F', textShadow: '0 0 25px rgba(211, 47, 47, 0.75), 0 0 50px rgba(183, 28, 28, 0.5)' }}>SPECTRUM</span>{' '}
          <span style={{ color: '#F4EACC', textShadow: '0 0 20px rgba(244, 234, 204, 0.35)' }}>1.0</span>
        </motion.h1>

        {/* Organizing Bodies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          style={{ marginBottom: '1.75rem', width: '100%', maxWidth: '100%', padding: '0 0.5rem' }}
        >
          <p className="hero-organized-by">
            ORGANIZED BY
          </p>

          <div className="hero-departments">
            <div className="hero-dept-item" style={{ maxWidth: '520px' }}>
              <div className="hero-dept-title" style={{ whiteSpace: 'normal', lineHeight: '1.35', textAlign: 'center', color: '#F4EACC' }}>
                GURU NANAK JHIRA ENTREPRENEURSHIP<br />
                RESEARCH AND BUSINESS INCUBATION<br />
                FOUNDATION
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.15rem, 3.4vw, 1.45rem)',
                  fontWeight: '900',
                  letterSpacing: '0.1em',
                  color: '#D32F2F',
                  marginTop: '0.4rem',
                  textTransform: 'uppercase',
                  lineHeight: '1.25',
                  textAlign: 'center',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 0 18px rgba(211, 47, 47, 0.75)',
                }}
              >
                NIDHI DST iTBI CENTER
              </div>
            </div>

            <span className="hero-dept-amp">
              &
            </span>

            <div className="hero-dept-item" style={{ maxWidth: '380px' }}>
              <div className="hero-dept-title" style={{ whiteSpace: 'normal', lineHeight: '1.35', color: '#F4EACC' }}>
                INSTITUTION INNOVATION COUNCIL
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Associated Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          style={{ marginBottom: '2rem', width: '100%', maxWidth: '100%', padding: '0 0.5rem' }}
        >
          <p className="hero-organized-by">
            IN ASSOCIATION WITH
          </p>

          <div className="hero-departments">
            <div className="hero-dept-item">
              <div className="hero-dept-title" style={{ color: '#F4EACC' }}>
                DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
              </div>
              <div className="hero-dept-sub">
                (ARTIFICIAL INTELLIGENCE & MACHINE LEARNING)
              </div>
            </div>

            <span className="hero-dept-amp">
              &
            </span>

            <div className="hero-dept-item">
              <div className="hero-dept-title" style={{ color: '#F4EACC' }}>
                DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
              </div>
              <div className="hero-dept-sub">
                (DATA SCIENCE)
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          style={{ height: '3px', width: '6rem', backgroundColor: 'var(--color-neon-cyan)', margin: '0 auto 1.5rem auto' }}
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 1, delay: 1 }}
        ></motion.div>

        <motion.p 
          className="hero-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          9–10 DECEMBER 2026 | BIDAR, KARNATAKA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem' }}
        >
          <NeonButton onClick={() => {
            const el = document.getElementById('registration');
            if (el) {
              if (window.lenis) {
                window.lenis.scrollTo(el);
              } else {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}>
            ENTER THE REALM
          </NeonButton>

          {/* Action Buttons Row */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              maxWidth: '580px',
            }}
          >
            {/* Already registered retrieve pass box button matching red-black site theme */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-find-pass'))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.6rem 1.25rem',
                background: 'rgba(8, 8, 8, 0.92)',
                border: '1px solid var(--color-neon-cyan)',
                borderRadius: '4px',
                color: 'var(--color-star-white)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.72rem, 1.25vw, 0.82rem)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '4px 4px 0px 0px rgba(211, 47, 47, 0.85)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(211, 47, 47, 0.18)';
                e.currentTarget.style.borderColor = 'var(--color-star-white)';
                e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(211, 47, 47, 0.95)';
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(8, 8, 8, 0.92)';
                e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
                e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(211, 47, 47, 0.85)';
                e.currentTarget.style.transform = 'translate(0, 0)';
              }}
            >
              <Ticket size={16} color="var(--color-neon-cyan)" style={{ flexShrink: 0 }} />
              <span>
                Already Registered?{' '}
                <span style={{ color: 'var(--color-neon-cyan)' }}>Retrieve Pass</span>
              </span>
            </button>

            {/* Share Fest Button */}
            <button
              type="button"
              onClick={() => triggerShare()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.6rem 1.25rem',
                background: 'rgba(8, 8, 8, 0.92)',
                border: '1px solid rgba(244, 234, 204, 0.35)',
                borderRadius: '4px',
                color: 'var(--color-star-white)',
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(0.72rem, 1.25vw, 0.82rem)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: '4px 4px 0px 0px rgba(244, 234, 204, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(211, 47, 47, 0.18)';
                e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
                e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(211, 47, 47, 0.85)';
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(8, 8, 8, 0.92)';
                e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.35)';
                e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(244, 234, 204, 0.25)';
                e.currentTarget.style.transform = 'translate(0, 0)';
              }}
            >
              <Share2 size={15} color="var(--color-star-white)" style={{ flexShrink: 0 }} />
              <span>Share Fest</span>
            </button>
          </div>
        </motion.div>

        {/* Live Countdown & Happening Now Indicator */}
        <LiveCountdownTracker />

      </div>
    </section>
  );
};

export default HeroSection;
