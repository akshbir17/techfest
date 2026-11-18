import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Search,
  CheckCircle2,
  AlertCircle,
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

    // Also check URL path, query, or hash
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        window.location.pathname === '/find-pass' ||
        searchParams.get('find_pass') === 'true' ||
        searchParams.get('find-pass') === 'true' ||
        window.location.hash === '#find-pass'
      ) {
        setInternalIsOpen(true);
      }
    }

    return () => {
      window.removeEventListener('open-find-pass', handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (controlledOnClose) {
          controlledOnClose();
        } else {
          setInternalIsOpen(false);
        }
        setErrorMsg('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, controlledOnClose]);

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
              backgroundColor: 'rgba(5, 5, 5, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Box — Ukiyo-e Cyber Red & Obsidian Black Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '550px',
              maxHeight: 'calc(100dvh - 2rem)',
              overflowY: 'auto',
              background: 'var(--color-space-black)',
              border: '1px solid var(--color-neon-cyan)',
              borderRadius: '4px',
              boxShadow: '6px 6px 0px 0px rgba(211, 47, 47, 0.85), 0 0 40px rgba(211, 47, 47, 0.18)',
              color: 'var(--color-star-white)',
              fontFamily: 'var(--font-primary)',
              zIndex: 1,
            }}
          >
            {/* Top Crimson-Cream Accent Bar */}
            <div
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, var(--color-neon-cyan), var(--color-star-white), transparent)',
                width: '100%',
              }}
            />

            {/* Inner subtle frame border like .glass-card */}
            <div
              style={{
                position: 'absolute',
                top: '7px',
                left: '5px',
                right: '5px',
                bottom: '5px',
                border: '1px solid rgba(244, 234, 204, 0.08)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ padding: 'clamp(1.4rem, 4vw, 2.2rem)', position: 'relative' }}>
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                style={{
                  position: 'absolute',
                  top: '1.15rem',
                  right: '1.15rem',
                  background: 'rgba(211, 47, 47, 0.08)',
                  border: '1px solid rgba(211, 47, 47, 0.45)',
                  borderRadius: '4px',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-star-white)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neon-cyan)';
                  e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
                  e.currentTarget.style.color = 'var(--color-space-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.45)';
                  e.currentTarget.style.color = 'var(--color-star-white)';
                }}
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.65rem', marginTop: '0.25rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.9rem',
                    background: 'rgba(211, 47, 47, 0.12)',
                    border: '1px solid rgba(211, 47, 47, 0.5)',
                    borderRadius: '4px',
                    color: 'var(--color-neon-cyan)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '0.9rem',
                  }}
                >
                  <Ticket size={14} /> Pass Retrieval Portal
                </div>

                <h2
                  id="find-pass-title"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.35rem, 3.2vw, 1.8rem)',
                    fontWeight: 900,
                    color: 'var(--color-star-white)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: '0 0 0.55rem 0',
                  }}
                >
                  FIND YOUR <span style={{ color: 'var(--color-neon-cyan)' }}>PASS</span>
                </h2>

                <div
                  style={{
                    height: '2px',
                    width: '4.5rem',
                    backgroundColor: 'var(--color-neon-cyan)',
                    margin: '0 auto 0.85rem auto',
                  }}
                />

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'rgba(244, 234, 204, 0.78)',
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  Enter your <strong style={{ color: 'var(--color-star-white)' }}>Team Leader Email</strong> or registered mobile number to retrieve and download your official entry pass.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} style={{ marginBottom: '1.35rem' }}>
                <label
                  htmlFor="find-pass-input"
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-heading)',
                    color: 'rgba(244, 234, 204, 0.7)',
                    marginBottom: '0.45rem',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Leader Email / Mobile Number
                </label>

                <div style={{ position: 'relative', marginBottom: '1.15rem' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '0.95rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--color-neon-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <Mail size={17} />
                  </div>
                  <input
                    id="find-pass-input"
                    type="text"
                    placeholder="e.g. leader@gmail.com or 9876543210"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem 0.85rem 2.75rem',
                      background: 'var(--color-deep-blue)',
                      border: '1px solid #333',
                      borderBottom: '2px solid var(--color-star-white)',
                      borderRadius: '4px',
                      color: 'var(--color-star-white)',
                      fontSize: '0.94rem',
                      fontFamily: 'var(--font-primary)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-neon-cyan)';
                      e.target.style.borderBottomColor = 'var(--color-neon-cyan)';
                      e.target.style.boxShadow = '0 0 12px rgba(211, 47, 47, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#333';
                      e.target.style.borderBottomColor = 'var(--color-star-white)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="neon-button"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.5rem',
                    fontSize: '0.92rem',
                    letterSpacing: '0.14em',
                    gap: '0.55rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.8 : 1,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Searching Records...
                    </>
                  ) : (
                    <>
                      <Search size={17} /> Retrieve Pass
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
                    border: '1px solid rgba(211, 47, 47, 0.5)',
                    borderLeft: '4px solid var(--color-neon-cyan)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    color: '#ff6b6b',
                    fontSize: '0.85rem',
                    lineHeight: 1.45,
                    marginBottom: '1.25rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-neon-cyan)' }} />
                  <div>{errorMsg}</div>
                </motion.div>
              )}

              {/* Results */}
              {results && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.74rem',
                      color: 'rgba(244, 234, 204, 0.65)',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                    }}
                  >
                    FOUND {results.length} REGISTRATION{results.length > 1 ? 'S' : ''}:
                  </div>

                  {results.map((item, idx) => {
                    const isPaid = item.paymentStatus === 'paid' && item.passUrl;

                    return (
                      <div
                        key={item.id || idx}
                        style={{
                          padding: '1.1rem',
                          background: 'var(--color-deep-blue)',
                          border: isPaid
                            ? '1px solid rgba(211, 47, 47, 0.5)'
                            : '1px solid rgba(245, 158, 11, 0.45)',
                          borderLeft: isPaid
                            ? '4px solid var(--color-neon-cyan)'
                            : '4px solid #F59E0B',
                          borderRadius: '4px',
                          boxShadow: '3px 3px 0px 0px rgba(211, 47, 47, 0.45)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  padding: '0.22rem 0.55rem',
                                  borderRadius: '4px',
                                  background: isPaid ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                                  color: isPaid ? '#34D399' : '#FBBF24',
                                  border: isPaid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.28rem',
                                }}
                              >
                                {isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                {isPaid ? 'Payment Verified' : 'Payment Pending'}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  fontFamily: 'var(--font-heading)',
                                  color: 'rgba(244, 234, 204, 0.6)',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {item.uniqueId}
                              </span>
                            </div>

                            <h3
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                color: 'var(--color-star-white)',
                                letterSpacing: '0.04em',
                                margin: '0 0 0.2rem 0',
                              }}
                            >
                              {item.teamName ? `${item.teamName}` : item.participantName}
                            </h3>

                            <div style={{ fontSize: '0.82rem', color: 'var(--color-neon-cyan)', fontWeight: 600 }}>
                              {item.eventName} {item.theme && `• ${item.theme}`}
                            </div>
                            {item.participantName && item.teamName && (
                              <div style={{ fontSize: '0.78rem', color: 'rgba(244, 234, 204, 0.65)', marginTop: '0.15rem' }}>
                                Lead: {item.participantName} ({item.college || 'GNDEC'})
                              </div>
                            )}
                          </div>
                        </div>

                        {isPaid ? (
                          <div style={{ display: 'flex', gap: '0.65rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              onClick={() => {
                                handleClose();
                                navigate(item.passUrl);
                              }}
                              style={{
                                flex: '1 1 200px',
                                padding: '0.75rem 1.1rem',
                                background: 'var(--color-star-white)',
                                border: '1px solid var(--color-star-white)',
                                borderRadius: '4px',
                                color: 'var(--color-space-black)',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                fontFamily: 'var(--font-heading)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.45rem',
                                boxShadow: '3px 3px 0px 0px rgba(211, 47, 47, 0.9)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                                e.currentTarget.style.boxShadow = '5px 5px 0px 0px rgba(211, 47, 47, 0.95)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '3px 3px 0px 0px rgba(211, 47, 47, 0.9)';
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
                                background: 'rgba(211, 47, 47, 0.1)',
                                border: '1px solid rgba(211, 47, 47, 0.5)',
                                borderRadius: '4px',
                                color: 'var(--color-star-white)',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                whiteSpace: 'nowrap',
                                transition: 'background 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(211, 47, 47, 0.25)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(211, 47, 47, 0.1)';
                              }}
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check size={15} color="#34D399" /> Copied!
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
                              color: '#FBBF24',
                              background: 'rgba(245, 158, 11, 0.08)',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: '4px',
                              lineHeight: 1.45,
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
                  marginTop: '1.65rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(244, 234, 204, 0.12)',
                  textAlign: 'center',
                  fontSize: '0.78rem',
                  color: 'rgba(244, 234, 204, 0.6)',
                }}
              >
                Need assistance? WhatsApp or call our registration coordinators at{' '}
                <a
                  href="https://wa.me/919481339488"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--color-neon-cyan)', textDecoration: 'underline', fontWeight: 600 }}
                >
                  +91 9481339488
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default FindPassModal;
