import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, Users, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

const EventRulesModal = ({ event, onClose, onRegister }) => {
  useScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!event) return null;

  return (
    <div
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 0.5rem',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        data-lenis-prevent="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '720px',
          maxHeight: 'calc(100dvh - 1.25rem)',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0c',
          border: '1px solid var(--color-neon-cyan)',
          boxShadow: '0 0 40px rgba(211, 47, 47, 0.25), 8px 8px 0px 0px rgba(211, 47, 47, 0.5)',
          borderRadius: '6px',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.1rem 1.25rem',
            borderBottom: '1px solid rgba(211, 47, 47, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(211, 47, 47, 0.08) 0%, transparent 100%)',
            gap: '0.75rem',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  color: 'var(--color-neon-cyan)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-neon-cyan)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '3px',
                }}
              >
                {event.category || 'EVENT'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.5)' }}>✦ Official Rulebook</span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.2rem, 4.5vw, 1.65rem)',
                fontWeight: '900',
                color: 'var(--color-star-white)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0,
                wordBreak: 'break-word',
                lineHeight: 1.25,
              }}
            >
              {event.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close rules"
            style={{
              background: 'transparent',
              border: '1px solid rgba(244, 234, 204, 0.2)',
              color: 'var(--color-star-white)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
              e.currentTarget.style.color = 'var(--color-neon-cyan)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.2)';
              e.currentTarget.style.color = 'var(--color-star-white)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            padding: '1.75rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Key Specs Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(244, 234, 204, 0.1)',
              borderRadius: '4px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-neon-cyan)', fontSize: '0.75rem' }}>
                <Calendar size={14} /> <span>DATE</span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-star-white)' }}>
                {event.date || 'Dec 18–20, 2026'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-neon-cyan)', fontSize: '0.75rem' }}>
                <Users size={14} /> <span>TEAM SIZE</span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-star-white)' }}>
                {event.teamSize}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-neon-cyan)', fontSize: '0.75rem' }}>
                <MapPin size={14} /> <span>VENUE</span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--color-star-white)' }}>
                {event.venue || 'GNDEC Campus'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-neon-cyan)', fontSize: '0.75rem' }}>
                <Award size={14} /> <span>PRIZE / REWARD</span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#ffb300' }}>
                {event.prize || 'Cash Prizes & Certificates'}
              </span>
            </div>
          </div>

          {/* About / Overview */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                color: 'var(--color-star-white)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldCheck size={16} color="var(--color-neon-cyan)" /> Overview
            </h3>
            <p style={{ color: 'rgba(244, 234, 204, 0.75)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
              {event.description}
            </p>
          </div>

          {/* Rules List */}
          {event.rules && event.rules.length > 0 && (
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: 'var(--color-star-white)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <CheckCircle2 size={16} color="var(--color-neon-cyan)" /> Rules & Regulations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {event.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '4px',
                      borderLeft: '2px solid var(--color-neon-cyan)',
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--color-neon-cyan)',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        fontFamily: 'monospace',
                        minWidth: '22px',
                        paddingTop: '1px',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span style={{ color: 'rgba(244, 234, 204, 0.85)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Judging Criteria */}
          {event.judging && event.judging.length > 0 && (
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  color: 'var(--color-star-white)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '0.6rem',
                }}
              >
                ✦ Judging Criteria & Evaluation
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {event.judging.map((criteria, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(211, 47, 47, 0.1)',
                      border: '1px solid rgba(211, 47, 47, 0.3)',
                      color: 'var(--color-star-white)',
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                    }}
                  >
                    {criteria}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="rules-modal-footer">
          <div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(244, 234, 204, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Registration Fee
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-heading)' }}>
              ₹{event.price}
            </div>
          </div>

          <div className="rules-modal-actions">
            <button
              onClick={onClose}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'transparent',
                border: '1px solid rgba(244, 234, 204, 0.25)',
                color: 'var(--color-star-white)',
                borderRadius: '4px',
                fontFamily: 'var(--font-primary)',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.6)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.25)'; }}
            >
              Close
            </button>

            <button
              id={`rules-register-btn-${event.id || 'btn'}`}
              onClick={() => {
                onClose();
                if (onRegister) onRegister(event);
              }}
              style={{
                padding: '0.75rem 1.4rem',
                background: 'var(--color-neon-cyan)',
                border: '1px solid var(--color-neon-cyan)',
                color: 'var(--color-space-black)',
                borderRadius: '4px',
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                boxShadow: '3px 3px 0px 0px rgba(244, 234, 204, 0.4)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) translateX(-1px)';
                e.currentTarget.style.boxShadow = '5px 5px 0px 0px rgba(244, 234, 204, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '3px 3px 0px 0px rgba(244, 234, 204, 0.4)';
              }}
            >
              Register Now
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventRulesModal;
