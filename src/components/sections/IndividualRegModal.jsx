import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

// List of individual events
const INDIVIDUAL_EVENTS = [
  { id: 'impossible_to_sell', name: 'Impossible to Sell',          fee: 100, description: 'Creative selling challenge — pitch an unusual or bizarre product. Prizes Revealing Soon.' },
  { id: 'mock_interview',     name: 'Mock Interview',              fee: 100, description: 'Simulate a real interview and get evaluated by corporate panelists. Prizes Revealing Soon.' },
  { id: 'killer_game',        name: 'Killer Game',                 fee: 50,  description: 'Social deduction & stealth elimination challenge on Day 1. Prizes Revealing Soon.' },
  { id: 'photo_booth',        name: 'Photography',                  fee: 100, description: 'Submit your best shot — Google Drive link shared on 9 Dec at 12 PM. Prizes Revealing Soon.' },
];

const IndividualRegModal = ({ onClose, initialEventId }) => {
  const navigate = useNavigate();
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
          type: 'individual',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        setServerError('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'SPECTRUM 1.0',
        description: `${selectedEvent.name} Registration`,
        order_id: data.orderId,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        theme: {
          color: '#d32f2f',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registrationData: {
                  name: form.name.trim(),
                  email: form.email.trim(),
                  phone: form.phone.trim(),
                  college: form.college.trim(),
                  eventId: selectedEvent.id,
                  eventName: selectedEvent.name,
                  fee: selectedEvent.fee,
                  type: 'individual',
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onClose();
              const regParam = verifyData.registrationId ? `&reg_id=${verifyData.registrationId}` : '';
              navigate(`/registration-success?order_id=${response.razorpay_order_id}&event=${encodeURIComponent(selectedEvent.name)}&payment_id=${response.razorpay_payment_id}&name=${encodeURIComponent(form.name)}&amount=${selectedEvent.fee}${regParam}`);
            } else {
              setServerError(verifyData.error || `Payment verification failed. Payment ID: ${response.razorpay_payment_id}`);
              setLoading(false);
            }
          } catch (verErr) {
            console.error('Verify error:', verErr);
            setServerError(`Payment recorded, but network verification failed. Payment ID: ${response.razorpay_payment_id}`);
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setServerError(resp.error?.description || 'Payment was declined or cancelled.');
        setLoading(false);
      });
      rzp.open();
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
        {/* Modal Window */}
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
                  Secure payment via Razorpay
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
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    fontFamily: 'var(--font-primary)',
                    fontSize: '0.95rem',
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

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <FieldInput
                id="reg-name"
                label="Full Name"
                name="name"
                type="text"
                placeholder="Participant Name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
                disabled={loading}
              />
              <FieldInput
                id="reg-email"
                label="Email Address"
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                disabled={loading}
              />
              <FieldInput
                id="reg-phone"
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                disabled={loading}
              />
              <FieldInput
                id="reg-college"
                label="College / Institution"
                name="college"
                type="text"
                placeholder="College Name"
                value={form.college}
                onChange={handleChange}
                error={errors.college}
                disabled={loading}
              />
            </div>

            {/* Server Error Notice */}
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
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '800', color: 'var(--color-neon-cyan)' }}>
                  ₹{selectedEvent.fee}
                </p>
              </div>

              <button
                id="pay-button"
                type="button"
                onClick={handlePay}
                disabled={!isFormComplete || loading}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  padding: '1rem 1.5rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: '800',
                  fontSize: '1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isFormComplete && !loading ? 'var(--color-space-black)' : 'rgba(244,234,204,0.3)',
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
              🔒 Secured by Razorpay · UPI · Cards · Net Banking supported
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
      onFocus={(e) => { e.target.style.borderColor = 'var(--color-neon-cyan)'; }}
      onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-neon-cyan)' : '#333'; }}
    />
    {error && (
      <p style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--color-neon-cyan)' }}>
        {error}
      </p>
    )}
  </div>
);

export default IndividualRegModal;
