import React from 'react';
import { motion } from 'framer-motion';
import NeonButton from '../ui/NeonButton';

const HeroSection = () => {
  return (
    <section id="event" className="section-container hero-section">
      <div className="hero-content">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <span className="hero-subtitle">
            GURU NANAK DEV ENGINEERING COLLEGE PRESENTS
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
        
        {/* Organizing Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            maxWidth: '920px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.25em',
              color: 'rgba(244, 234, 204, 0.6)',
              textTransform: 'uppercase'
            }}>
              Organized By
            </span>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              width: '100%'
            }}>
              <div style={{
                backgroundColor: 'rgba(8, 8, 8, 0.65)',
                border: '1px solid rgba(211, 47, 47, 0.4)',
                borderRadius: '4px',
                padding: '0.65rem 1.25rem',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 15px rgba(211, 47, 47, 0.15)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: 'var(--color-star-white)',
                  textTransform: 'uppercase'
                }}>
                  DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  letterSpacing: '0.12em',
                  color: 'var(--color-neon-cyan)',
                  marginTop: '0.2rem'
                }}>
                  (DATA SCIENCE)
                </div>
              </div>

              <span style={{
                color: 'var(--color-neon-cyan)',
                fontWeight: '800',
                fontSize: '1.1rem'
              }}>
                &
              </span>

              <div style={{
                backgroundColor: 'rgba(8, 8, 8, 0.65)',
                border: '1px solid rgba(211, 47, 47, 0.4)',
                borderRadius: '4px',
                padding: '0.65rem 1.25rem',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 15px rgba(211, 47, 47, 0.15)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  color: 'var(--color-star-white)',
                  textTransform: 'uppercase'
                }}>
                  DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
                </div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  letterSpacing: '0.12em',
                  color: 'var(--color-neon-cyan)',
                  marginTop: '0.2rem'
                }}>
                  (ARTIFICIAL INTELLIGENCE & MACHINE LEARNING)
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          style={{ height: '4px', width: '8rem', backgroundColor: 'var(--color-neon-cyan)', margin: '0 auto 2rem auto' }}
          initial={{ width: 0 }}
          animate={{ width: 128 }}
          transition={{ duration: 1, delay: 1 }}
        ></motion.div>

        <motion.p 
          className="hero-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          DECEMBER 2026 | BIDAR, KARNATAKA
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
        >
          <NeonButton onClick={() => document.getElementById('registration').scrollIntoView({ behavior: 'smooth' })}>
            ENTER THE REALM
          </NeonButton>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
