import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

// List of individual events
const INDIVIDUAL_EVENTS = [
  { id: 'open_mic',       name: 'Open Mic',                  fee: 200, description: 'Showcase your talent on stage — poetry, comedy, music & more. Trophy or recognition for winner.' },
  { id: 'mock_interview', name: 'Mock Interview',            fee: 120, description: 'Simulate a real interview and get evaluated — ₹1,000 cash prize for top participant.' },
  { id: 'photo_booth',   name: 'Photo Booth Photo Contest',  fee: 79,  description: 'Submit your best shot — max 3 entries per person at ₹79 each. ₹1,000 prize pool.' },
];

const IndividualRegModal = ({ onClose, initialEventId }) => {
  const [selectedEvent, setSelectedEvent] = useState(
    INDIVIDUAL_EVENTS.find((e) => e.id === initialEventId) || INDIVIDUAL_EVENTS[0]
  );
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useScrollLock(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, onClose]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email is required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Valid 10-digit phone number is required';
    if (!form.college.trim()) errs.college = 'College name is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleEventChange = (e) => {
    const ev = INDIVIDUAL_EVENTS.find((ev) => ev.id === e.target.value);
    if (ev) setSelectedEvent(ev);
  };

  const handlePay = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          college: form.college.trim(),
          eventId: selectedEvent.id,
          eventName: selectedEvent.name,
          fee: selectedEvent.fee,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      // Trigger Cashfree checkout (SDK loaded via <script> in index.html)
      const cashfree = window.Cashfree({ mode: 'sandbox' }); // → 'production' when live
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: '_self',
      });
      // Loading stays true — user is redirected by Cashfree
    } catch (err) {
      console.error(err);
      setServerError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const isFormComplete =
    form.name.trim() && form.email.trim() && form.phone.trim() && form.college.trim();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={loading ? undefined : onClose}
        data-lenis-prevent="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(8, 8, 8, 0.92)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 1rem',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: 'calc(100dvh - 1.5rem)',
            margin: 'auto',
            background: 'var(--color-space-black)',
            border: '1px solid var(--color-neon-cyan)',
            boxShadow: '6px 6px 0px 0px rgba(211, 47, 47, 0.8), 0 0 40px rgba(211, 47, 47, 0.15)',
            borderRadius: '4px',
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-neon-cyan), var(--color-neon-blue), transparent)', width: '100%' }} />

          <div style={{ padding: 'clamp(1.1rem, 4vw, 2rem)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-star-white)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Individual <span style={{ color: 'var(--color-neon-cyan)' }}>Registration</span>
                </h2>
                <p style={{ color: 'rgba(244,234,204,0.5)', fontSize: '0.8rem', marginTop: '0.3rem', letterSpacing: '0.05em' }}>
                  Secure payment via Cashfree
                </p>
              </div>
              {!loading && (
                <button
                  onClick={onClose}
                  id="modal-close-btn"
                  style={{ background: 'transparent', border: 'none', color: 'rgba(244,234,204,0.5)', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-neon-cyan)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(244,234,204,0.5)')}
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Event Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-neon-cyan)', marginBottom: '0.5rem', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Select Event
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="event-select"
                  value={selectedEvent.id}
                  onChange={handleEventChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'var(--color-deep-blue)',
                    border: '1px solid #333',
                    borderBottom: '2px solid var(--color-neon-cyan)',
                    color: 'var(--color-star-white)',
                    padding: '0.9rem 2.5rem 0.9rem 1rem',
                    fontFamily: 'var(--font-primary)',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    outline: 'none',
                  }}
                >
                  {INDIVIDUAL_EVENTS.map((ev) => (
                    <option key={ev.id} value={ev.id} style={{ background: '#121212' }}>
                      {ev.name} — ₹{ev.fee}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neon-cyan)', pointerEvents: 'none' }} />
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(244,234,204,0.5)', fontStyle: 'italic' }}>
                {selectedEvent.description}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(211,47,47,0.2)', marginBottom: '1.5rem' }} />

            {/* Form Fields */}
            <div className="modal-form-grid">
              {/* Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput id="reg-name" label="Full Name" name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={handleChange} error={errors.name} disabled={loading} />
              </div>
              {/* Email */}
              <div>
                <FieldInput id="reg-email" label="Email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} error={errors.email} disabled={loading} />
              </div>
              {/* Phone */}
              <div>
                <FieldInput id="reg-phone" label="Phone" name="phone" type="tel" placeholder="10-digit number" value={form.phone} onChange={handleChange} error={errors.phone} disabled={loading} />
              </div>
              {/* College */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput id="reg-college" label="College / Institution" name="college" type="text" placeholder="Your college name" value={form.college} onChange={handleChange} error={errors.college} disabled={loading} />
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(211,47,47,0.1)', border: '1px solid rgba(211,47,47,0.4)', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '1rem' }}
              >
                <AlertCircle size={16} style={{ color: 'var(--color-neon-cyan)', flexShrink: 0 }} />
                <p style={{ color: 'var(--color-neon-cyan)', fontSize: '0.85rem' }}>{serverError}</p>
              </motion.div>
            )}

            {/* Fee Summary + Pay Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(244,234,204,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Registration Fee</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '800', color: 'var(--color-star-white)' }}>
                  ₹<span style={{ color: 'var(--color-neon-cyan)' }}>{selectedEvent.fee}</span>
                </p>
              </div>
              <button
                id="pay-now-btn"
                onClick={handlePay}
                disabled={!isFormComplete || loading}
                style={{
                  flex: '1',
                  minWidth: '160px',
                  padding: '1rem 1.5rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  color: isFormComplete && !loading ? 'var(--color-space-black)' : 'rgba(244,234,204,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  background: isFormComplete && !loading ? 'var(--color-neon-cyan)' : 'rgba(211,47,47,0.1)',
                  border: '2px solid',
                  borderColor: isFormComplete && !loading ? 'var(--color-neon-cyan)' : 'rgba(211,47,47,0.3)',
                  borderRadius: '4px',
                  cursor: isFormComplete && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: isFormComplete && !loading ? '4px 4px 0px 0px rgba(244,234,204,0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={(e) => {
                  if (isFormComplete && !loading) {
                    e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244,234,204,0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isFormComplete && !loading ? '4px 4px 0px 0px rgba(244,234,204,0.4)' : 'none';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedEvent.fee}`
                )}
              </button>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'rgba(244,234,204,0.3)', textAlign: 'center', letterSpacing: '0.05em' }}>
              🔒 Secured by Cashfree · UPI · Cards · Net Banking supported
            </p>
          </div>
        </motion.div>
      </motion.div>
  </>
  );
};

// Reusable field component
const FieldInput = ({ id, label, name, type, placeholder, value, onChange, error, disabled }) => (
  <div>
    <label htmlFor={id} style={{ display: 'block', fontSize: '0.75rem', color: error ? 'var(--color-neon-cyan)' : 'rgba(244,234,204,0.6)', marginBottom: '0.4rem', letterSpacing: '0.1em', fontWeight: 'bold', textTransform: 'uppercase', transition: 'color 0.2s' }}>
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        background: 'var(--color-deep-blue)',
        border: '1px solid',
        borderColor: error ? 'var(--color-neon-cyan)' : '#333',
        borderBottom: `2px solid ${error ? 'var(--color-neon-cyan)' : 'var(--color-neon-cyan)'}`,
        color: 'var(--color-star-white)',
        padding: '0.75rem',
        fontFamily: 'var(--font-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
      onFocus={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = 'var(--color-neon-cyan)'; }}
      onBlur={(e) => { e.currentTarget.style.background = 'var(--color-deep-blue)'; if (!error) e.currentTarget.style.borderColor = '#333'; }}
    />
    {error && <p style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: 'var(--color-neon-cyan)', opacity: 0.8 }}>{error}</p>}
  </div>
);

export default IndividualRegModal;

