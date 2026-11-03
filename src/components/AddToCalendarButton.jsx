import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, ExternalLink, Check, ChevronDown, Bell } from 'lucide-react';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

const AddToCalendarButton = ({ event, variant = 'compact', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGoogleCalendar = (e) => {
    e.stopPropagation();
    const url = createGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleIcsDownload = (e) => {
    e.stopPropagation();
    downloadIcsFile(event);
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      setIsOpen(false);
    }, 1200);
  };

  const isModalVariant = variant === 'modal';

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      style={{ position: 'relative', display: 'inline-block', width: isModalVariant ? 'auto' : '100%' }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen)}
        }
        aria-label="Add to Calendar"
        aria-expanded={isOpen}
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          padding: isModalVariant ? '0.75rem 1.25rem' : '0.65rem 1rem',
          fontSize: isModalVariant ? '0.85rem' : '0.82rem',
          fontWeight: '700',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--color-star-white)',
          backgroundColor: isOpen ? 'rgba(211, 47, 47, 0.2)' : 'rgba(8, 8, 8, 0.6)',
          border: '1px solid rgba(211, 47, 47, 0.45)',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
          e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.18)';
        }}
        onMouseOut={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = 'rgba(211, 47, 47, 0.45)';
            e.currentTarget.style.backgroundColor = 'rgba(8, 8, 8, 0.6)';
          }
        }}
      >
        <Calendar size={15} color="var(--color-neon-cyan)" />
        <span>Add to Calendar</span>
        <ChevronDown
          size={14}
          style={{
            transition: 'transform 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.75,
          }}
        />
      </button>

      {/* Floating Popover Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: isModalVariant ? 'auto' : 'calc(100% + 6px)',
            top: isModalVariant ? 'calc(100% + 6px)' : 'auto',
            left: 0,
            right: 0,
            minWidth: '240px',
            backgroundColor: '#0d0d0d',
            border: '1px solid var(--color-neon-cyan)',
            borderRadius: '6px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.95), 0 0 15px rgba(211, 47, 47, 0.25)',
            padding: '0.5rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Tagline */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.5rem 0.4rem',
              borderBottom: '1px solid rgba(244, 234, 204, 0.1)',
              fontSize: '0.7rem',
              color: 'rgba(244, 234, 204, 0.7)',
              letterSpacing: '0.04em',
            }}
          >
            <Bell size={12} color="var(--color-neon-cyan)" />
            <span>IST Time & 1-Hr / 24-Hr Reminders</span>
          </div>

          {/* Option 1: Google Calendar */}
          <button
            type="button"
            onClick={handleGoogleCalendar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              backgroundColor: 'rgba(244, 234, 204, 0.03)',
              border: '1px solid rgba(244, 234, 204, 0.12)',
              borderRadius: '4px',
              color: 'var(--color-star-white)',
              fontSize: '0.82rem',
              fontWeight: '600',
              fontFamily: 'var(--font-primary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.2)';
              e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(244, 234, 204, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.12)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>📅</span>
              <div>
                <div style={{ fontWeight: '700', color: 'var(--color-star-white)' }}>Google Calendar</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(244, 234, 204, 0.6)' }}>One-click direct browser sync</div>
              </div>
            </div>
            <ExternalLink size={14} color="var(--color-neon-cyan)" />
          </button>

          {/* Option 2: Apple / Outlook (.ics) */}
          <button
            type="button"
            onClick={handleIcsDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.75rem',
              backgroundColor: downloadSuccess ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 234, 204, 0.03)',
              border: downloadSuccess ? '1px solid #4caf50' : '1px solid rgba(244, 234, 204, 0.12)',
              borderRadius: '4px',
              color: downloadSuccess ? '#81c784' : 'var(--color-star-white)',
              fontSize: '0.82rem',
              fontWeight: '600',
              fontFamily: 'var(--font-primary)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!downloadSuccess) {
                e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.2)';
                e.currentTarget.style.borderColor = 'var(--color-neon-cyan)';
              }
            }}
            onMouseOut={(e) => {
              if (!downloadSuccess) {
                e.currentTarget.style.backgroundColor = 'rgba(244, 234, 204, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.12)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🍏</span>
              <div>
                <div style={{ fontWeight: '700', color: downloadSuccess ? '#81c784' : 'var(--color-star-white)' }}>
                  {downloadSuccess ? 'Downloaded .ics!' : 'Apple / Outlook (.ics)'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(244, 234, 204, 0.6)' }}>Native calendar file with alarms</div>
              </div>
            </div>
            {downloadSuccess ? (
              <Check size={14} color="#81c784" />
            ) : (
              <Download size={14} color="var(--color-neon-cyan)" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddToCalendarButton;
