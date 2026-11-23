import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { FEST_SHARE_CONFIG } from '../utils/share';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
  </svg>
);

const TelegramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z" />
  </svg>
);

const ShareModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareData, setShareData] = useState(FEST_SHARE_CONFIG);
  const [copied, setCopied] = useState(false);

  useScrollLock(isOpen);

  useEffect(() => {
    const handleOpen = (e) => {
      if (e?.detail) {
        setShareData((prev) => ({ ...prev, ...e.detail }));
      }
      setCopied(false);
      setIsOpen(true);
    };

    window.addEventListener('open-share-modal', handleOpen);
    return () => window.removeEventListener('open-share-modal', handleOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCopyLink = () => {
    const targetUrl = shareData.url || (typeof window !== 'undefined' ? window.location.origin : FEST_SHARE_CONFIG.url);
    navigator.clipboard.writeText(targetUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const shareUrl = encodeURIComponent(shareData.url || 'https://spectrum10.vercel.app');
  const shareText = encodeURIComponent(`${shareData.text} ${shareData.url || 'https://spectrum10.vercel.app'}`);

  const channels = [
    {
      name: 'WhatsApp',
      icon: <WhatsAppIcon />,
      color: '#25D366',
      bg: 'rgba(37, 211, 102, 0.12)',
      border: 'rgba(37, 211, 102, 0.45)',
      href: `https://api.whatsapp.com/send?text=${shareText}`,
    },
    {
      name: 'Telegram',
      icon: <TelegramIcon />,
      color: '#229ED9',
      bg: 'rgba(34, 158, 217, 0.12)',
      border: 'rgba(34, 158, 217, 0.45)',
      href: `https://t.me/share/url?url=${shareUrl}&text=${encodeURIComponent(shareData.text)}`,
    },
    {
      name: 'X (Twitter)',
      icon: <TwitterIcon />,
      color: '#F4EACC',
      bg: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(244, 234, 204, 0.35)',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${shareUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <LinkedInIcon />,
      color: '#0077B5',
      bg: 'rgba(0, 119, 181, 0.12)',
      border: 'rgba(0, 119, 181, 0.45)',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    },
  ];

  if (!isOpen && typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
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
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 5, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              background: 'var(--color-space-black)',
              border: '1px solid var(--color-neon-cyan)',
              borderRadius: '4px',
              boxShadow: '6px 6px 0px 0px rgba(211, 47, 47, 0.85), 0 0 35px rgba(211, 47, 47, 0.2)',
              color: 'var(--color-star-white)',
              fontFamily: 'var(--font-primary)',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            {/* Top Accent Bar */}
            <div
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, var(--color-neon-cyan), var(--color-star-white), transparent)',
                width: '100%',
              }}
            />

            <div style={{ padding: 'clamp(1.25rem, 3.8vw, 1.9rem)', position: 'relative' }}>
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close dialog"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(211, 47, 47, 0.08)',
                  border: '1px solid rgba(211, 47, 47, 0.45)',
                  borderRadius: '4px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-star-white)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-neon-cyan)';
                  e.currentTarget.style.color = 'var(--color-space-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.08)';
                  e.currentTarget.style.color = 'var(--color-star-white)';
                }}
              >
                <X size={17} />
              </button>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.45rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.3rem 0.85rem',
                    background: 'rgba(211, 47, 47, 0.12)',
                    border: '1px solid rgba(211, 47, 47, 0.5)',
                    borderRadius: '4px',
                    color: 'var(--color-neon-cyan)',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  <Share2 size={13} /> SPREAD THE WORD
                </div>

                <h2
                  id="share-modal-title"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
                    fontWeight: 900,
                    color: 'var(--color-star-white)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: '0 0 0.45rem 0',
                  }}
                >
                  SHARE <span style={{ color: 'var(--color-neon-cyan)' }}>SPECTRUM 1.0</span>
                </h2>

                <div
                  style={{
                    height: '2px',
                    width: '3.5rem',
                    backgroundColor: 'var(--color-neon-cyan)',
                    margin: '0 auto 0.75rem auto',
                  }}
                />

                <p
                  style={{
                    fontSize: '0.84rem',
                    color: 'rgba(244, 234, 204, 0.75)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  Invite your friends, teammates & college groups to GNDEC's premier national fest!
                </p>
              </div>

              {/* Social Channels Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1.35rem',
                }}
              >
                {channels.map((ch) => (
                  <a
                    key={ch.name}
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.75rem 0.95rem',
                      background: ch.bg,
                      border: `1px solid ${ch.border}`,
                      borderRadius: '4px',
                      color: ch.color,
                      textDecoration: 'none',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      transition: 'all 0.2s ease',
                      boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.6)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)';
                      e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${ch.color}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '2px 2px 0px 0px rgba(0, 0, 0, 0.6)';
                    }}
                  >
                    {ch.icon}
                    <span>{ch.name}</span>
                    <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                  </a>
                ))}
              </div>

              {/* Copy Direct Link Section */}
              <div
                style={{
                  background: 'var(--color-deep-blue)',
                  border: '1px solid rgba(244, 234, 204, 0.15)',
                  borderRadius: '4px',
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={shareData.url || 'https://spectrum10.vercel.app'}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-star-white)',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    userSelect: 'all',
                  }}
                  onFocus={(e) => e.target.select()}
                />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    background: copied ? 'rgba(52, 211, 153, 0.18)' : 'var(--color-star-white)',
                    color: copied ? '#34D399' : 'var(--color-space-black)',
                    border: copied ? '1px solid #34D399' : '1px solid var(--color-star-white)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: '2px 2px 0px 0px rgba(211, 47, 47, 0.75)',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Link
                    </>
                  )}
                </button>
              </div>

              {/* Native Device Share (when supported) */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <div style={{ marginTop: '0.9rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.share({
                        title: shareData.title,
                        text: shareData.text,
                        url: shareData.url || 'https://spectrum10.vercel.app',
                      }).catch(() => {});
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-neon-cyan)',
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.06em',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: '0.3rem',
                    }}
                  >
                    Open Device Share Menu (Instagram, Bluetooth, More)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ShareModal;
