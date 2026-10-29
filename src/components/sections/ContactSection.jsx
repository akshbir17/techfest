import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  return (
    <section id="contact" className="section-container contact-section">
      <div className="contact-content">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">SHRINE</span> OF ASCENSION
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="contact-info"
          >
            <div className="info-block">
              <h3 className="info-label">ADDRESS</h3>
              <p className="info-text">Guru Nanak Dev Engineering College<br/>Mailoor Road, Bidar, Karnataka 585403</p>
            </div>
            
            <div className="info-block">
              <h3 className="info-label">EMAIL</h3>
              <p className="info-text">spectrum@gndecb.ac.in</p>
            </div>
            
            <div className="info-block">
              <h3 className="info-label">MYSTIC THREADS</h3>
              <div className="social-links">
                <a href="#" className="social-link">INSTAGRAM</a>
                <a href="#" className="social-link">LINKEDIN</a>
                <a href="#" className="social-link">GITHUB</a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="map-wrapper"
            style={{ width: '100%', height: '300px', borderRadius: '4px', overflow: 'hidden', border: '2px solid var(--color-neon-cyan)', boxShadow: '0 0 20px rgba(211, 47, 47, 0.3)' }}
          >
            <iframe
              title="GNDEC Bidar Location"
              src="https://maps.google.com/maps?q=Guru%20Nanak%20Dev%20Engineering%20College%20Bidar,%20Mailur%20Rd,%20Mailoor,%20Bidar,%20Karnataka%20585403&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>

        <footer className="footer">
          SPECTRUM 1.0 © DECEMBER 2026 THE AWAKENING
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
