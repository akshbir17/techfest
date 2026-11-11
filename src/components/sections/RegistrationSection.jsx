import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import TeamRegModal from './TeamRegModal';

const RegistrationSection = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);

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
            <span className="text-gradient">HACKATHON</span> REGISTRATION
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto" style={{ width: '100%' }}>
          
          {/* 24-Hour Hackathon Participation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <GlassCard style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(211, 47, 47, 0.15)', border: '1px solid rgba(211, 47, 47, 0.4)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--color-bright-crimson)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Flagship Technical Event
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                Hackathon Participation
              </h3>
              
              <p className="mb-6 font-light leading-relaxed max-w-xl" style={{ color: 'rgba(244, 234, 204, 0.8)', fontSize: '1.05rem' }}>
                Register your team for the flagship 24-Hour Hackathon. Build breakthrough solutions, collaborate with peers, and compete for victory.
              </p>

              {/* Highlights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%', maxWidth: '620px', marginBottom: '2.25rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Prize Pool</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>₹44,000</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>₹30K 1st · ₹14K 2nd</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Team Size</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>2 – 4 Members</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Inter-college squads welcome</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Registration Fee</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-bright-crimson)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>₹800 / Team</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Stay & meals included</div>
                </div>
              </div>
              
              <NeonButton
                id="hackathon-register-btn"
                type="button"
                style={{ width: '100%', maxWidth: '380px', padding: '1rem 2rem', fontSize: '1rem' }}
                onClick={() => setShowTeamModal(true)}
              >
                REGISTER FOR HACKATHON
              </NeonButton>
            </GlassCard>
          </motion.div>

        </div>
      </div>

      {/* Portalled directly into document.body */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showTeamModal && (
            <TeamRegModal
              key="team-modal"
              initialEventId="hackathon"
              onClose={() => setShowTeamModal(false)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};

export default RegistrationSection;
