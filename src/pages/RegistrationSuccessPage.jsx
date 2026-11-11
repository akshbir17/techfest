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
  const theme = searchParams.get('theme') || '';

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
        { role: 'FACULTY COORDINATOR', name: 'Dr. Praveen Reddy', phone: '+91 99165 42332', border: [219, 39, 119], bg: [253, 242, 248], roleColor: [219, 39, 119] },
        { role: 'CONVENER (IIC)', name: 'Prof. Channa Reddy', phone: '+91 861 881 3191', border: [219, 39, 119], bg: [253, 242, 248], roleColor: [219, 39, 119] },
        { role: 'CEO (INCUBATION CTR)', name: 'Prof. Rakesh Marturkar', phone: '+91 99024 24263', border: [219, 39, 119], bg: [253, 242, 248], roleColor: [219, 39, 119] },
        { role: 'STUDENT COORDINATOR', name: 'Armaandeep Singh', phone: '+91 8427027540', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
        { role: 'STUDENT COORDINATOR', name: 'Sangmesh', phone: '+91 9353142522', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
        { role: 'STUDENT COORDINATOR', name: 'Abdul Aziz', phone: '+91 8296683831', border: [13, 148, 136], bg: [240, 253, 250], roleColor: [13, 148, 136] },
      ];

      const coordW = (cw - 4) / 2;
      const coordH = 13;

      coordinators.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = m + col * (coordW + 4);
        const cy = y + row * (coordH + 3);

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
          background: 'radial-gradient(circle, rgba(211, 47, 47, 0.22) 0%, rgba(154, 0, 0, 0.06) 45%, transparent 70%)',
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
              border: '2px solid rgba(211, 47, 47, 0.6)',
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
              background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.35) 0%, rgba(8, 8, 8, 0.9) 100%)',
              border: '2px solid #d32f2f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(211, 47, 47, 0.45)',
            }}
          >
            <CheckCircle size={38} color="#d32f2f" strokeWidth={2} />
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
              color: 'var(--color-star-white, #f4eacc)',
            }}
          >
            REGISTRATION <span style={{ color: '#d32f2f', textShadow: '0 0 15px rgba(211, 47, 47, 0.5)' }}>CONFIRMED!</span>
          </h1>
          <p
            style={{
              color: 'rgba(244, 234, 204, 0.8)',
              fontSize: '0.98rem',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            You are officially registered for{' '}
            <strong style={{ color: 'var(--color-star-white, #f4eacc)', borderBottom: '1px solid #d32f2f' }}>
              {eventName}
            </strong>
          </p>
        </motion.div>

        {/* Digital Event Pass Ticket Card (Matching Registration Section Card Design) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            position: 'relative',
            background: 'var(--color-glass-bg, rgba(8, 8, 8, 0.88))',
            border: '1px solid rgba(211, 47, 47, 0.5)',
            borderRadius: '6px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 30px rgba(211, 47, 47, 0.15), 4px 4px 0px 0px rgba(211, 47, 47, 0.3)',
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
              borderBottom: '1px solid rgba(211, 47, 47, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            {/* Pill Badge matching Registration Section */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 1rem',
                background: 'rgba(211, 47, 47, 0.15)',
                border: '1px solid rgba(211, 47, 47, 0.45)',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                color: 'var(--color-bright-crimson, #ff3d57)',
                textTransform: 'uppercase',
              }}
            >
              <ShieldCheck size={15} color="#ff3d57" />
              <span>SPECTRUM 1.0 PASS</span>
            </div>

            {/* Paid Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
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
          <div style={{ padding: '1.5rem 1.75rem 1.25rem 1.75rem' }}>
            <span
              style={{
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#d32f2f',
                fontWeight: 700,
              }}
            >
              Event
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: 'var(--color-star-white, #f4eacc)',
                margin: '0.25rem 0 0.5rem 0',
                letterSpacing: '0.04em',
              }}
            >
              {eventName}
            </h2>

            {theme && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  background: 'rgba(211, 47, 47, 0.12)',
                  border: '1px solid rgba(211, 47, 47, 0.35)',
                  borderRadius: '4px',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-star-white, #f4eacc)',
                }}
              >
                <span style={{ color: '#d32f2f', fontWeight: 800, letterSpacing: '0.05em' }}>THEME:</span>
                <span>{theme}</span>
              </div>
            )}

            {/* Quick Meta Grid matching Registration Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.85rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(244, 234, 204, 0.15)',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#d32f2f', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={13} color="#d32f2f" /> DATE
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-star-white, #f4eacc)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                  Dec 7 – 9, 2026
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>
                  3-Day National Fest
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(244, 234, 204, 0.15)',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#d32f2f', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={13} color="#d32f2f" /> VENUE
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--color-star-white, #f4eacc)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem' }}>
                  GNDEC Campus
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>
                  Bidar, Karnataka
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Ticket Divider with Notches */}
          <div style={{ position: 'relative', margin: '0.5rem 0' }}>
            <div
              style={{
                borderBottom: '1px dashed rgba(211, 47, 47, 0.35)',
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
                background: 'var(--color-space-black, #080808)',
                borderRight: '1px solid rgba(211, 47, 47, 0.5)',
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
                background: 'var(--color-space-black, #080808)',
                borderLeft: '1px solid rgba(211, 47, 47, 0.5)',
              }}
            />
          </div>

          {/* Credentials & Identification Block */}
          <div style={{ padding: '1.25rem 1.75rem 1.75rem 1.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Order ID */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(244, 234, 204, 0.15)',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d32f2f', fontWeight: 'bold' }}>
                    Confirmation (Order) ID
                  </span>
                  <button
                    onClick={() => handleCopy(orderId, 'order')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: copiedKey === 'order' ? '#00e676' : 'rgba(244, 234, 204, 0.8)',
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
                    fontSize: '0.92rem',
                    color: 'var(--color-star-white, #f4eacc)',
                    background: 'rgba(0, 0, 0, 0.55)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(211, 47, 47, 0.25)',
                    wordBreak: 'break-all',
                  }}
                >
                  {orderId}
                </div>
              </div>

              {/* Razorpay Payment ID */}
              {paymentId && paymentId !== 'N/A' && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(244, 234, 204, 0.15)',
                    borderRadius: '6px',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d32f2f', fontWeight: 'bold' }}>
                      Razorpay Payment ID
                    </span>
                    <button
                      onClick={() => handleCopy(paymentId, 'payment')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedKey === 'payment' ? '#00e676' : 'rgba(244, 234, 204, 0.8)',
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
                      color: 'var(--color-star-white, #f4eacc)',
                      background: 'rgba(0, 0, 0, 0.55)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(211, 47, 47, 0.25)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {paymentId}
                  </div>
                </div>
              )}

              {/* Database Registration ID (UUID) */}
              {registrationId && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(244, 234, 204, 0.15)',
                    borderRadius: '6px',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#d32f2f', fontWeight: 'bold' }}>
                      Database Registration ID
                    </span>
                    <button
                      onClick={() => handleCopy(registrationId, 'reg')}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedKey === 'reg' ? '#00e676' : 'rgba(244, 234, 204, 0.8)',
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
                      background: 'rgba(0, 0, 0, 0.55)',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(211, 47, 47, 0.25)',
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

        {/* Action Buttons: Download PDF & Back Home (Styled exactly like Registration Section CTAs) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}
        >
          {/* Primary CTA: Download PDF Pass (Matching REGISTER FOR HACKATHON Button) */}
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
              padding: '1rem 2rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-space-black, #080808)',
              backgroundColor: '#d32f2f',
              border: '2px solid #d32f2f',
              borderRadius: '4px',
              cursor: isDownloading ? 'wait' : 'pointer',
              boxShadow: '4px 4px 0px 0px rgba(244, 234, 204, 0.5)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!isDownloading) {
                e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
                e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(244, 234, 204, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '4px 4px 0px 0px rgba(244, 234, 204, 0.5)';
            }}
          >
            <Download size={19} color="#080808" strokeWidth={2.5} />
            <span>{isDownloading ? 'Generating Colourful PDF...' : 'Download Pass (PDF)'}</span>
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
              padding: '0.9rem 2rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-star-white, #f4eacc)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '2px solid rgba(244, 234, 204, 0.25)',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '3px 3px 0px 0px rgba(211, 47, 47, 0.4)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.15)';
              e.currentTarget.style.borderColor = '#d32f2f';
              e.currentTarget.style.transform = 'translateY(-2px) translateX(-2px)';
              e.currentTarget.style.boxShadow = '5px 5px 0px 0px rgba(211, 47, 47, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(244, 234, 204, 0.25)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '3px 3px 0px 0px rgba(211, 47, 47, 0.4)';
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
            background: 'var(--color-glass-bg, rgba(8, 8, 8, 0.85))',
            border: '1px solid rgba(211, 47, 47, 0.3)',
            borderRadius: '6px',
            padding: '1.25rem',
            textAlign: 'left',
            boxShadow: '3px 3px 0px 0px rgba(211, 47, 47, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem' }}>
            <Info size={15} color="#d32f2f" />
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: 'var(--color-star-white, #f4eacc)',
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
              color: 'rgba(244, 234, 204, 0.75)',
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
            color: 'rgba(244, 234, 204, 0.45)',
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
