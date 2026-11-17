import React from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, ExternalLink, Handshake } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

// Sponsor slots - ready for logos to be uploaded and plugged in
const SPONSORS_LIST = [
  {
    id: 1,
    name: 'Title Sponsor',
    category: 'Title Partner',
    logo: null, // Replace with imported logo image e.g. import logo1 from '...'
    website: '',
    featured: true,
  },
  {
    id: 2,
    name: 'Co-Powered By',
    category: 'Associate Partner',
    logo: null,
    website: '',
    featured: true,
  },
  {
    id: 3,
    name: 'Gold Sponsor',
    category: 'Gold Partner',
    logo: null,
    website: '',
  },
  {
    id: 4,
    name: 'Innovation Partner',
    category: 'Innovation',
    logo: null,
    website: '',
  },
  {
    id: 5,
    name: 'Platform Partner',
    category: 'Cloud & Tech',
    logo: null,
    website: '',
  },
  {
    id: 6,
    name: 'Community Partner',
    category: 'Community',
    logo: null,
    website: '',
  },
  {
    id: 7,
    name: 'Education Partner',
    category: 'Academic Outreach',
    logo: null,
    website: '',
  },
  {
    id: 8,
    name: 'Media Partner',
    category: 'Media & Press',
    logo: null,
    website: '',
  },
];

const SponsorsSection = ({ sponsors = SPONSORS_LIST }) => {
  return (
    <section id="sponsors" className="section-container" style={{ position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <span style={{ height: '1px', width: '28px', background: 'var(--color-bright-crimson, #d32f2f)' }}></span>
            <span style={{ 
              fontSize: '0.82rem', 
              fontWeight: '800', 
              letterSpacing: '0.22em', 
              color: 'var(--color-bright-crimson, #d32f2f)', 
              textTransform: 'uppercase' 
            }}>
              Industry Collaborations
            </span>
            <span style={{ height: '1px', width: '28px', background: 'var(--color-bright-crimson, #d32f2f)' }}></span>
          </div>

          <h2 className="rules-title" style={{ margin: '0 auto 1rem auto' }}>
            OUR <span className="text-gradient">SPONSORS</span>
          </h2>
          <div className="rules-divider" style={{ marginBottom: '1.25rem' }}></div>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'rgba(244, 234, 204, 0.75)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Empowering innovation, technology, and talent. Proudly supported by forward-thinking industry leaders and visionary partners for SPECTRUM 1.0.
          </p>
        </motion.div>

        {/* Sponsors Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          {sponsors.map((sponsor, index) => {
            const hasLogo = Boolean(sponsor.logo);

            return (
              <motion.div
                key={sponsor.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ height: '100%' }}
              >
                <GlassCard
                  style={{
                    height: '100%',
                    minHeight: '190px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    borderRadius: '8px',
                    border: sponsor.featured 
                      ? '1px solid rgba(211, 47, 47, 0.45)' 
                      : '1px solid rgba(244, 234, 204, 0.12)',
                    background: sponsor.featured
                      ? 'linear-gradient(180deg, rgba(211, 47, 47, 0.08) 0%, rgba(8, 8, 8, 0.85) 100%)'
                      : 'rgba(8, 8, 8, 0.65)',
                    boxShadow: sponsor.featured
                      ? '0 4px 20px rgba(211, 47, 47, 0.15)'
                      : '0 4px 15px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                  }}
                  className="sponsor-card"
                >
                  {/* Subtle Top Accent Glow for Featured */}
                  {sponsor.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '15%',
                        right: '15%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #d32f2f, transparent)',
                      }}
                    />
                  )}

                  {/* Category / Tier Tag */}
                  <div style={{ width: '100%', marginBottom: '1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '3px',
                        color: sponsor.featured ? 'var(--color-star-white)' : 'rgba(244, 234, 204, 0.7)',
                        background: sponsor.featured ? 'rgba(211, 47, 47, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: sponsor.featured ? '1px solid rgba(211, 47, 47, 0.45)' : '1px solid rgba(244, 234, 204, 0.1)',
                      }}
                    >
                      {sponsor.category}
                    </span>
                  </div>

                  {/* Logo or Placeholder Box */}
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      minHeight: '80px',
                      padding: '0.5rem 0',
                    }}
                  >
                    {hasLogo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        style={{
                          maxWidth: '85%',
                          maxHeight: '75px',
                          objectFit: 'contain',
                          filter: 'brightness(0.95) contrast(1.05)',
                          transition: 'transform 0.25s ease, filter 0.25s ease',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: 'rgba(244, 234, 204, 0.4)',
                        }}
                      >
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(211, 47, 47, 0.08)',
                            border: '1px dashed rgba(211, 47, 47, 0.35)',
                          }}
                        >
                          {sponsor.featured ? (
                            <Award size={22} color="var(--color-neon-cyan)" />
                          ) : (
                            <Sparkles size={20} color="rgba(244, 234, 204, 0.5)" />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: 'rgba(244, 234, 204, 0.5)',
                          }}
                        >
                          {sponsor.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sponsor Name or Website Link */}
                  {sponsor.website ? (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: '0.75rem',
                        fontSize: '0.75rem',
                        color: 'var(--color-neon-cyan)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        textDecoration: 'none',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span>Visit Website</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <div style={{ marginTop: '0.5rem', height: '14px' }}></div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action for Potential Sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: '3.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              padding: '1.25rem 2rem',
              borderRadius: '8px',
              background: 'rgba(8, 8, 8, 0.75)',
              border: '1px solid rgba(211, 47, 47, 0.35)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Handshake size={22} color="var(--color-neon-cyan)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-star-white)', fontWeight: 600 }}>
                Interested in sponsoring or partnering with SPECTRUM 1.0?
              </span>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('contact');
                if (el) {
                  if (window.lenis) {
                    window.lenis.scrollTo(el, { offset: -70 });
                  } else {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1.15rem',
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                border: '1px solid var(--color-bright-crimson, #d32f2f)',
                borderRadius: '4px',
                color: 'var(--color-star-white)',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bright-crimson, #d32f2f)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(211, 47, 47, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Get In Touch
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default SponsorsSection;
