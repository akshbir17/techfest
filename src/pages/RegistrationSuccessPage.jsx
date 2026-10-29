import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Hash } from 'lucide-react';

const RegistrationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id') || 'N/A';
  const eventName = searchParams.get('event') || 'Event';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(211,47,47,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '540px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Check icon with animated ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '2px solid var(--color-neon-cyan)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(211,47,47,0.1)',
              border: '2px solid var(--color-neon-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(211,47,47,0.3)',
            }}
          >
            <CheckCircle size={40} color="var(--color-neon-cyan)" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: '800',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              color: 'var(--color-star-white)',
            }}
          >
            Payment <span style={{ color: 'var(--color-neon-cyan)' }}>Successful!</span>
          </h1>
          <p
            style={{
              color: 'rgba(244,234,204,0.6)',
              fontSize: '1rem',
              marginBottom: '2.5rem',
              lineHeight: '1.6',
            }}
          >
            Your registration for <strong style={{ color: 'var(--color-star-white)' }}>{decodeURIComponent(eventName)}</strong> has been confirmed.
          </p>
        </motion.div>

        {/* Order ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            background: 'var(--color-space-black)',
            border: '1px solid var(--color-neon-cyan)',
            boxShadow: '4px 4px 0px 0px rgba(211,47,47,0.6)',
            borderRadius: '4px',
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Hash size={14} color="var(--color-neon-cyan)" />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-neon-cyan)', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Confirmation ID
            </p>
          </div>
          <p
            id="order-id-display"
            style={{
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              color: 'var(--color-star-white)',
              letterSpacing: '0.08em',
              wordBreak: 'break-all',
            }}
          >
            {orderId}
          </p>
          <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(244,234,204,0.4)' }}>
            Please save this ID for your records. A confirmation will be sent to your registered email.
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ height: '1px', background: 'rgba(211,47,47,0.25)', marginBottom: '2rem' }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button
            id="back-to-home-btn"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: '800',
              fontSize: '0.9rem',
              color: 'var(--color-space-black)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              background: 'var(--color-neon-cyan)',
              border: '2px solid var(--color-neon-cyan)',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '4px 4px 0px 0px rgba(244,234,204,0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244,234,204,0.4)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(244,234,204,0.4)'; }}
          >
            <Home size={18} />
            Back to Home
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: 'rgba(244,234,204,0.25)', letterSpacing: '0.05em' }}
        >
          See you at the fest! ✦
        </motion.p>
      </div>
    </main>
  );
};

export default RegistrationSuccessPage;
