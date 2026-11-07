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

  // Generate & Download Vibrant Colourful Cyberpunk PDF Pass
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
      const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
      const margin = 12;
      const contentWidth = pageWidth - margin * 2; // 186mm

      // 1. FULL PAGE DARK CYBER BACKGROUND
      doc.setFillColor(10, 6, 18); // Deep Space Midnight #0a0612
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Decorative Outer Neon Border (Crimson & Cyan)
      doc.setDrawColor(255, 42, 95); // Neon Crimson #ff2a5f
      doc.setLineWidth(1);
      doc.roundedRect(6, 6, pageWidth - 12, pageHeight - 12, 3, 3, 'S');

      doc.setDrawColor(0, 240, 255); // Neon Cyan #00f0ff
      doc.setLineWidth(0.4);
      doc.roundedRect(8, 8, pageWidth - 16, pageHeight - 16, 2, 2, 'S');

      // Corner Tech Crosshairs (Cyan)
      const drawCrosshair = (cx, cy) => {
        doc.setDrawColor(0, 240, 255);
        doc.setLineWidth(0.8);
        doc.line(cx - 3, cy, cx + 3, cy);
        doc.line(cx, cy - 3, cx, cy + 3);
      };
      drawCrosshair(12, 12);
      drawCrosshair(pageWidth - 12, 12);
      drawCrosshair(12, pageHeight - 12);
      drawCrosshair(pageWidth - 12, pageHeight - 12);

      // 2. HEADER BANNER (Vibrant Dark Violet / Crimson)
      doc.setFillColor(24, 12, 36);
      doc.setDrawColor(255, 42, 95);
      doc.setLineWidth(0.8);
      doc.roundedRect(margin, 12, contentWidth, 40, 3, 3, 'FD');

      // Top Red Accent Glow Bar
      doc.setFillColor(211, 47, 47);
      doc.rect(margin + 1, 13, contentWidth - 2, 3, 'F');

      // Fest Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(23);
      doc.setTextColor(255, 255, 255);
      doc.text('SPECTRUM 1.0', margin + 8, 28);

      // Subtitle
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 240, 255); // Neon Cyan
      doc.text('THE AWAKENING • NATIONAL LEVEL TECHNICAL FESTIVAL', margin + 8, 35);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(244, 234, 204); // Warm Gold Parchment
      doc.text('Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka', margin + 8, 41);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 75, 110);
      doc.text('FEST DATES: DECEMBER 7 – 9, 2026', margin + 8, 47);

      // Verified & Paid Badge (Emerald Green Glow)
      doc.setFillColor(0, 200, 83);
      doc.roundedRect(pageWidth - margin - 48, 20, 42, 11, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('★ VERIFIED & PAID ★', pageWidth - margin - 46, 27);

      // 3. REGISTERED EVENT SHOWCASE CARD
      doc.setFillColor(32, 14, 46);
      doc.setDrawColor(0, 240, 255);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, 56, contentWidth, 24, 3, 3, 'FD');

      // Cyan Tag Pill
      doc.setFillColor(0, 240, 255);
      doc.roundedRect(margin + 6, 60, 38, 5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(10, 6, 18);
      doc.text('OFFICIAL PASS FOR', margin + 8, 63.8);

      // Big Event Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 42, 95); // Crimson
      doc.text(eventName.toUpperCase(), margin + 6, 74);

      // Category Pill on Right
      doc.setFillColor(255, 255, 255, 0.08);
      doc.roundedRect(pageWidth - margin - 55, 63, 49, 11, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(244, 234, 204);
      doc.text(teamName ? `TEAM: ${teamName.toUpperCase()}` : 'INDIVIDUAL PASS', pageWidth - margin - 52, 70);

      // 4. CREDENTIALS CARDS (COLOURFUL 2X2 GRID)
      const colWidth = (contentWidth - 6) / 2; // 90mm
      const leftColX = margin;
      const rightColX = margin + colWidth + 6;

      // Card 1: Participant Info (Cyan Accent)
      doc.setFillColor(20, 12, 32);
      doc.setDrawColor(0, 240, 255);
      doc.setLineWidth(0.5);
      doc.roundedRect(leftColX, 84, colWidth, 28, 2, 2, 'FD');

      doc.setFillColor(0, 240, 255);
      doc.rect(leftColX, 84, 3, 28, 'F'); // Left accent line

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 240, 255);
      doc.text('PARTICIPANT DETAILS', leftColX + 6, 91);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(255, 255, 255);
      doc.text(participantName || 'Registered Participant', leftColX + 6, 98);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(200, 200, 210);
      doc.text(`Entry Type: ${teamName ? `Squad Leader (${teamName})` : 'Solo Competitor'}`, leftColX + 6, 106);

      // Card 2: Fee & Payment Status (Green Accent)
      doc.setFillColor(20, 12, 32);
      doc.setDrawColor(0, 230, 118);
      doc.setLineWidth(0.5);
      doc.roundedRect(rightColX, 84, colWidth, 28, 2, 2, 'FD');

      doc.setFillColor(0, 230, 118);
      doc.rect(rightColX, 84, 3, 28, 'F'); // Left accent line

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 230, 118);
      doc.text('REGISTRATION FEE & STATUS', rightColX + 6, 91);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(amount ? `INR ${amount}/-` : 'PAID', rightColX + 6, 98);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 230, 118);
      doc.text('Status: 100% Verified & Confirmed', rightColX + 6, 106);

      // Card 3: Confirmation (Order) ID (Gold Accent)
      doc.setFillColor(20, 12, 32);
      doc.setDrawColor(255, 179, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(leftColX, 116, colWidth, 26, 2, 2, 'FD');

      doc.setFillColor(255, 179, 0);
      doc.rect(leftColX, 116, 3, 26, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 179, 0);
      doc.text('CONFIRMATION (ORDER) ID', leftColX + 6, 123);

      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(orderId, leftColX + 6, 133);

      // Card 4: Razorpay Payment ID (Crimson Accent)
      doc.setFillColor(20, 12, 32);
      doc.setDrawColor(255, 42, 95);
      doc.setLineWidth(0.5);
      doc.roundedRect(rightColX, 116, colWidth, 26, 2, 2, 'FD');

      doc.setFillColor(255, 42, 95);
      doc.rect(rightColX, 116, 3, 26, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 42, 95);
      doc.text('RAZORPAY PAYMENT ID', rightColX + 6, 123);

      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(paymentId || 'N/A', rightColX + 6, 133);

      // Card 5: Database UUID Registration ID (if present)
      let currentY = 146;
      if (registrationId) {
        doc.setFillColor(18, 10, 28);
        doc.setDrawColor(120, 125, 150);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(0, 240, 255);
        doc.text('DATABASE REGISTRATION ID (UUID):', margin + 6, currentY + 6);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(244, 234, 204);
        doc.text(registrationId, margin + 6, currentY + 11);
        currentY += 18;
      } else {
        currentY += 4;
      }

      // 5. PERFORATED TICKET LINE & BARCODE STRIP
      doc.setDrawColor(0, 240, 255);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(margin + 4, currentY, margin + contentWidth - 4, currentY);
      doc.setLineDashPattern([], 0); // Reset

      currentY += 4;

      // Stylized Tech Barcode Graphic
      doc.setFillColor(255, 255, 255);
      let bx = margin + 8;
      const barY = currentY;
      const barH = 7;
      const pattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2];
      pattern.forEach((w) => {
        doc.rect(bx, barY, w * 0.8, barH, 'F');
        bx += w * 0.8 + 1.2;
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 240, 255);
      doc.text('SECURITY PASS VERIFICATION', bx + 6, barY + 4.5);

      currentY += 14;

      // 6. CAMPUS INSTRUCTIONS & COORDINATOR DESK (PROMINENT HIGHLIGHT)
      doc.setFillColor(22, 13, 36);
      doc.setDrawColor(255, 42, 95);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, currentY, contentWidth, 76, 3, 3, 'FD');

      // Top Header inside Guidelines
      doc.setFillColor(255, 42, 95);
      doc.rect(margin + 1, currentY + 1, contentWidth - 2, 8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('CAMPUS INSTRUCTIONS & HELP DESK COORDINATORS', margin + 6, currentY + 6.5);

      let gy = currentY + 14;
      const addRule = (icon, boldText, normalText) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 240, 255);
        doc.text(icon, margin + 6, gy);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(244, 234, 204);
        doc.text(boldText, margin + 11, gy);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(215, 215, 225);
        doc.text(normalText, margin + 11 + doc.getTextWidth(boldText) + 1, gy);
        gy += 7.5;
      };

      addRule('>', 'Entry Gate:', 'GNDEC Bidar Main Gate (Reporting begins at 8:30 AM on Day 1).');
      addRule('>', 'ID Mandatory:', 'Valid College / Institution ID card is required along with this pass.');
      addRule('>', 'Hackathon Teams:', 'College lunch, dinner, breakfast & overnight accommodation provided.');
      
      // Coordinators Highlight Box (Features Armaandeep, Sangmesh, Abdul Aziz, Dr. Praveen Reddy)
      doc.setFillColor(15, 8, 24);
      doc.setDrawColor(0, 240, 255);
      doc.setLineWidth(0.4);
      doc.roundedRect(margin + 5, gy - 2, contentWidth - 10, 28, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(0, 240, 255);
      doc.text('OFFICIAL EVENT COORDINATORS (CONTACT FOR ANY QUERIES):', margin + 9, gy + 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      
      // Student Coordinators
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(244, 234, 204);
      doc.text('Student Coordinators:', margin + 9, gy + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      doc.text('• Armaandeep Singh: +91 8427027540', margin + 41, gy + 10);
      doc.text('• Sangmesh: +91 9353142522', margin + 100, gy + 10);
      doc.text('• Abdul Aziz: +91 8296683831', margin + 41, gy + 16);

      // Faculty Coordinator
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 75, 110);
      doc.text('Faculty Coordinator:', margin + 9, gy + 22);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(255, 255, 255);
      doc.text('• Dr. Praveen Reddy: +91 99165 42332', margin + 41, gy + 22);

      gy += 33;
      addRule('>', 'Help & Support:', 'Email: Spectrum101213@gmail.com | Official Portal: spectrum10.vercel.app');

      // 7. FOOTER BAR
      doc.setDrawColor(255, 42, 95);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 16, margin + contentWidth, pageHeight - 16);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(244, 234, 204);
      doc.text('SPECTRUM 1.0 • DECEMBER 7–9, 2026 • GNDEC BIDAR', margin, pageHeight - 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(140, 140, 160);
      doc.text(`Generated on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST) • System Authorized Pass`, margin, pageHeight - 7);

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
