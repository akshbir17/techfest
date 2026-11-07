import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';

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
            <span className="text-gradient">CONTACT</span> & SUPPORT
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="contact-grid grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Column: Contact Details & Campus Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="contact-info flex flex-col justify-between"
          >
            <div>
              <div className="info-block" style={{ marginBottom: '1.75rem' }}>
                <h3 className="info-label">ADDRESS</h3>
                <p className="info-text" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
                  Guru Nanak Dev Engineering College<br/>
                  Mailoor Road, Bidar, Karnataka 585403
                </p>
              </div>
              
              <div className="info-block" style={{ marginBottom: '1.75rem' }}>
                <h3 className="info-label">EMAIL</h3>
                <p className="info-text" style={{ fontSize: '1.1rem' }}>
                  <a href="mailto:Spectrum101213@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    Spectrum101213@gmail.com
                  </a>
                </p>
              </div>
              
              <div className="info-block" style={{ marginBottom: '1.75rem' }}>
                <h3 className="info-label">MYSTIC THREADS</h3>
                <div className="social-links">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">INSTAGRAM</a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LINKEDIN</a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GITHUB</a>
                </div>
              </div>
            </div>

            {/* Campus Map Embed */}
            <div
              className="map-wrapper"
              style={{
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.15)',
                marginTop: '0.5rem',
              }}
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
            </div>
          </motion.div>

          {/* Right Column: Support Us Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="support-wrapper h-full flex"
          >
            <GlassCard
              className="support-card flex flex-col justify-between"
              style={{
                width: '100%',
                padding: '2.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 42, 95, 0.35)',
                background: 'linear-gradient(135deg, rgba(25, 10, 20, 0.85) 0%, rgba(12, 10, 24, 0.9) 100%)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 42, 95, 0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <h3
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      color: 'var(--color-star-white, #fff)',
                      margin: 0,
                    }}
                  >
                    Support Us <span style={{ color: '#ff2a5f', display: 'inline-block', filter: 'drop-shadow(0 0 8px rgba(255, 42, 95, 0.8))' }}>❤️</span>
                  </h3>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    color: 'rgba(244, 234, 204, 0.88)',
                    fontSize: '0.98rem',
                    lineHeight: '1.7',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Spectrum is more than just an event — it&apos;s a platform built to bring together creativity, innovation, technology and talent.
                  </p>
                  
                  <p style={{ margin: 0 }}>
                    Your support helps us make this experience bigger, better and more memorable. Every contribution, no matter how small, motivates us to create opportunities, empower participants and build an amazing community.
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      color: 'var(--color-neon-cyan, #00f0ff)',
                      letterSpacing: '0.02em',
                      borderLeft: '3px solid var(--color-neon-crimson, #ff2a5f)',
                      paddingLeft: '0.85rem',
                    }}
                  >
                    Be a part of our journey. Support Spectrum and help us make it extraordinary!
                  </p>

                  <p style={{ margin: 0, fontStyle: 'italic', color: '#ffb3ba' }}>
                    Thank you for believing in us. ❤️
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <a
                  href="https://razorpay.me/@spectrum10"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block', width: '100%' }}
                >
                  <NeonButton
                    className="w-full"
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                    }}
                  >
                    <Heart size={18} fill="#ff2a5f" color="#ff2a5f" />
                    <span>SUPPORT US!</span>
                    <ExternalLink size={16} />
                  </NeonButton>
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <footer className="footer">
          <div
            style={{
              marginBottom: '0.45rem',
              fontSize: '0.85rem',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-heading)',
              color: 'rgba(244, 234, 204, 0.75)',
              textTransform: 'uppercase',
            }}
          >
            MADE BY : <span style={{ color: 'var(--color-neon-cyan)', fontWeight: 800 }}>AKSHBIR SINGH SEEHRA</span>
          </div>
          <div>
            SPECTRUM 1.0 © DECEMBER 2026 THE AWAKENING
          </div>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
