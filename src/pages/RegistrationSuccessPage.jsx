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

  // ═══════════════════════════════════════════════════════════════════════
  // REDESIGNED PDF PASS — Clean, Light, Professional Design
  // Gradient header · Ticket-style participant card · Numbered instructions
  // Coordinator grid · Light backgrounds · Modern typography
  // ═══════════════════════════════════════════════════════════════════════
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = 210;
      const ph = 297;
      const m = 14;
      const cw = pw - m * 2; // 182mm

      // 1. PAGE BACKGROUND
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pw, ph, 'F');

      // 2. FULL-BLEED GRADIENT HEADER (from x=0 to pw, y=0 to 70)
      const hdrH = 70;
      const steps = 60;
      const c1 = [67, 56, 202];   // Indigo
      const c2 = [124, 58, 237];  // Violet
      const c3 = [219, 39, 119];  // Pink
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        let r, g, b;
        if (t < 0.5) {
          const f = t / 0.5;
          r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
          g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
          b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
        } else {
          const f = (t - 0.5) / 0.5;
          r = Math.round(c2[0] + (c3[0] - c2[0]) * f);
          g = Math.round(c2[1] + (c3[1] - c2[1]) * f);
          b = Math.round(c2[2] + (c3[2] - c2[2]) * f);
        }
        doc.setFillColor(r, g, b);
        const sx = (i * pw) / steps;
        const sw = pw / steps + 0.5;
        doc.rect(sx, 0, sw, hdrH, 'F');
      }

      // Header Typography
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.text('SPECTRUM 1.0', m, 26);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(252, 231, 243);
      doc.text('THE AWAKENING  |  NATIONAL LEVEL TECHNICAL FESTIVAL', m, 33);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(253, 242, 248);
      doc.text('Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka', m, 40);

      // Pills in Header
      // Left: Date Pill (Yellow)
      doc.setFillColor(251, 191, 36);
      doc.roundedRect(m, 46, 50, 9, 4.5, 4.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text('DEC 7 - 9, 2026', m + 11, 52);

      // Right: Official Pass Pill (White)
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(m + 54, 46, 36, 9, 4.5, 4.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(67, 56, 202);
      doc.text('OFFICIAL PASS', m + 60, 52);

      // 3. PARTICIPANT CARD (floating over header bottom)
      const cardY = 60;
      const cardH = 50;

      // White Card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.roundedRect(m, cardY, cw, cardH, 5, 5, 'FD');

      // Left Indigo Edge
      doc.setFillColor(67, 56, 202);
      doc.roundedRect(m, cardY, 3, cardH, 3, 0, 'F');
      doc.rect(m + 1.5, cardY, 1.5, cardH, 'F');

      // Participant Pass Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(219, 39, 119); // Pink
      doc.text('PARTICIPANT PASS', m + 8, cardY + 9);

      // Big Participant Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      const nameText = participantName || 'Registered Participant';
      let displayName = nameText;
      const maxNameWidth = cw - 75;
      if (doc.getTextWidth(displayName) > maxNameWidth) {
        while (doc.getTextWidth(displayName + '...') > maxNameWidth && displayName.length > 0) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }
      doc.text(displayName, m + 8, cardY + 20);

      // Pills under name
      const entryText = teamName ? `TEAM: ${teamName.toUpperCase()}` : 'SOLO COMPETITOR';
      doc.setFillColor(13, 148, 136); // Teal
      doc.roundedRect(m + 8, cardY + 24, doc.getTextWidth(entryText) * 0.53 + 12, 6.5, 3.2, 3.2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(entryText, m + 14, cardY + 28.5);

      doc.setFillColor(16, 185, 129); // Green
      doc.roundedRect(m + 8, cardY + 33, 76, 7, 3.5, 3.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('100% VERIFIED & CONFIRMED', m + 20, cardY + 38);

      // Right Side: Fee Box
      const feeW = 58;
      const feeX = m + cw - feeW - 5;
      const feeY = cardY + 5;
      const feeH = cardH - 10;

      doc.setFillColor(255, 253, 240); // Pale yellow
      doc.setDrawColor(254, 240, 138); // Soft yellow border
      doc.setLineWidth(0.4);
      doc.roundedRect(feeX, feeY, feeW, feeH, 4, 4, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(180, 83, 9);
      doc.text('REGISTRATION FEE', feeX + 6, feeY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(225, 29, 72); // Pink/Red
      doc.text(`INR ${amount || '0'}/-`, feeX + 6, feeY + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(75, 85, 99);
      const evLines = doc.splitTextToSize(eventName, feeW - 12);
      doc.text(evLines, feeX + 6, feeY + 25);
      doc.setFontSize(7.5);
      doc.setTextColor(107, 114, 128);
      doc.text('1 payment test', feeX + 6, feeY + 31);

      // 4. REGISTRATION DETAILS SECTION
      let y = cardY + cardH + 10;

      // Header pill & text
      doc.setFillColor(67, 56, 202);
      doc.roundedRect(m, y - 3, 5, 5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(67, 56, 202);
      doc.text('REGISTRATION DETAILS', m + 8, y + 1);
      y += 6;

      const halfW = (cw - 4) / 2;

      // Card 1: Order ID (Light lavender)
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(224, 231, 255);
      doc.setLineWidth(0.3);
      doc.roundedRect(m, y, halfW, 16, 3, 3, 'FD');
      doc.setFillColor(79, 70, 229);
      doc.rect(m, y + 1.5, 2.5, 13, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(67, 56, 202);
      doc.text('CONFIRMATION (ORDER) ID', m + 6, y + 5.5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(orderId, m + 6, y + 11.5);

      // Card 2: Razorpay Payment ID (Light teal)
      const rightX = m + halfW + 4;
      doc.setFillColor(240, 253, 250);
      doc.setDrawColor(204, 251, 241);
      doc.setLineWidth(0.3);
      doc.roundedRect(rightX, y, halfW, 16, 3, 3, 'FD');
      doc.setFillColor(13, 148, 136);
      doc.rect(rightX, y + 1.5, 2.5, 13, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(13, 148, 136);
      doc.text('RAZORPAY PAYMENT ID', rightX + 6, y + 5.5);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(paymentId || 'N/A', rightX + 6, y + 11.5);

      y += 20;

      // Card 3: Database Registration ID (Light pink)
      if (registrationId) {
        doc.setFillColor(253, 242, 248);
        doc.setDrawColor(252, 231, 243);
        doc.setLineWidth(0.3);
        doc.roundedRect(m, y, cw, 16, 3, 3, 'FD');
        doc.setFillColor(219, 39, 119);
        doc.rect(m, y + 1.5, 2.5, 13, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(219, 39, 119);
        doc.text('DATABASE REGISTRATION ID (UUID)', m + 6, y + 5.5);

        doc.setFont('courier', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(registrationId, m + 6, y + 11.5);

        y += 20;
      }

      // 5. CAMPUS INSTRUCTIONS SECTION
      doc.setFillColor(249, 115, 22);
      doc.roundedRect(m, y - 3, 5, 5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(234, 88, 12);
      doc.text('CAMPUS INSTRUCTIONS', m + 8, y + 1);
      y += 6;

      const instructions = [
        {
          num: '1',
          circleColor: [67, 56, 202],
          bgColor: [238, 242, 255],
          borderColor: [224, 231, 255],
          title: 'Entry Gate',
          desc: 'GNDEC Bidar Main Gate. Reporting begins at 8:30 AM on Day 1.',
        },
        {
          num: '2',
          circleColor: [13, 148, 136],
          bgColor: [240, 253, 250],
          borderColor: [204, 251, 241],
          title: 'ID Mandatory',
          desc: 'Carry a valid college or institution ID card along with this pass.',
        },
        {
          num: '3',
          circleColor: [249, 115, 22],
          bgColor: [255, 247, 237],
          borderColor: [254, 215, 170],
          title: 'Hackathon Teams',
          desc: 'College lunch, dinner, breakfast and overnight accommodation provided.',
        },
      ];

      instructions.forEach((inst) => {
        doc.setFillColor(...inst.bgColor);
        doc.setDrawColor(...inst.borderColor);
        doc.setLineWidth(0.3);
        doc.roundedRect(m, y, cw, 14, 3, 3, 'FD');

        doc.setFillColor(...inst.circleColor);
        doc.circle(m + 7, y + 7, 3.8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(inst.num, m + 5.8, y + 9.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 24, 39);
        doc.text(inst.title, m + 14, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(inst.desc, m + 14, y + 10.5);

        y += 17;
      });

      y += 2;

      // 6. OFFICIAL EVENT COORDINATORS SECTION
      doc.setFillColor(124, 58, 237);
      doc.roundedRect(m, y - 3, 5, 5, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(124, 58, 237);
      doc.text('OFFICIAL EVENT COORDINATORS', m + 8, y + 1);
      y += 6;

      const coordinators = [
        { role: 'STUDENT COORDINATOR', name: 'Armaandeep Singh', phone: '+91 8427027540', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
        { role: 'STUDENT COORDINATOR', name: 'Sangmesh', phone: '+91 9353142522', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
        { role: 'STUDENT COORDINATOR', name: 'Abdul Aziz', phone: '+91 8296683831', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
        { role: 'FACULTY COORDINATOR', name: 'Dr. Praveen Reddy', phone: '+91 99165 42332', border: [219, 39, 119], bg: [253, 242, 248], roleColor: [219, 39, 119] },
      ];

      const coordW = (cw - 4) / 2;
      const coordH = 15;

      coordinators.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = m + col * (coordW + 4);
        const cy = y + row * (coordH + 4);

        doc.setFillColor(...c.bg);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.roundedRect(cx, cy, coordW, coordH, 3, 3, 'FD');

        doc.setFillColor(...c.border);
        doc.rect(cx, cy + 1.5, 2.5, coordH - 3, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(...c.roleColor);
        doc.text(c.role, cx + 6, cy + 5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 24, 39);
        doc.text(c.name, cx + 6, cy + 11);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.text(c.phone, cx + coordW - 4, cy + 11, { align: 'right' });
      });

      // 7. FULL-WIDTH FOOTER
      const footH = 20;
      const footY = ph - footH;

      doc.setFillColor(15, 23, 42); // Deep slate/indigo
      doc.rect(0, footY, pw, footH, 'F');

      doc.setFillColor(67, 56, 202);
      doc.rect(0, footY, pw, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(52, 211, 153); // Mint
      doc.text('NEED HELP?', m, footY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Spectrum101213@gmail.com', m, footY + 10.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text('SPECTRUM 1.0  |  DECEMBER 7-9, 2026  |  GNDEC BIDAR', m, footY + 15.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('spectrum10.vercel.app', pw - m, footY + 10.5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      doc.text(`Generated ${nowStr} (IST)  |  System Authorized Pass`, pw - m, footY + 15.5, { align: 'right' });

      doc.save(`Spectrum1.0_Pass_${orderId.slice(-8)}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // ON-SCREEN UI — Clean Light-Themed Success Page
  // Matches the new PDF and email aesthetic
  // ═══════════════════════════════════════════════════════════════════════

  // Color palette
  const colors = {
    indigo: '#4338CA',
    violet: '#7C3AED',
    pink: '#DB2777',
    teal: '#0D9488',
    emerald: '#10B981',
    amber: '#F59E0B',
    orange: '#F97316',
    red: '#EF4444',
    slate900: '#0F172A',
    slate700: '#334155',
    slate500: '#64748B',
    slate200: '#E2E8F0',
    white: '#FFFFFF',
    bgLight: '#EEF2F7',
    cardBg: '#FFFFFF',
  };

  const CopyBtn = ({ text, id }) => (
    <button
      onClick={() => handleCopy(text, id)}
      style={{
        background: 'transparent',
        border: 'none',
        color: copiedKey === id ? colors.emerald : colors.indigo,
        cursor: 'pointer',
        fontSize: '0.72rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: 0,
        fontWeight: 600,
      }}
    >
      {copiedKey === id ? <Check size={12} /> : <Copy size={12} />}
      {copiedKey === id ? 'Copied' : 'Copy'}
    </button>
  );

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        background: `linear-gradient(135deg, ${colors.bgLight} 0%, #f0eef5 100%)`,
      }}
    >
      <div style={{ width: '100%', maxWidth: '580px', position: 'relative', zIndex: 10 }}>

        {/* ──── Animated Success Badge ──── */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', position: 'relative' }}
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: '86px',
              height: '86px',
              borderRadius: '50%',
              border: `2px solid ${colors.emerald}`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, rgba(67, 56, 202, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)`,
              border: `2px solid ${colors.emerald}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px rgba(16, 185, 129, 0.3)`,
            }}
          >
            <CheckCircle size={36} color={colors.emerald} strokeWidth={1.75} />
          </div>
        </motion.div>

        {/* ──── Header Text ──── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading, Inter, sans-serif)',
              fontSize: '1.9rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              margin: '0 0 0.4rem 0',
              color: colors.slate900,
            }}
          >
            You're registered! <span style={{ color: colors.emerald }}>✓</span>
          </h1>
          <p
            style={{
              color: colors.slate500,
              fontSize: '0.95rem',
              lineHeight: '1.5',
              margin: 0,
            }}
          >
            Your spot at{' '}
            <strong style={{ color: colors.indigo }}>Spectrum 1.0</strong> for{' '}
            <strong style={{ color: colors.slate900 }}>{eventName}</strong> is confirmed.
          </p>
        </motion.div>

        {/* ──── Main Ticket Card ──── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            background: colors.cardBg,
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            marginBottom: '1.5rem',
            border: `1px solid ${colors.slate200}`,
          }}
        >
          {/* Gradient header stripe */}
          <div
            style={{
              height: '5px',
              background: `linear-gradient(90deg, ${colors.indigo}, ${colors.violet}, ${colors.pink})`,
            }}
          />

          {/* Card top row */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: `1px solid ${colors.slate200}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShieldCheck size={17} color={colors.indigo} />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  color: colors.indigo,
                  textTransform: 'uppercase',
                }}
              >
                Spectrum 1.0 Pass
              </span>
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: '#D1FAE5',
                color: '#047857',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#047857' }} />
              Payment verified
            </div>
          </div>

          {/* Event info */}
          <div style={{ padding: '1.25rem 1.5rem 0.75rem 1.5rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: colors.slate500,
                fontWeight: 600,
              }}
            >
              Registered event
            </span>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: colors.slate900,
                margin: '0.15rem 0 0.85rem 0',
              }}
            >
              {eventName}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={15} color={colors.indigo} />
                <span style={{ fontSize: '0.85rem', color: colors.slate700 }}>Dec 7 – 9, 2026</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={15} color={colors.pink} />
                <span style={{ fontSize: '0.85rem', color: colors.slate700 }}>GNDEC Bidar Campus</span>
              </div>
            </div>
          </div>

          {/* Perforated Divider with notches */}
          <div style={{ position: 'relative', margin: '0.65rem 0' }}>
            <div style={{ borderBottom: `2px dashed ${colors.slate200}`, width: '100%' }} />
            <div
              style={{
                position: 'absolute', left: '-12px', top: '-12px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: colors.bgLight,
                borderRight: `1px solid ${colors.slate200}`,
              }}
            />
            <div
              style={{
                position: 'absolute', right: '-12px', top: '-12px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: colors.bgLight,
                borderLeft: `1px solid ${colors.slate200}`,
              }}
            />
          </div>

          {/* Credentials Block */}
          <div style={{ padding: '1rem 1.5rem 1.5rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

              {/* Order ID */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.slate500, fontWeight: 600 }}>
                    Confirmation (Order) ID
                  </span>
                  <CopyBtn text={orderId} id="order" />
                </div>
                <div
                  style={{
                    fontFamily: 'Consolas, monospace',
                    fontSize: '0.92rem',
                    color: '#B45309',
                    background: '#FFFBEB',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #FDE68A',
                    borderLeft: `4px solid ${colors.amber}`,
                    wordBreak: 'break-all',
                    fontWeight: 600,
                  }}
                >
                  {orderId}
                </div>
              </div>

              {/* Payment ID */}
              {paymentId && paymentId !== 'N/A' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.slate500, fontWeight: 600 }}>
                      Razorpay Payment ID
                    </span>
                    <CopyBtn text={paymentId} id="payment" />
                  </div>
                  <div
                    style={{
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.9rem',
                      color: '#BE185D',
                      background: '#FDF2F8',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #FBCFE8',
                      borderLeft: `4px solid ${colors.pink}`,
                      wordBreak: 'break-all',
                      fontWeight: 600,
                    }}
                  >
                    {paymentId}
                  </div>
                </div>
              )}

              {/* Database Reg ID */}
              {registrationId && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: colors.slate500, fontWeight: 600 }}>
                      Database Registration ID
                    </span>
                    <CopyBtn text={registrationId} id="reg" />
                  </div>
                  <div
                    style={{
                      fontFamily: 'Consolas, monospace',
                      fontSize: '0.82rem',
                      color: '#0F766E',
                      background: '#F0FDFA',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #99F6E4',
                      borderLeft: `4px solid ${colors.teal}`,
                      wordBreak: 'break-all',
                      fontWeight: 600,
                    }}
                  >
                    {registrationId}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ──── Action Buttons ──── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}
        >
          <button
            id="download-pass-pdf-btn"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.9rem 1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              background: `linear-gradient(90deg, ${colors.indigo}, ${colors.pink})`,
              border: 'none',
              borderRadius: '12px',
              cursor: isDownloading ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(67, 56, 202, 0.3)',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(67, 56, 202, 0.45)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(67, 56, 202, 0.3)';
            }}
          >
            <Download size={18} />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Pass (PDF)'}</span>
          </button>

          <button
            id="back-to-home-btn"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.8rem 1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: colors.slate700,
              background: colors.white,
              border: `1px solid ${colors.slate200}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = colors.indigo;
              e.currentTarget.style.color = colors.indigo;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = colors.slate200;
              e.currentTarget.style.color = colors.slate700;
            }}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* ──── What to do next ──── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          style={{
            background: colors.white,
            border: `1px solid ${colors.slate200}`,
            borderRadius: '12px',
            padding: '1.15rem',
            textAlign: 'left',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
            <Info size={15} color={colors.indigo} />
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: colors.slate900,
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
              paddingLeft: '1.1rem',
              color: colors.slate500,
              fontSize: '0.82rem',
              lineHeight: '1.6',
            }}
          >
            <li>Download and keep this <strong style={{ color: colors.slate900 }}>Pass (PDF)</strong> ready on your mobile device.</li>
            <li>Carry your physical <strong style={{ color: colors.slate900 }}>College / Institution ID card</strong> to GNDEC Bidar on fest day.</li>
            <li>Present this pass at the <strong style={{ color: colors.slate900 }}>Main Registration Desk</strong> on arrival to receive your badge.</li>
          </ul>
        </motion.div>

        {/* Footer */}
        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.72rem',
            color: colors.slate500,
            letterSpacing: '0.06em',
            textAlign: 'center',
          }}
        >
          SPECTRUM 1.0 · DECEMBER 7–9, 2026 · GNDEC BIDAR
        </p>
      </div>
    </main>
  );
};

export default RegistrationSuccessPage;
