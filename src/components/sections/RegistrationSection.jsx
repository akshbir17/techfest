import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';

const RegistrationSection = () => {
  const individualFormLink = "https://forms.gle/MddTGhVQbCHa5uwt7";
  const teamFormLink = "https://docs.google.com/forms/d/e/1FAIpQLScCYPeiP1WrssaluwouvOGz7cAcHQTTshBHDHFPXwt8rgI6ag/viewform?usp=send_form";

  return (
    <section id="registration" className="section-container reg-section">
      <div className="reg-content">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">EVENT</span> REGISTRATION
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" style={{ gap: '2rem' }}>
          
          {/* Individual Participation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)' }}>
                Individual Participation
              </h3>
              <p className="mb-8 font-light leading-relaxed flex-grow" style={{ color: 'rgba(244, 234, 204, 0.7)' }}>
                Register for individual events and solo participation
              </p>
              
              <a href={individualFormLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                <NeonButton type="button" style={{ width: '100%' }}>
                  Register Individual
                </NeonButton>
              </a>
            </GlassCard>
          </motion.div>

          {/* Team Participation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: 'var(--color-star-white)' }}>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)' }}>
                Team Participation
              </h3>
              <p className="mb-8 font-light leading-relaxed flex-grow" style={{ color: 'rgba(244, 234, 204, 0.7)' }}>
                Register for team-based events and group participation
              </p>
              
              <a href={teamFormLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
                <button 
                  type="button" 
                  className="transition-all duration-300"
                  style={{
                    width: '100%',
                    padding: '1rem 2.5rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: '800',
                    color: 'var(--color-space-black)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    backgroundColor: 'var(--color-star-white)',
                    border: '2px solid var(--color-star-white)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '4px 4px 0px 0px rgba(244, 234, 204, 0.5)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244, 234, 204, 0.5)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(244, 234, 204, 0.5)'; }}
                >
                  Register Team
                </button>
              </a>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
