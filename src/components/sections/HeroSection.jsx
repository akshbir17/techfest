import React from 'react';
import { motion } from 'framer-motion';
import NeonButton from '../ui/NeonButton';
import LiveCountdownTracker from '../LiveCountdownTracker';

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
            GURU NANAK DEV ENGINEERING COLLEGE BIDAR
            <span style={{ display: 'block', fontSize: '0.74em', letterSpacing: '0.24em', opacity: 0.85, marginTop: '0.35rem' }}>
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
          <span className="text-gradient">SPECTRUM</span> 1.0
        </motion.h1>

        {/* Organizing Bodies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          style={{ marginBottom: '1.75rem', width: '100%', maxWidth: '100%', padding: '0 0.5rem' }}
        >
          <p className="hero-organized-by">
            Organized By
          </p>

          <div className="hero-departments">
            <div className="hero-dept-item" style={{ maxWidth: '480px' }}>
              <div className="hero-dept-title" style={{ whiteSpace: 'normal', lineHeight: '1.35' }}>
                GURU NANAK JHIRA ENTREPRENEURSHIP RESEARCH AND BUSINESS INCUBATION FOUNDATION
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.15rem, 3.4vw, 1.45rem)',
                  fontWeight: '900',
                  letterSpacing: '0.1em',
                  color: 'var(--color-neon-cyan)',
                  marginTop: '0.4rem',
                  textTransform: 'uppercase',
                  lineHeight: '1.25',
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.95), 0 0 16px rgba(0, 240, 255, 0.65)',
                }}
              >
                NIDHI DST iTBI CENTER
              </div>
            </div>

            <span className="hero-dept-amp">
              &
            </span>

            <div className="hero-dept-item" style={{ maxWidth: '380px' }}>
              <div className="hero-dept-title" style={{ whiteSpace: 'normal', lineHeight: '1.35' }}>
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
            In Association With
          </p>

          <div className="hero-departments">
            <div className="hero-dept-item">
              <div className="hero-dept-title">
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
              <div className="hero-dept-title">
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
          8–10 DECEMBER 2026 | BIDAR, KARNATAKA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
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
        </motion.div>

        {/* Live Countdown & Happening Now Indicator */}
        <LiveCountdownTracker />

      </div>
    </section>
  );
};

export default HeroSection;
