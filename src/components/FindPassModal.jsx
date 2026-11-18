import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  X,
  Loader2,
  Mail,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

const FindPassModal = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useScrollLock(isOpen);

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    setErrorMsg('');
  };

  useEffect(() => {
    const handleOpenEvent = (e) => {
      if (e?.detail?.query) {
        setInputVal(e.detail.query);
      }
      setInternalIsOpen(true);
    };

    window.addEventListener('open-find-pass', handleOpenEvent);

    // Also check URL query or hash
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('find_pass') === 'true' || searchParams.get('find-pass') === 'true' || window.location.hash === '#find-pass') {
        setInternalIsOpen(true);
      }
    }

    return () => {
      window.removeEventListener('open-find-pass', handleOpenEvent);
    };
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const clean = inputVal.trim();
    if (!clean || clean.length < 3) {
      setErrorMsg('Please enter a valid Team Leader email address or mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setResults(null);

    try {
      const res = await fetch('/api/retrieve-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: clean }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || data.error || 'No matching registration found.');
        setResults(null);
      } else {
        setResults(data.passes || []);
      }
    } catch (err) {
      console.error('Find pass error:', err);
      setErrorMsg('Failed to connect to the server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (passUrl, idx) => {
    const fullUrl = `${window.location.origin}${passUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    });
  };

  if (!isOpen && typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="find-pass-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 10, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(145deg, rgba(16, 20, 32, 0.96), rgba(8, 10, 18, 0.98))',
              border: '1px solid rgba(0, 243, 255, 0.35)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 243, 255, 0.15)',
              padding: 'clamp(1.5rem, 4vw, 2.25rem)',
              color: '#F4EACC',
              fontFamily: 'var(--font-body)',
              zIndex: 1,
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              aria-label="Close dialog"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.4)';
                e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem', marginTop: '0.25rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  background: 'rgba(0, 243, 255, 0.1)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  borderRadius: '30px',
                  color: 'var(--color-neon-cyan)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                }}
              >
                <Ticket size={14} /> Pass Retrieval Portal
              </div>
              <h2
                id="find-pass-title"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.35rem, 3.2vw, 1.75rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                  margin: '0 0 0.5rem 0',
                }}
              >
                FIND YOUR PASS
              </h2>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(244, 234, 204, 0.75)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Enter your <strong>Team Leader Email</strong> or registered mobile number to retrieve and download your official entry pass.
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-neon-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  placeholder="e.g. leader@gmail.com or 9876543210"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 2.85rem',
                    background: 'rgba(10, 14, 24, 0.85)',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-neon-cyan)';
                    e.target.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(0, 243, 255, 0.3)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.5rem',
                  background: 'linear-gradient(90deg, #00F3FF, #0088FF)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#05070D',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 18px rgba(0, 243, 255, 0.35)',
                  transition: 'opacity 0.2s, transform 0.15s',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Searching Records...
                  </>
                ) : (
                  <>
                    <Search size={18} /> Retrieve Pass
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(211, 47, 47, 0.12)',
                  border: '1px solid rgba(211, 47, 47, 0.4)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  color: '#FF6B6B',
                  fontSize: '0.86rem',
                  lineHeight: 1.45,
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>{errorMsg}</div>
              </motion.div>
            )}

            {/* Results */}
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ fontSize: '0.82rem', color: 'rgba(244, 234, 204, 0.65)', fontWeight: 600 }}>
                  FOUND {results.length} REGISTRATION{results.length > 1 ? 'S' : ''}:
                </div>

                {results.map((item, idx) => {
                  const isPaid = item.paymentStatus === 'paid' && item.passUrl;

                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        padding: '1.15rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: isPaid
                          ? '1px solid rgba(16, 185, 129, 0.4)'
                          : '1px solid rgba(245, 158, 11, 0.4)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '4px',
                                background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: isPaid ? '#10B981' : '#F59E0B',
                                border: isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                              }}
                            >
                              {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                              {isPaid ? 'Payment Verified' : 'Payment Pending'}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.5)' }}>
                              {item.uniqueId}
                            </span>
                          </div>

                          <h3
                            style={{
                              fontSize: '1.05rem',
                              fontWeight: 700,
                              color: '#FFFFFF',
                              margin: '0 0 0.15rem 0',
                            }}
                          >
                            {item.teamName ? `${item.teamName}` : item.participantName}
                          </h3>

                          <div style={{ fontSize: '0.82rem', color: 'var(--color-neon-cyan)' }}>
                            {item.eventName} {item.theme && `• ${item.theme}`}
                          </div>
                          {item.participantName && item.teamName && (
                            <div style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.65)' }}>
                              Lead: {item.participantName} ({item.college || 'GNDEC'})
                            </div>
                          )}
                        </div>
                      </div>

                      {isPaid ? (
                        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              handleClose();
                              navigate(item.passUrl);
                            }}
                            style={{
                              flex: '1 1 200px',
                              padding: '0.75rem 1.15rem',
                              background: 'linear-gradient(90deg, #10B981, #059669)',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              fontFamily: 'var(--font-heading)',
                              letterSpacing: '0.05em',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.45rem',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <ShieldCheck size={16} /> Open & Download Pass <ArrowRight size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.passUrl, idx)}
                            title="Copy link to clipboard"
                            style={{
                              padding: '0.75rem 0.95rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '8px',
                              color: '#FFFFFF',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check size={15} color="#10B981" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={15} /> Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#F59E0B',
                            background: 'rgba(245, 158, 11, 0.08)',
                            padding: '0.65rem 0.85rem',
                            borderRadius: '6px',
                            lineHeight: 1.4,
                          }}
                        >
                          Payment confirmation is pending. If money was debited from your bank, please wait a minute and search again, or contact the GNDEC Help Desk.
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Help desk note */}
            <div
              style={{
                marginTop: '1.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'rgba(244, 234, 204, 0.6)',
              }}
            >
              Need assistance? WhatsApp or call our registration coordinators at{' '}
              <a
                href="https://wa.me/919481339488"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--color-neon-cyan)', textDecoration: 'underline' }}
              >
                +91 9481339488
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FindPassModal;
