import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollLock } from '../../hooks/useScrollLock';
import { motion } from 'framer-motion';
import { X, ChevronDown, Loader2, AlertCircle, Users, Plus, Trash2 } from 'lucide-react';
import { HACKATHON_THEMES, INDIAN_PHONE_REGEX, EMAIL_REGEX } from '../../constants/hackathon';

// Team events configuration
const TEAM_EVENTS = [
  {
    id: 'hackathon',
    name: '24-Hour Hackathon',
    fee: 1,
    min: 2,
    max: 4,
    teamSize: '2 to 4 members',
    description: 'Flagship event — build something amazing in 24 hours. Exciting cash prizes & trophies (Revealing Soon).',
    memberLabel: 'Team Member',
  },
  {
    id: 'tech_quiz',
    name: 'TechQuiz',
    fee: 300,
    min: 1,
    max: 3,
    teamSize: '1 to 3 members',
    description: 'Test your technical knowledge & algorithmic skills. Prizes Revealing Soon.',
    memberLabel: 'Quiz Partner',
  },
  {
    id: 'bgmi',
    name: 'BGMI Tournament',
    fee: 400,
    min: 4,
    max: 4,
    teamSize: '4 squad members',
    description: 'Squad-based competitive BGMI showdown. Prizes Revealing Soon.',
    memberLabel: 'Squad Player',
  },
  {
    id: 'free_fire',
    name: 'Free Fire Tournament',
    fee: 400,
    min: 4,
    max: 4,
    teamSize: '4 squad members',
    description: 'Squad-based Free Fire battle royale. Prizes Revealing Soon.',
    memberLabel: 'Squad Player',
  },
  {
    id: 'treasure_hunt',
    name: 'Treasure Hunt',
    fee: 600,
    min: 1,
    max: 4,
    teamSize: '1 to 4 members',
    description: 'Campus-wide mystery quest solving clues & riddles. Prizes Revealing Soon.',
    memberLabel: 'Team Member',
  },
];

const getMinAdditional = (ev) => Math.max(0, (ev?.min || 1) - 1);
const getMaxAdditional = (ev) => Math.max(0, (ev?.max || 4) - 1);

