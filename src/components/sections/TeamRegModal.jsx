import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, Loader2, AlertCircle, Users } from 'lucide-react';

// Team events — update here to add/remove events
const TEAM_EVENTS = [
  { id: 'hackathon',  name: '24-Hour Hackathon',   fee: 800, teamSize: '2–4', description: 'Flagship event — build something amazing in 24 hours. ₹30,000 first prize, ₹14,000 second prize.' },
  { id: 'bgmi',       name: 'BGMI Tournament',      fee: 400, teamSize: '4',   description: 'Squad-based competitive BGMI. ₹4,000 first prize, ₹2,000 second prize.' },
  { id: 'free_fire',  name: 'Free Fire Tournament', fee: 400, teamSize: '4',   description: 'Squad-based Free Fire battle. ₹4,000 first prize, ₹2,000 second prize.' },
  { id: 'tech_quiz',  name: 'TechQuiz',             fee: 300, teamSize: '1–3', description: 'Test your technical knowledge. ₹3,000 first prize, ₹1,500 second prize.' },
];

const TeamRegModal = ({ onClose, initialEventId }) => {
  const [selectedEvent, setSelectedEvent] = useState(
    TEAM_EVENTS.find((e) => e.id === initialEventId) || TEAM_EVENTS[0] || null
  );
  const [form, setForm] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    college: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const hasEvents = TEAM_EVENTS.length > 0;

  const validate = () => {
    const errs = {};
    if (!form.teamName.trim()) errs.teamName = 'Team name is required';
    if (!form.leaderName.trim()) errs.leaderName = 'Leader name is required';
    if (!form.leaderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leaderEmail))
      errs.leaderEmail = 'Valid email is required';
    if (!form.leaderPhone.trim() || !/^[6-9]\d{9}$/.test(form.leaderPhone.replace(/\s/g, '')))
      errs.leaderPhone = 'Valid 10-digit phone number is required';
    if (!form.college.trim()) errs.college = 'College name is required';
    if (!selectedEvent) errs.event = 'Please select an event';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleEventChange = (e) => {
    const ev = TEAM_EVENTS.find((ev) => ev.id === e.target.value);
    if (ev) {
      setSelectedEvent(ev);
      setErrors((prev) => ({ ...prev, event: '' }));
    }
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
          name: form.leaderName.trim(),
          email: form.leaderEmail.trim(),
          phone: form.leaderPhone.trim(),
          college: form.college.trim(),
          eventId: selectedEvent.id,
          eventName: selectedEvent.name,
          fee: selectedEvent.fee,
          // Extra team metadata (stored in Cashfree order_note via api/create-order)
          teamName: form.teamName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Failed to initiate payment. Please try again.');
        setLoading(false);
        return;
      }

      // Trigger Cashfree checkout
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
    hasEvents &&
    selectedEvent &&
    form.teamName.trim() &&
    form.leaderName.trim() &&
    form.leaderEmail.trim() &&
    form.leaderPhone.trim() &&
    form.college.trim();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="team-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={loading ? undefined : onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(8, 8, 8, 0.92)',
          backdropFilter: 'blur(6px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* Modal */}
        <motion.div
          key="team-modal"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'var(--color-space-black)',
            border: '1px solid var(--color-star-white)',
            boxShadow: '6px 6px 0px 0px rgba(244, 234, 204, 0.4), 0 0 40px rgba(211, 47, 47, 0.12)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            margin: 'auto',
          }}
        >
          {/* Top accent bar — white/cream for team (vs red for individual) */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-star-white), var(--color-neon-cyan), transparent)', width: '100%' }} />

          <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: 'rgba(244,234,204,0.08)', border: '1px solid var(--color-star-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Users size={18} color="var(--color-star-white)" />
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-star-white)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Team <span style={{ color: 'var(--color-neon-cyan)' }}>Registration</span>
                  </h2>
                  <p style={{ color: 'rgba(244,234,204,0.5)', fontSize: '0.8rem', marginTop: '0.3rem', letterSpacing: '0.05em' }}>
                    Secure payment via Cashfree
                  </p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={onClose}
                  id="team-modal-close-btn"
                  style={{ background: 'transparent', border: 'none', color: 'rgba(244,234,204,0.5)', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s', flexShrink: 0 }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-star-white)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(244,234,204,0.5)')}
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Event Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: errors.event ? 'var(--color-neon-cyan)' : 'rgba(244,234,204,0.6)', marginBottom: '0.5rem', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Select Team Event
              </label>

              {!hasEvents ? (
                /* ── No Events Placeholder ── */
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'rgba(244,234,204,0.03)',
                  border: '1px dashed rgba(244,234,204,0.2)',
                  borderRadius: '4px',
                  padding: '1rem',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(244,234,204,0.2)', transform: 'rotate(45deg)', flexShrink: 0 }} />
                  <p style={{ color: 'rgba(244,234,204,0.4)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                    Team events coming soon — check back later!
                  </p>
                </div>
              ) : (
                /* ── Dropdown ── */
                <div style={{ position: 'relative' }}>
                  <select
                    id="team-event-select"
                    value={selectedEvent?.id || ''}
                    onChange={handleEventChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: 'var(--color-deep-blue)',
                      border: '1px solid',
                      borderColor: errors.event ? 'var(--color-neon-cyan)' : '#333',
                      borderBottom: `2px solid ${errors.event ? 'var(--color-neon-cyan)' : 'var(--color-star-white)'}`,
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
                    <option value="" disabled style={{ background: '#121212' }}>— Choose an event —</option>
                    {TEAM_EVENTS.map((ev) => (
                      <option key={ev.id} value={ev.id} style={{ background: '#121212' }}>
                        {ev.name} — ₹{ev.fee} {ev.teamSize ? `(${ev.teamSize} members)` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-star-white)', pointerEvents: 'none' }} />
                </div>
              )}

              {selectedEvent?.description && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(244,234,204,0.5)', fontStyle: 'italic' }}>
                  {selectedEvent.description}
                  {selectedEvent.teamSize && (
                    <span style={{ marginLeft: '0.5rem', color: 'rgba(244,234,204,0.35)' }}>· Team size: {selectedEvent.teamSize}</span>
                  )}
                </p>
              )}
              {errors.event && <p style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: 'var(--color-neon-cyan)', opacity: 0.8 }}>{errors.event}</p>}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(244,234,204,0.1)', marginBottom: '1.5rem' }} />

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {/* Team Name — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-teamname"
                  label="Team Name"
                  name="teamName"
                  type="text"
                  placeholder="e.g. Team Phoenix"
                  value={form.teamName}
                  onChange={handleChange}
                  error={errors.teamName}
                  disabled={loading}
                />
              </div>
              {/* Leader Name — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-leadername"
                  label="Team Leader's Full Name"
                  name="leaderName"
                  type="text"
                  placeholder="Leader's name"
                  value={form.leaderName}
                  onChange={handleChange}
                  error={errors.leaderName}
                  disabled={loading}
                />
              </div>
              {/* Leader Email */}
              <div>
                <FieldInput
                  id="team-reg-email"
                  label="Leader Email"
                  name="leaderEmail"
                  type="email"
                  placeholder="you@email.com"
                  value={form.leaderEmail}
                  onChange={handleChange}
                  error={errors.leaderEmail}
                  disabled={loading}
                />
              </div>
              {/* Leader Phone */}
              <div>
                <FieldInput
                  id="team-reg-phone"
                  label="Leader Phone"
                  name="leaderPhone"
                  type="tel"
                  placeholder="10-digit number"
                  value={form.leaderPhone}
                  onChange={handleChange}
                  error={errors.leaderPhone}
                  disabled={loading}
                />
              </div>
              {/* College — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-college"
                  label="College / Institution"
                  name="college"
                  type="text"
                  placeholder="Your college name"
                  value={form.college}
                  onChange={handleChange}
                  error={errors.college}
                  disabled={loading}
                />
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
                  {selectedEvent
                    ? <>₹<span style={{ color: 'var(--color-neon-cyan)' }}>{selectedEvent.fee}</span></>
                    : <span style={{ fontSize: '1rem', opacity: 0.3 }}>— Select event —</span>
                  }
                </p>
              </div>
              <button
                id="team-pay-now-btn"
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
                  background: isFormComplete && !loading ? 'var(--color-star-white)' : 'rgba(244,234,204,0.05)',
                  border: '2px solid',
                  borderColor: isFormComplete && !loading ? 'var(--color-star-white)' : 'rgba(244,234,204,0.15)',
                  borderRadius: '4px',
                  cursor: isFormComplete && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: isFormComplete && !loading ? '4px 4px 0px 0px rgba(211,47,47,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={(e) => {
                  if (isFormComplete && !loading) {
                    e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(211,47,47,0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isFormComplete && !loading ? '4px 4px 0px 0px rgba(211,47,47,0.5)' : 'none';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : selectedEvent ? (
                  `Pay ₹${selectedEvent.fee}`
                ) : (
                  'Pay Now'
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

// Reusable field component (same as IndividualRegModal)
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
        borderBottom: `2px solid ${error ? 'var(--color-neon-cyan)' : 'var(--color-star-white)'}`,
        color: 'var(--color-star-white)',
        padding: '0.75rem',
        fontFamily: 'var(--font-primary)',
        fontSize: '0.9rem',
        outline: 'none',
        transition: 'all 0.2s ease',
        opacity: disabled ? 0.6 : 1,
      }}
      onFocus={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.borderColor = 'var(--color-star-white)'; }}
      onBlur={(e) => { e.currentTarget.style.background = 'var(--color-deep-blue)'; if (!error) e.currentTarget.style.borderColor = '#333'; }}
    />
    {error && <p style={{ marginTop: '0.25rem', fontSize: '0.72rem', color: 'var(--color-neon-cyan)', opacity: 0.8 }}>{error}</p>}
  </div>
);

export default TeamRegModal;

