import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, ExternalLink } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

// Official sponsors list for SPECTRUM 1.0
const SPONSORS_LIST = [
  {
    id: 'sv-traders',
    name: 'SV Traders',
    category: 'Associate Sponsor',
    description: 'Prop: Veeresh B.',
    logo: '/sponsors/sv-traders.jpg',
    featured: true,
  },
  {
    id: 'eventopia',
    name: 'Eventopia',
    category: 'Media Partner',
    description: 'Building Communities',
    logo: '/sponsors/eventopia.png',
    url: 'https://eventopia.in/',
    featured: true,
    fill: true,
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
            OUR <span className="text-gradient">SPONSORS & PARTNERS</span>
          </h2>
          <div className="rules-divider" style={{ marginBottom: '1.25rem' }}></div>
          <p style={{ maxWidth: '640px', margin: '0 auto', color: 'rgba(244, 234, 204, 0.75)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Empowering innovation, technology, and talent. Proudly supported by forward-thinking industry leaders and visionary partners for SPECTRUM 1.0.
          </p>
        </motion.div>

        {/* Sponsors Grid / Cards */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            flexWrap: 'wrap',
            gap: '1.75rem',
            width: '100%',
          }}
        >
          {sponsors.map((sponsor, index) => {
            return (
              <motion.div
                key={sponsor.id || index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{ width: '100%', maxWidth: '340px' }}
              >
                <GlassCard
                  style={{
                    height: '100%',
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
                      : '1px solid rgba(244, 234, 204, 0.15)',
                    background: sponsor.featured
                      ? 'linear-gradient(180deg, rgba(211, 47, 47, 0.08) 0%, rgba(8, 8, 8, 0.85) 100%)'
                      : 'rgba(8, 8, 8, 0.65)',
                    boxShadow: sponsor.featured
                      ? '0 4px 20px rgba(211, 47, 47, 0.18)'
                      : '0 4px 15px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  {/* Subtle Top Accent Line for Featured */}
                  {sponsor.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '10%',
                        right: '10%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #d32f2f, transparent)',
                      }}
                    />
                  )}

                  {/* Category / Tier Tag */}
                  <div style={{ width: '100%', marginBottom: '1.1rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '3px',
                        color: sponsor.featured ? 'var(--color-star-white)' : 'rgba(244, 234, 204, 0.75)',
                        background: sponsor.featured ? 'rgba(211, 47, 47, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: sponsor.featured ? '1px solid rgba(211, 47, 47, 0.45)' : '1px solid rgba(244, 234, 204, 0.12)',
                      }}
                    >
                      {sponsor.category}
                    </span>
                  </div>

                  {/* Clean Logo Card */}
                  {sponsor.url ? (
                    <a
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${sponsor.name} (${sponsor.url})`}
                      style={{
                        width: '100%',
                        textDecoration: 'none',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: sponsor.fill ? '115px' : '115px',
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: sponsor.fill ? '0' : '0.85rem 1rem',
                          boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.04), 0 3px 12px rgba(0, 0, 0, 0.35)',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(211, 47, 47, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'inset 0 0 8px rgba(0, 0, 0, 0.04), 0 3px 12px rgba(0, 0, 0, 0.35)';
                        }}
                      >
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          style={{
                            width: sponsor.fill ? '100%' : 'auto',
                            height: sponsor.fill ? '100%' : 'auto',
                            maxWidth: sponsor.fill ? 'none' : '100%',
                            maxHeight: sponsor.fill ? 'none' : '100%',
                            objectFit: sponsor.fill ? 'cover' : 'contain',
                            objectPosition: sponsor.objectPosition || 'center',
                            display: 'block',
                          }}
                        />
                      </div>
                    </a>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: sponsor.fill ? '115px' : '115px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: sponsor.fill ? '0' : '0.85rem 1rem',
                        boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.04), 0 3px 12px rgba(0, 0, 0, 0.35)',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        style={{
                          width: sponsor.fill ? '100%' : 'auto',
                          height: sponsor.fill ? '100%' : 'auto',
                          maxWidth: sponsor.fill ? 'none' : '100%',
                          maxHeight: sponsor.fill ? 'none' : '100%',
                          objectFit: sponsor.fill ? 'cover' : 'contain',
                          objectPosition: sponsor.objectPosition || 'center',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}

                  {/* Sponsor Name & Subtitle */}
                  <div style={{ marginTop: '1.1rem', width: '100%' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: 'var(--color-star-white)',
                        margin: 0,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {sponsor.name}
                    </h3>
                    {sponsor.description && (
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'rgba(244, 234, 204, 0.65)',
                          margin: '0.35rem 0 0 0',
                          lineHeight: '1.4',
                        }}
                      >
                        {sponsor.description}
                      </p>
                    )}

                    {/* Official Website Link */}
                    {sponsor.url && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <a
                          href={sponsor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: 'var(--color-bright-crimson, #d32f2f)',
                            fontSize: '0.74rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textDecoration: 'none',
                            padding: '0.3rem 0.75rem',
                            background: 'rgba(211, 47, 47, 0.1)',
                            border: '1px solid rgba(211, 47, 47, 0.4)',
                            borderRadius: '4px',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 47, 47, 0.25)';
                            e.currentTarget.style.borderColor = 'var(--color-bright-crimson, #d32f2f)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(211, 47, 47, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.4)';
                          }}
                        >
                          <span>VISIT WEBSITE</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
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