const TeamRegModal = ({ onClose, initialEventId }) => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(
    TEAM_EVENTS.find((e) => e.id === initialEventId) || TEAM_EVENTS[0] || null
  );

  const [form, setForm] = useState({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    college: '',
    theme: '',
    accommodation: 'Yes',
  });

  // Dynamic additional members (Member 2, Member 3, etc.)
  const [members, setMembers] = useState(() => {
    const minAdd = getMinAdditional(TEAM_EVENTS.find((e) => e.id === initialEventId) || TEAM_EVENTS[0]);
    return Array.from({ length: minAdd }, () => ({ name: '', phone: '' }));
  });

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

  const hasEvents = TEAM_EVENTS.length > 0;

  const validate = () => {
    const errs = {};
    if (!form.teamName.trim()) errs.teamName = 'Team name is required';
    if (selectedEvent?.id === 'hackathon' && !form.theme.trim()) {
      errs.theme = 'Please select a hackathon theme';
    }
    if (!form.leaderName.trim()) errs.leaderName = "Leader's full name is required";
    if (!form.leaderEmail.trim() || !EMAIL_REGEX.test(form.leaderEmail.trim()))
      errs.leaderEmail = 'Valid leader email is required';
    if (!form.leaderPhone.trim() || !INDIAN_PHONE_REGEX.test(form.leaderPhone.replace(/[\s-]+/g, '')))
      errs.leaderPhone = 'Valid 10-digit mobile number is required';
    if (!form.college.trim()) errs.college = 'College / Institution name is required';

    // Validate additional members
    const minAdd = getMinAdditional(selectedEvent);
    if (members.length < minAdd) {
      errs.members = `${selectedEvent.name} requires at least ${selectedEvent.min} total team members.`;
    }

    members.forEach((m, idx) => {
      const memberNum = idx + 2;
      const isRequired = idx < minAdd;
      if (isRequired || m.name.trim() || m.phone.trim()) {
        if (!m.name.trim()) {
          errs[`member_${idx}_name`] = `Member ${memberNum} name is required`;
        }
        const cleanedMemberPhone = m.phone.replace(/[\s-]+/g, '');
        if (!cleanedMemberPhone) {
          errs[`member_${idx}_phone`] = `Member ${memberNum} contact is required`;
        } else if (!INDIAN_PHONE_REGEX.test(cleanedMemberPhone)) {
          errs[`member_${idx}_phone`] = `Member ${memberNum} contact must be a valid 10-digit mobile number`;
        }
      }
    });

    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleEventChange = (e) => {
    const ev = TEAM_EVENTS.find((item) => item.id === e.target.value);
    if (ev) {
      setSelectedEvent(ev);
      setErrors({});
      const minAdd = getMinAdditional(ev);
      const maxAdd = getMaxAdditional(ev);
      setMembers((prev) => {
        let updated = [...prev];
        if (updated.length < minAdd) {
          while (updated.length < minAdd) {
            updated.push({ name: '', phone: '' });
          }
        } else if (updated.length > maxAdd) {
          updated = updated.slice(0, maxAdd);
        }
        return updated;
      });
    }
  };


  const handleMemberChange = (index, field, value) => {
    setMembers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`member_${index}_${field}`];
      delete copy.members;
      return copy;
    });
  };

  const handleAddMember = () => {
    const maxAdd = getMaxAdditional(selectedEvent);
    if (members.length < maxAdd) {
      setMembers((prev) => [...prev, { name: '', phone: '' }]);
    }
  };

  const handleRemoveMember = (index) => {
    const minAdd = getMinAdditional(selectedEvent);
    if (members.length > minAdd) {
      setMembers((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`member_${index}_name`];
        delete copy[`member_${index}_phone`];
        return copy;
      });
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

    const activeMembers = members
      .filter((m) => m.name.trim())
      .map((m) => ({ name: m.name.trim(), phone: m.phone.trim() }));

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.leaderName.trim(),
          email: form.leaderEmail.trim(),
          phone: form.leaderPhone.trim(),
          college: form.college.trim(),
          teamName: form.teamName.trim(),
          theme: form.theme.trim() || null,
          accommodation: selectedEvent?.id === 'hackathon' ? (form.accommodation || 'Yes') : 'N/A',
          members: activeMembers,
          eventId: selectedEvent.id,
          eventName: selectedEvent.name,
          fee: selectedEvent.fee,
          type: 'team',
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
        description: `${selectedEvent.name} - Team: ${form.teamName}`,
        order_id: data.orderId,
        prefill: {
          name: form.leaderName.trim(),
          email: form.leaderEmail.trim(),
          contact: form.leaderPhone.trim(),
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
                  name: form.leaderName.trim(),
                  email: form.leaderEmail.trim(),
                  phone: form.leaderPhone.trim(),
                  college: form.college.trim(),
                  teamName: form.teamName.trim(),
                  theme: form.theme.trim() || null,
                  accommodation: selectedEvent?.id === 'hackathon' ? (form.accommodation || 'Yes') : 'N/A',
                  members: activeMembers,
                  eventId: selectedEvent.id,
                  eventName: selectedEvent.name,
                  fee: selectedEvent.fee,
                  type: 'team',
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              onClose();
              const regParam = verifyData.registrationId ? `&reg_id=${encodeURIComponent(verifyData.registrationId)}` : '';
              const uniqueParam = verifyData.uniqueId ? `&unique_id=${encodeURIComponent(verifyData.uniqueId)}` : '';
              const tokenParam = verifyData.passToken ? `&token=${encodeURIComponent(verifyData.passToken)}` : '';
              const themeParam = form.theme ? `&theme=${encodeURIComponent(form.theme)}` : '';
              const accomParam = selectedEvent?.id === 'hackathon' ? `&accommodation=${encodeURIComponent(form.accommodation || 'Yes')}` : '';
              navigate(`/registration-success?order_id=${encodeURIComponent(response.razorpay_order_id)}&event=${encodeURIComponent(selectedEvent.name)}&payment_id=${encodeURIComponent(response.razorpay_payment_id)}&name=${encodeURIComponent(form.leaderName)}&team=${encodeURIComponent(form.teamName)}${themeParam}${accomParam}&amount=${selectedEvent.fee}${regParam}${uniqueParam}${tokenParam}`);
            } else {
              setServerError(
                `${verifyData?.error || 'Payment verification could not be completed.'} (Payment ID: ${response.razorpay_payment_id}). Please do not pay again — contact organizers with this Payment ID if amount was debited.`
              );
              setLoading(false);
            }
          } catch (verErr) {
            console.error('Verify error:', verErr);
            setServerError(
              `Network error while verifying payment (Payment ID: ${response.razorpay_payment_id}). If amount was debited, contact coordinators with this Payment ID.`
            );
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

  const minAdd = getMinAdditional(selectedEvent);
  const isFormComplete =
    hasEvents &&
    selectedEvent &&
    form.teamName.trim() &&
    form.leaderName.trim() &&
    form.leaderEmail.trim() &&
    form.leaderPhone.trim() &&
    form.college.trim() &&
    (selectedEvent?.id !== 'hackathon' || form.theme.trim()) &&
    members.every((m, idx) => {
      const isReq = idx < minAdd;
      if (isReq) return m.name.trim() && m.phone.trim();
      if (m.name.trim() || m.phone.trim()) {
        return m.name.trim() && m.phone.trim();
      }
      return true;
    });

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
          key="team-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-modal-title"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
          style={{
            width: '100%',
            maxWidth: '580px',
            maxHeight: 'calc(100dvh - 1.5rem)',
            background: 'var(--color-space-black)',
            border: '1px solid var(--color-star-white)',
            boxShadow: '6px 6px 0px 0px rgba(244, 234, 204, 0.4), 0 0 40px rgba(211, 47, 47, 0.12)',
            borderRadius: '4px',
            position: 'relative',
            overflowY: 'auto',
            margin: 'auto',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-star-white), var(--color-neon-cyan), transparent)', width: '100%' }} />

          <div style={{ padding: 'clamp(1.1rem, 4vw, 2rem)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid var(--color-star-white)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(244,234,204,0.05)', flexShrink: 0 }}>
                  <Users size={20} color="var(--color-star-white)" />
                </div>
                <div>
                  <h2 id="team-modal-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-star-white)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Team <span style={{ color: 'var(--color-neon-cyan)' }}>Registration</span>
                  </h2>
                  <p style={{ color: 'rgba(244,234,204,0.5)', fontSize: '0.75rem', marginTop: '0.2rem', letterSpacing: '0.05em' }}>
                    Secure payment via Razorpay
                  </p>
                </div>
              </div>
              {!loading && (
                <button
                  id="team-modal-close-btn"
                  type="button"
                  aria-label="Close team registration modal"
                  onClick={onClose}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(244,234,204,0.5)', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s' }}
                  onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-star-white)')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(244,234,204,0.5)')}
                >
                  <X size={22} />
                </button>
              )}
            </div>

            {/* Event Display or Selector */}
            {initialEventId === 'hackathon' ? (
              /* Strictly 24-Hour Hackathon */
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-star-white)', marginBottom: '0.5rem', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Event
                </label>

                <div
                  style={{
                    width: '100%',
                    background: 'rgba(211, 47, 47, 0.08)',
                    border: '1px solid rgba(211, 47, 47, 0.35)',
                    borderLeft: '4px solid var(--color-bright-crimson)',
                    borderRadius: '4px',
                    padding: '0.9rem 1.1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                      24-Hour Hackathon
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.7)', marginTop: '0.2rem' }}>
                      Squad: 2 to 4 members · Campus stay & meals included
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-neon-cyan)' }}>
                    ₹{selectedEvent?.fee || 1}
                  </div>
                </div>
              </div>
            ) : (
              /* Fest Team Event Dropdown */
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-star-white)', marginBottom: '0.5rem', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Select Team Event
                </label>

                <div style={{ position: 'relative' }}>
                  <select
                    id="team-event-select"
                    value={selectedEvent?.id || ''}
                    onChange={handleEventChange}
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: 'var(--color-deep-blue)',
                      border: '1px solid #333',
                      borderBottom: '2px solid var(--color-star-white)',
                      color: 'var(--color-star-white)',
                      padding: '0.85rem 2.5rem 0.85rem 1rem',
                      fontFamily: 'var(--font-primary)',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      outline: 'none',
                    }}
                  >
                    {TEAM_EVENTS.filter((e) => e.id !== 'hackathon').map((ev) => (
                      <option key={ev.id} value={ev.id} style={{ background: '#121212' }}>
                        {ev.name} — ₹{ev.fee} ({ev.teamSize})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-star-white)', pointerEvents: 'none' }} />
                </div>

                {selectedEvent?.description && (
                  <p style={{ marginTop: '0.45rem', fontSize: '0.78rem', color: 'rgba(244,234,204,0.55)', fontStyle: 'italic' }}>
                    {selectedEvent.description}
                    <span style={{ marginLeft: '0.4rem', color: 'var(--color-neon-cyan)' }}>· Team size: {selectedEvent.teamSize}</span>
                  </p>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(244,234,204,0.1)', marginBottom: '1.25rem' }} />

            {/* Leader & Team Form Fields */}
            <div className="modal-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
              {/* Select Theme for 24-Hour Hackathon */}
              {selectedEvent?.id === 'hackathon' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label
                    htmlFor="team-reg-theme"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--color-star-white)',
                      marginBottom: '0.45rem',
                      letterSpacing: '0.15em',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Select Theme <span style={{ color: 'var(--color-neon-cyan)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="team-reg-theme"
                      name="theme"
                      value={form.theme}
                      onChange={handleChange}
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: 'var(--color-deep-blue)',
                        border: errors.theme ? '1px solid #ff1744' : '1px solid #333',
                        borderBottom: errors.theme ? '2px solid #ff1744' : '2px solid var(--color-star-white)',
                        color: form.theme ? 'var(--color-star-white)' : 'rgba(244, 234, 204, 0.45)',
                        padding: '0.85rem 2.5rem 0.85rem 1rem',
                        fontFamily: 'var(--font-primary)',
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        outline: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      <option value="" disabled style={{ background: '#121212', color: 'rgba(244,234,204,0.45)' }}>
                        -- Select Theme --
                      </option>
                      {HACKATHON_THEMES.map((themeHeading, idx) => (
                        <option key={idx} value={themeHeading} style={{ background: '#121212', color: '#f4eacc' }}>
                          {themeHeading}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-star-white)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {errors.theme && (
                    <span style={{ color: '#ff1744', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
                      {errors.theme}
                    </span>
                  )}
                </div>
              )}

              {/* Accommodation Option for 24-Hour Hackathon */}
              {selectedEvent?.id === 'hackathon' && (
                <div style={{ gridColumn: '1 / -1', marginTop: '0.15rem', marginBottom: '0.35rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: 'var(--color-star-white)',
                      marginBottom: '0.45rem',
                      letterSpacing: '0.15em',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Campus Accommodation Needed? <span style={{ color: 'var(--color-neon-cyan)' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, accommodation: 'Yes' }))}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '4px',
                        background: form.accommodation === 'Yes' ? 'rgba(211, 47, 47, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                        border: form.accommodation === 'Yes' ? '1.5px solid var(--color-bright-crimson)' : '1px solid rgba(244, 234, 204, 0.2)',
                        color: form.accommodation === 'Yes' ? 'var(--color-star-white)' : 'rgba(244, 234, 204, 0.65)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: form.accommodation === 'Yes' ? 'var(--color-bright-crimson)' : 'transparent',
                          border: '2px solid var(--color-bright-crimson)',
                          display: 'inline-block',
                          boxShadow: form.accommodation === 'Yes' ? '0 0 8px var(--color-bright-crimson)' : 'none',
                        }}
                      />
                      YES (STAY NEEDED)
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, accommodation: 'No' }))}
                      disabled={loading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '4px',
                        background: form.accommodation === 'No' ? 'rgba(211, 47, 47, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                        border: form.accommodation === 'No' ? '1.5px solid var(--color-bright-crimson)' : '1px solid rgba(244, 234, 204, 0.2)',
                        color: form.accommodation === 'No' ? 'var(--color-star-white)' : 'rgba(244, 234, 204, 0.65)',
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: form.accommodation === 'No' ? 'var(--color-bright-crimson)' : 'transparent',
                          border: '2px solid var(--color-bright-crimson)',
                          display: 'inline-block',
                          boxShadow: form.accommodation === 'No' ? '0 0 8px var(--color-bright-crimson)' : 'none',
                        }}
                      />
                      NO (DAY SCHOLAR / SELF)
                    </button>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(244, 234, 204, 0.55)', marginTop: '0.35rem' }}>
                    Campus hostel accommodation & meals are provided by GNDEC for hackathon participants.
                  </div>
                </div>
              )}

              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-teamname"
                  label="Team / Squad Name"
                  name="teamName"
                  type="text"
                  placeholder="e.g. CyberKnights"
                  value={form.teamName}
                  onChange={handleChange}
                  error={errors.teamName}
                  disabled={loading}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-leadername"
                  label="Team Leader (Member 1) Full Name"
                  name="leaderName"
                  type="text"
                  placeholder="Leader's Name"
                  value={form.leaderName}
                  onChange={handleChange}
                  error={errors.leaderName}
                  disabled={loading}
                />
              </div>
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
              <div>
                <FieldInput
                  id="team-reg-phone"
                  label="Leader Mobile Phone"
                  name="leaderPhone"
                  type="tel"
                  placeholder="10-digit number"
                  value={form.leaderPhone}
                  onChange={handleChange}
                  error={errors.leaderPhone}
                  disabled={loading}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <FieldInput
                  id="team-reg-college"
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
            </div>

            {/* Additional Squad / Team Members Section */}
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem', borderTop: '1px solid rgba(244,234,204,0.1)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={16} />
                    Team Members ({members.length + 1} of {selectedEvent.max})
                  </h4>
                  <p style={{ fontSize: '0.74rem', color: 'rgba(244,234,204,0.5)', marginTop: '0.15rem' }}>
                    Leader is Member 1. Add remaining squad details:
                  </p>
                </div>

                {members.length < getMaxAdditional(selectedEvent) && (
                  <button
                    type="button"
                    id="add-team-member-btn"
                    onClick={handleAddMember}
                    disabled={loading}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.85rem',
                      background: 'rgba(211,47,47,0.15)',
                      border: '1px solid var(--color-neon-cyan)',
                      borderRadius: '4px',
                      color: 'var(--color-star-white)',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(211,47,47,0.3)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(211,47,47,0.15)'; }}
                  >
                    <Plus size={14} color="var(--color-neon-cyan)" />
                    Add Member
                  </button>
                )}
              </div>

              {errors.members && (
                <p style={{ color: 'var(--color-neon-cyan)', fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                  {errors.members}
                </p>
              )}

              {members.length === 0 ? (
                <div style={{ padding: '0.85rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(244,234,204,0.15)', borderRadius: '4px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(244,234,204,0.55)', margin: 0 }}>
                    Solo registration selected. Click "+ Add Member" above to add teammates (Max {selectedEvent.max} members).
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {members.map((member, idx) => {
                    const memberNum = idx + 2;
                    const isRequired = idx < minAdd;
                    const label = selectedEvent.memberLabel || 'Member';

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0.85rem',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(244,234,204,0.12)',
                          borderRadius: '4px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 'bold', letterSpacing: '0.08em', color: 'var(--color-star-white)', textTransform: 'uppercase' }}>
                            {label} {memberNum} {isRequired ? <span style={{ color: 'var(--color-neon-cyan)', fontSize: '0.68rem' }}>(Required)</span> : <span style={{ color: 'rgba(244,234,204,0.4)', fontSize: '0.68rem' }}>(Optional)</span>}
                          </span>

                          {!isRequired && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(idx)}
                              disabled={loading}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(244,234,204,0.5)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontSize: '0.72rem',
                                padding: '0.2rem',
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-neon-cyan)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(244,234,204,0.5)'; }}
                            >
                              <Trash2 size={13} />
                              Remove
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
                          <FieldInput
                            id={`member-${idx}-name`}
                            label="Full Name"
                            name={`member_${idx}_name`}
                            type="text"
                            placeholder={`${label} ${memberNum} name`}
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            error={errors[`member_${idx}_name`]}
                            disabled={loading}
                          />
                          <FieldInput
                            id={`member-${idx}-phone`}
                            label={selectedEvent.id === 'bgmi' || selectedEvent.id === 'free_fire' ? "In-Game ID / Phone" : "Phone / Contact"}
                            name={`member_${idx}_phone`}
                            type="tel"
                            placeholder={selectedEvent.id === 'bgmi' || selectedEvent.id === 'free_fire' ? "In-game ID or Phone" : "10-digit number"}
                            value={member.phone}
                            onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                            error={errors[`member_${idx}_phone`]}
                            disabled={loading}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: '800', color: 'var(--color-star-white)' }}>
                  ₹{selectedEvent?.fee || 0}
                </p>
              </div>

              <button
                id="team-pay-btn"
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
                  background: isFormComplete && !loading ? 'var(--color-star-white)' : 'rgba(255,255,255,0.05)',
                  border: '2px solid',
                  borderColor: isFormComplete && !loading ? 'var(--color-star-white)' : 'rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  cursor: isFormComplete && !loading ? 'pointer' : 'not-allowed',
                  boxShadow: isFormComplete && !loading ? '4px 4px 0px 0px rgba(244,234,204,0.5)' : 'none',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
                onMouseOver={(e) => {
                  if (isFormComplete && !loading) {
                    e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244,234,204,0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isFormComplete && !loading ? '4px 4px 0px 0px rgba(244,234,204,0.5)' : 'none';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedEvent?.fee || 0}`
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
const FieldInput = ({ id, label, name, type, placeholder, value, onChange, error, disabled, maxLength = 150 }) => (
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
      maxLength={maxLength}
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
      onFocus={(e) => { e.target.style.borderColor = 'var(--color-star-white)'; }}
      onBlur={(e) => { e.target.style.borderColor = error ? 'var(--color-neon-cyan)' : '#333'; }}
    />
    {error && (
      <p style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--color-neon-cyan)' }}>
        {error}
      </p>
    )}
  </div>
);

export default TeamRegModal;
