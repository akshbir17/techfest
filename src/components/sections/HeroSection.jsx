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
