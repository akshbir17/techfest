import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';

const MANDATORY_FORM_URL =
  'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAWqllTJUMzFKNlY2MklYUEdZUUszT1pGR1lKWFhDMy4u';

const MandatoryFormBanner = ({ buttonId = 'mandatory-form-register-btn' }) => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'rgba(211, 47, 47, 0.08)',
        border: '1.5px solid rgba(211, 47, 47, 0.55)',
        borderRadius: '6px',
        padding: '1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.85rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(211, 47, 47, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Accent top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d32f2f, #f4eacc, #d32f2f, transparent)',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: '#f4eacc',
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(0.85rem, 2.8vw, 0.98rem)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)',
        }}
      >
        <AlertCircle size={18} color="#d32f2f" strokeWidth={2.5} style={{ flexShrink: 0 }} />
        <span>Filling out this form is mandatory</span>
      </div>

      <a
        id={buttonId}
        href={MANDATORY_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.65rem',
          padding: '0.95rem 2rem',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '1rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#080808',
          backgroundColor: '#d32f2f',
          border: '2px solid #d32f2f',
          borderRadius: '4px',
          cursor: 'pointer',
          textDecoration: 'none',
          boxShadow: '4px 4px 0px 0px rgba(244, 234, 204, 0.5)',
          transition: 'all 0.3s ease',
          boxSizing: 'border-box',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
          e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244, 234, 204, 0.7)';
          e.currentTarget.style.backgroundColor = '#b71c1c';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(244, 234, 204, 0.5)';
          e.currentTarget.style.backgroundColor = '#d32f2f';
        }}
      >
        <span>REGISTER</span>
        <ExternalLink size={18} color="#080808" strokeWidth={2.5} />
      </a>
    </div>
  );
};

export default MandatoryFormBanner;
