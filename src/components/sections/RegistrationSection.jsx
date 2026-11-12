import React, { useState } from 'react';
import { User, Users, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import IndividualRegModal from './IndividualRegModal';
import TeamRegModal from './TeamRegModal';

const RegistrationSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [targetEventId, setTargetEventId] = useState('hackathon');
  const [showFestChoice, setShowFestChoice] = useState(false);

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', width: '100%', maxWidth: '980px', margin: '0 auto' }}>
          
          {/* 1. Hackathon Participation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', textAlign: 'center', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 3.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(211, 47, 47, 0.15)', border: '1px solid rgba(211, 47, 47, 0.4)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--color-bright-crimson)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  Flagship Technical Event
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                  Hackathon Participation
                </h3>
                
                <p className="mb-6 font-light leading-relaxed max-w-xl" style={{ color: 'rgba(244, 234, 204, 0.8)', fontSize: '1rem', minHeight: '3rem' }}>
                  Register your team for the flagship 24-Hour Hackathon. Build breakthrough solutions, collaborate with peers, and compete for victory.
                </p>

                {/* Highlights Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', width: '100%', marginBottom: '2.25rem', textAlign: 'left' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Prize Pool</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>Revealing Soon</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Cash prizes + trophies</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Team Size</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>2 – 4 Members</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Inter-college welcome</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Registration Fee</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-bright-crimson)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>₹500 / Team</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Stay & meals included</div>
                  </div>
                </div>
              </div>
              
              <NeonButton
                id="hackathon-register-btn"
                type="button"
                style={{ width: '100%', maxWidth: '380px', padding: '1rem 2rem', fontSize: '1rem' }}
                onClick={() => {
                  setTargetEventId('hackathon');
                  setShowTeamModal(true);
                }}
              >
                REGISTER FOR HACKATHON
              </NeonButton>
            </GlassCard>
          </motion.div>

          {/* 2. Fest Event Participation Card (Matching Elevated Design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', textAlign: 'center', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 3.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', borderColor: 'rgba(0, 240, 255, 0.4)' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.45)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  Technical, Gaming & Cultural
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                  Fest Event Participation
                </h3>
                
                <p className="mb-6 font-light leading-relaxed max-w-xl" style={{ color: 'rgba(244, 234, 204, 0.8)', fontSize: '1rem', minHeight: '3rem' }}>
                  Register for technical, creative, and gaming competitions. Choose from solo quests, skill battles, or squad esports tournaments.
                </p>

                {/* Highlights Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', width: '100%', marginBottom: '2.25rem', textAlign: 'left' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Competitions</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>8+ Events</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Solo & squad formats</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Rewards</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>Revealing Soon</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Cash prizes + certificates</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Entry Fee</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>From ₹50</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>₹50 to ₹600 per event</div>
                  </div>
                </div>
              </div>
              
              <button
                id="fest-events-register-btn"
                type="button"
                className="transition-all duration-300"
                onClick={() => setShowFestChoice(true)}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  padding: '1rem 2rem',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
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
                REGISTER FOR FEST EVENTS
              </button>
            </GlassCard>
          </motion.div>

        </div>
      </div>

      {/* Portalled directly into document.body */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Fest Event Type Selection Modal */}
          <AnimatePresence>
            {showFestChoice && (
              <motion.div
                key="fest-choice-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(8, 8, 8, 0.92)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 99999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem 1rem',
                  overflowY: 'auto',
                }}
                onClick={() => setShowFestChoice(false)}
                data-lenis-prevent="true"
              >
                <motion.div
                  key="fest-choice-card"
                  initial={{ scale: 0.92, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.92, y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: '640px',
                    backgroundColor: 'var(--color-space-black)',
                    border: '1px solid var(--color-star-white)',
                    boxShadow: '6px 6px 0px 0px rgba(244, 234, 204, 0.4), 0 0 50px rgba(211, 47, 47, 0.15)',
                    padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                    position: 'relative',
                  }}
                >
                  <button
                    id="close-fest-choice-btn"
                    onClick={() => setShowFestChoice(false)}
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      right: '1.25rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-star-white)',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={22} />
                  </button>

                  <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-star-white)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                      Fest Event <span style={{ color: 'var(--color-neon-cyan)' }}>Registration</span>
                    </h3>
                    <p style={{ color: 'rgba(244, 234, 204, 0.7)', fontSize: '0.85rem' }}>
                      Choose your participation format to continue:
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                    {/* Individual Option */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(244, 234, 204, 0.2)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '4px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <User size={18} color="var(--color-neon-cyan)" />
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-star-white)', margin: 0 }}>
                            Individual Events
                          </h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(244, 234, 204, 0.65)', marginBottom: '0.6rem' }}>
                          Solo skill & creative competitions:
                        </p>
                        <ul style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.55)', paddingLeft: '1.1rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          <li>Photography (₹100)</li>
                          <li>Impossible to Sell (₹100)</li>
                          <li>Killer Game (₹50)</li>
                        </ul>
                      </div>
                      <button
                        id="choose-individual-reg-btn"
                        onClick={() => {
                          setShowFestChoice(false);
                          setShowModal(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--color-neon-cyan)',
                          color: 'var(--color-space-black)',
                          border: 'none',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '3px 3px 0px 0px rgba(244, 234, 204, 0.4)',
                        }}
                      >
                        Register Individual &rarr;
                      </button>
                    </div>

                    {/* Team Option */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(244, 234, 204, 0.2)',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '4px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Users size={18} color="var(--color-star-white)" />
                          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-star-white)', margin: 0 }}>
                            Team Events
                          </h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(244, 234, 204, 0.65)', marginBottom: '0.6rem' }}>
                          Squad & gaming tournaments:
                        </p>
                        <ul style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.55)', paddingLeft: '1.1rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                          <li>TechQuiz (₹300 / team)</li>
                          <li>Treasure Hunt (₹600 / team)</li>
                          <li>BGMI Tournament (₹400 / squad)</li>
                          <li>Free Fire (₹400 / squad)</li>
                        </ul>
                      </div>
                      <button
                        id="choose-team-reg-btn"
                        onClick={() => {
                          setShowFestChoice(false);
                          setTargetEventId('tech_quiz');
                          setShowTeamModal(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'var(--color-star-white)',
                          color: 'var(--color-space-black)',
                          border: 'none',
                          fontFamily: 'var(--font-heading)',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: '3px 3px 0px 0px rgba(244, 234, 204, 0.4)',
                        }}
                      >
                        Register Team &rarr;
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showModal && <IndividualRegModal key="ind-modal" onClose={() => setShowModal(false)} />}
          </AnimatePresence>
          <AnimatePresence>
            {showTeamModal && (
              <TeamRegModal
                key="team-modal"
                initialEventId={targetEventId}
                onClose={() => setShowTeamModal(false)}
              />
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </section>
  );
};

export default RegistrationSection;
