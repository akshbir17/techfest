import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Home,
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const RegistrationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id') || 'N/A';
  const paymentId = searchParams.get('payment_id') || 'N/A';
  const registrationId = searchParams.get('reg_id') || '';
  const rawEventName = searchParams.get('event') || 'Official Event';
  const participantName = searchParams.get('name') || '';
  const teamName = searchParams.get('team') || '';
  const amount = searchParams.get('amount') || '';

  const eventName = decodeURIComponent(rawEventName);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = (text, key) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate & Download Official PDF Pass
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Header Banner (Cyberpunk Black/Burgundy)
      doc.setFillColor(15, 10, 20);
      doc.rect(margin, 15, contentWidth, 38, 'F');

      // Top Red Accent Line
      doc.setDrawColor(211, 47, 47);
      doc.setLineWidth(1.5);
      doc.line(margin, 15, margin + contentWidth, 15);

      // Fest Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('SPECTRUM 1.0', margin + 8, 28);

      // Subtitle
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 240, 255);
      doc.text('NATIONAL LEVEL TECHNICAL & CULTURAL FESTIVAL', margin + 8, 35);

      doc.setFontSize(8.5);
      doc.setTextColor(220, 220, 225);
      doc.text('Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka', margin + 8, 41);
      doc.text('Dates: December 7 – 9, 2026', margin + 8, 47);

      // Verified Badge (Green Pill)
      doc.setFillColor(0, 200, 83);
      doc.roundedRect(pageWidth - margin - 48, 22, 40, 9, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('VERIFIED & PAID', pageWidth - margin - 45, 28);

      // Ticket Main Body Card
      doc.setFillColor(252, 252, 254);
      doc.setDrawColor(220, 225, 235);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, 58, contentWidth, 110, 3, 3, 'FD');

      // Event Banner Bar
      doc.setFillColor(242, 244, 248);
      doc.rect(margin + 1, 59, contentWidth - 2, 22, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(110, 115, 125);
      doc.text('OFFICIAL REGISTRATION PASS', margin + 8, 68);

      doc.setFontSize(14);
      doc.setTextColor(211, 47, 47);
      doc.text(eventName.toUpperCase(), margin + 8, 76);

      // Details Grid
      let y = 92;
      const leftColX = margin + 8;
      const rightColX = margin + 95;

      const addField = (label, value, x, currentY) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(115, 120, 130);
        doc.text(label.toUpperCase(), x, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(25, 25, 30);
        doc.text(String(value || 'N/A'), x, currentY + 6);
      };

      addField('Participant Name', participantName || 'Registered Participant', leftColX, y);
      addField('Event Category', teamName ? `Team (${teamName})` : 'Individual Entry', rightColX, y);

      y += 18;
      addField('Registration Fee', amount ? `INR ${amount}` : 'Paid', leftColX, y);
      addField('Event Dates', 'December 7 – 9, 2026', rightColX, y);

      y += 18;
      addField('Confirmation (Order) ID', orderId, leftColX, y);
      addField('Razorpay Payment ID', paymentId, rightColX, y);

      y += 18;
      if (registrationId) {
        addField('Database Registration ID', registrationId, leftColX, y);
      }
      addField('Reporting Venue', 'GNDEC Bidar Campus, Mailoor Rd', rightColX, y);

      // Perforated line
      doc.setDrawColor(180, 185, 195);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(margin + 5, 155, margin + contentWidth - 5, 155);
      doc.setLineDashPattern([], 0);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 125, 135);
      doc.text('* Present this pass (on phone or printout) at the Registration Desk along with your College ID.', margin + 8, 163);

      // Guidelines & Campus Info Box
      doc.setFillColor(246, 248, 252);
      doc.setDrawColor(210, 218, 230);
      doc.roundedRect(margin, 176, contentWidth, 54, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(18, 12, 24);
      doc.text('CAMPUS INSTRUCTIONS & HELP DESK', margin + 8, 186);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(60, 65, 75);
      doc.text('1. Entry Gate: GNDEC Bidar Main Gate (Reporting begins at 8:30 AM on Day 1).', margin + 8, 194);
      doc.text('2. ID Requirement: Valid College / Institution ID card is mandatory for campus entry.', margin + 8, 201);
      doc.text('3. Hackathon Participants: Meals and overnight accommodation provided on campus.', margin + 8, 208);
      doc.text('4. Queries / Assistance: Dr. Praveen Reddy: +91 99165 42332 | Sangmesh: +91 9353142522', margin + 8, 215);
      doc.text('5. Email Support: Spectrum101213@gmail.com | Official Portal: spectrum10.vercel.app', margin + 8, 222);

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 155, 165);
      doc.text(`Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST) • Spectrum 1.0`, margin, 242);

      doc.save(`Spectrum1.0_Pass_${orderId.slice(-8)}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(211, 47, 47, 0.12) 0%, rgba(0, 240, 255, 0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: '580px', position: 'relative', zIndex: 10 }}>
        
        {/* Animated Success Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '2px solid var(--color-neon-cyan, #00f0ff)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.25) 0%, rgba(0, 240, 255, 0.15) 100%)',
              border: '2px solid var(--color-neon-cyan, #00f0ff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)',
            }}
          >
            <CheckCircle size={38} color="var(--color-neon-cyan, #00f0ff)" strokeWidth={1.75} />
          </div>
        </motion.div>

        {/* Header Text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.1rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 0.5rem 0',
              color: 'var(--color-star-white, #fff)',
            }}
          >
            REGISTRATION <span style={{ color: 'var(--color-neon-cyan, #00f0ff)' }}>CONFIRMED!</span>
          </h1>
          <p
            style={{
              color: 'rgba(244, 234, 204, 0.75)',
              fontSize: '0.98rem',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            You are officially registered for{' '}
            <strong style={{ color: 'var(--color-star-white, #fff)', borderBottom: '1px solid var(--color-neon-cyan, #00f0ff)' }}>
              {eventName}
            </strong>
          </p>
        </motion.div>

        {/* Digital Event Pass Ticket Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            position: 'relative',
            background: 'linear-gradient(145deg, rgba(20, 12, 28, 0.95) 0%, rgba(10, 6, 16, 0.98) 100%)',
            border: '1px solid rgba(255, 42, 95, 0.35)',
            borderRadius: '16px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 42, 95, 0.15)',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
            marginBottom: '1.75rem',
            textAlign: 'left',
          }}
        >
          {/* Card Top Header */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--color-neon-cyan, #00f0ff)" />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  color: 'var(--color-neon-cyan, #00f0ff)',
                  textTransform: 'uppercase',
                }}
              >
                SPECTRUM 1.0 PASS
              </span>
            </div>

            {/* Paid Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid rgba(0, 230, 118, 0.4)',
                color: '#00e676',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#00e676',
                  boxShadow: '0 0 8px #00e676',
                }}
              />
              VERIFIED & PAID
            </div>
          </div>

          {/* Event Name & Hero Info */}
          <div style={{ padding: '1.5rem 1.75rem 1rem 1.75rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(244, 234, 204, 0.55)',
                fontWeight: 600,
              }}
            >
              Event
            </span>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--color-star-white, #fff)',
                margin: '0.2rem 0 1.25rem 0',
                letterSpacing: '0.04em',
              }}
            >
              {eventName}
            </h2>

            {/* Quick Meta Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Calendar size={16} color="var(--color-neon-cyan, #00f0ff)" />
                <span style={{ fontSize: '0.88rem', color: 'rgba(244, 234, 204, 0.85)' }}>
                  Dec 7 – 9, 2026
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="#ff2a5f" />
                <span style={{ fontSize: '0.88rem', color: 'rgba(244, 234, 204, 0.85)' }}>
                  GNDEC Bidar Campus
                </span>
              </div>
            </div>
          </div>

          {/* Perforated Ticket Divider with Notches */}
          <div style={{ position: 'relative', margin: '0.5rem 0' }}>
            <div
              style={{
                borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
                width: '100%',
              }}
            />
            {/* Left Notch */}
            <div
              style={{
                position: 'absolute',
                left: '-12px',
                top: '-12px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-space-black, #07040a)',
                borderRight: '1px solid rgba(255, 42, 95, 0.35)',
              }}
            />
            {/* Right Notch */}
            <div
              style={{
                position: 'absolute',
                right: '-12px',
                top: '-12px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--color-space-black, #07040a)',
                borderLeft: '1px solid rgba(255, 42, 95, 0.35)',
              }}
            />
          </div>

          {/* Credentials & Identification Block */}
          <div style={{ padding: '1.25rem 1.75rem 1.75rem 1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Order ID */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 234, 204, 0.6)', fontWeight: 600 }}>
                    Confirmation (Order) ID
                  </span>
                  <button
                    onClick={() => handleCopy(orderId, 'order')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedKey === 'order' ? '#00e676' : 'var(--color-neon-cyan, #00f0ff)',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: 0,
                    }}
                  >
                    {copiedKey === 'order' ? <Check size={12} /> : <Copy size={12} />}
                    {copiedKey === 'order' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.95rem',
                    color: 'var(--color-star-white, #fff)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    wordBreak: 'break-all',
                  }}
                >
                  {orderId}
                </div>
              </div>

              {/* Razorpay Payment ID */}
              {paymentId && paymentId !== 'N/A' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 234, 204, 0.6)', fontWeight: 600 }}>
                      Razorpay Payment ID
                    </span>
                    <button
                      onClick={() => handleCopy(paymentId, 'payment')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedKey === 'payment' ? '#00e676' : 'var(--color-neon-cyan, #00f0ff)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0,
                      }}
                    >
                      {copiedKey === 'payment' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === 'payment' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.92rem',
                      color: 'var(--color-star-white, #fff)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {paymentId}
                  </div>
                </div>
              )}

              {/* Database Registration ID (UUID) */}
              {registrationId && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(244, 234, 204, 0.6)', fontWeight: 600 }}>
                      Database Registration ID
                    </span>
                    <button
                      onClick={() => handleCopy(registrationId, 'reg')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedKey === 'reg' ? '#00e676' : 'var(--color-neon-cyan, #00f0ff)',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0,
                      }}
                    >
                      {copiedKey === 'reg' ? <Check size={12} /> : <Copy size={12} />}
                      {copiedKey === 'reg' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      color: 'rgba(244, 234, 204, 0.85)',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {registrationId}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons: Download PDF & Back Home */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}
        >
          {/* Primary CTA: Download PDF Pass */}
          <button
            id="download-pass-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1rem 1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.98rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: 'linear-gradient(135deg, #d32f2f 0%, #ff1744 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              cursor: isDownloading ? 'wait' : 'pointer',
              boxShadow: '0 6px 20px rgba(255, 23, 68, 0.35)',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 23, 68, 0.5)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 23, 68, 0.35)';
            }}
          >
            <Download size={19} />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Pass (PDF)'}</span>
          </button>

          {/* Secondary CTA: Back to Home */}
          <button
            id="back-to-home-btn"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              padding: '0.85rem 1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-star-white, #fff)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'var(--color-neon-cyan, #00f0ff)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Next Steps Instructions Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <Info size={15} color="var(--color-neon-cyan, #00f0ff)" />
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: 'var(--color-star-white, #fff)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              What to do next?
            </h4>
          </div>

          <ul
            style={{
              margin: 0,
              paddingLeft: '1.2rem',
              color: 'rgba(244, 234, 204, 0.72)',
              fontSize: '0.84rem',
              lineHeight: '1.6',
            }}
          >
            <li>Download and keep this <strong>Pass (PDF)</strong> ready on your mobile device.</li>
            <li>Carry your physical <strong>College / Institution ID card</strong> to GNDEC Bidar on fest day.</li>
            <li>Present this pass at the <strong>Main Registration Desk</strong> on arrival to receive your badge.</li>
          </ul>
        </motion.div>

        {/* Festive Footer Sign-off */}
        <p
          style={{
            marginTop: '1.75rem',
            fontSize: '0.75rem',
            color: 'rgba(244, 234, 204, 0.35)',
            letterSpacing: '0.08em',
            textAlign: 'center',
          }}
        >
          SPECTRUM 1.0 • DECEMBER 7–9, 2026 • GNDEC BIDAR
        </p>
      </div>
    </main>
  );
};

export default RegistrationSuccessPage;
