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
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const RegistrationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('order_id') || 'N/A';
  const paymentId = searchParams.get('payment_id') || 'N/A';
  const registrationId = searchParams.get('reg_id') || '';
  const uniqueIdFromQuery = searchParams.get('unique_id') || '';
  const rawEventName = searchParams.get('event') || 'Official Event';
  const participantName = searchParams.get('name') || '';
  const teamName = searchParams.get('team') || '';
  const amount = searchParams.get('amount') || '';
  const theme = searchParams.get('theme') || '';
  const accommodation = searchParams.get('accommodation') || searchParams.get('accom') || '';

  const eventName = decodeURIComponent(rawEventName);
  const eventPrefix = String(eventName || 'SPEC').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SPEC';
  const uniqueRegId = uniqueIdFromQuery ||
    (registrationId && registrationId.startsWith('SPEC-') 
      ? registrationId 
      : (registrationId 
          ? `SPEC-${eventPrefix}-${registrationId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}` 
          : (orderId && orderId !== 'N/A' 
              ? `SPEC-${eventPrefix}-${orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}` 
              : `SPEC-${eventPrefix}-PASS`)));
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
  // REDESIGNED PDF PASS — Crimson Red + Black Futuristic Tech Credential
  // Primary: #B5122A · Secondary: #090909 · Accent: #E31B3F
  // Background: #101014 · Text: #FFFFFF & #BFC0C5
  // ═══════════════════════════════════════════════════════════════════════
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pw = 210;
      const ph = 297;
      const m = 14;
      const cw = pw - m * 2; // 182mm

      const drawSectionHeader = (title, yPos) => {
        doc.setFillColor(227, 27, 63); // #E31B3F
        doc.rect(m, yPos - 2.6, 1.4, 4.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.8);
        doc.setTextColor(255, 255, 255);
        doc.text(title, m + 4, yPos + 0.8);

        const titleWidth = doc.getTextWidth(title);
        doc.setDrawColor(95, 22, 34);
        doc.setLineWidth(0.25);
        doc.line(m + titleWidth + 7, yPos - 0.5, m + cw, yPos - 0.5);
      };

      // 1. DARK NEAR-BLACK BACKGROUND (#101014) + SUBTLE ARCHITECTURAL GRID
      doc.setFillColor(16, 16, 20);
      doc.rect(0, 0, pw, ph, 'F');

      doc.setDrawColor(23, 23, 29);
      doc.setLineWidth(0.15);
      for (let gx = 14; gx < pw; gx += 14) {
        doc.line(gx, 0, gx, ph);
      }
      for (let gy = 14; gy < ph; gy += 14) {
        doc.line(0, gy, pw, gy);
      }

      // Subtle outer framing line
      doc.setDrawColor(36, 36, 44);
      doc.setLineWidth(0.25);
      doc.rect(5, 5, pw - 10, ph - 10, 'S');

      // 2. FULL-BLEED CRIMSON + BLACK GRADIENT HEADER
      const hdrH = 50;
      const steps = 64;
      const c1 = [9, 9, 9];       // #090909 Dark Black
      const c2 = [48, 9, 17];     // Deep Burgundy transition
      const c3 = [181, 18, 42];   // #B5122A Deep Crimson Red
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        let r, g, b;
        if (t < 0.55) {
          const f = t / 0.55;
          r = Math.round(c1[0] + (c2[0] - c1[0]) * f);
          g = Math.round(c1[1] + (c2[1] - c1[1]) * f);
          b = Math.round(c1[2] + (c2[2] - c1[2]) * f);
        } else {
          const f = (t - 0.55) / 0.45;
          r = Math.round(c2[0] + (c3[0] - c2[0]) * f);
          g = Math.round(c2[1] + (c3[1] - c2[1]) * f);
          b = Math.round(c2[2] + (c3[2] - c2[2]) * f);
        }
        doc.setFillColor(r, g, b);
        const sx = (i * pw) / steps;
        const sw = pw / steps + 0.6;
        doc.rect(sx, 0, sw, hdrH, 'F');
      }

      // Subtle futuristic geometric diagonals inside header right
      doc.setDrawColor(227, 27, 63);
      doc.setLineWidth(0.35);
      doc.line(145, 0, 182, hdrH);
      doc.setDrawColor(181, 18, 42);
      doc.setLineWidth(0.2);
      doc.line(158, 0, 195, hdrH);
      doc.circle(182, 16, 13, 'S');
      doc.setDrawColor(90, 30, 42);
      doc.circle(182, 16, 8, 'S');

      // Bright Crimson bottom structural rail on header
      doc.setFillColor(227, 27, 63); // #E31B3F
      doc.rect(0, hdrH - 0.7, pw, 0.7, 'F');

      // Top Eyebrow Tagline
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.4);
      doc.setTextColor(191, 192, 197); // #BFC0C5
      doc.text('THE AWAKENING  |  NATIONAL LEVEL TECHNICAL FESTIVAL', m, 12.5);

      // Right: Highlighted OFFICIAL PASS Pill (#B5122A with #E31B3F border)
      const pillW = 35;
      const pillX = pw - m - pillW;
      doc.setFillColor(181, 18, 42);
      doc.setDrawColor(227, 27, 63);
      doc.setLineWidth(0.35);
      doc.roundedRect(pillX, 8, pillW, 6.5, 1.2, 1.2, 'FD');
      doc.setFillColor(255, 255, 255);
      doc.circle(pillX + 4.5, 11.25, 0.85, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(255, 255, 255);
      doc.text('OFFICIAL PASS', pillX + 7.5, 12.3);

      // Main Focus: SPECTRUM 1.0
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.text('SPECTRUM', m, 25.5);
      const specWidth = doc.getTextWidth('SPECTRUM ');
      doc.setTextColor(227, 27, 63); // #E31B3F
      doc.text('1.0', m + specWidth, 25.5);

      // Venue Line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(191, 192, 197);
      doc.text('Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka', m, 32);

      // Right Date Pill (#090909 dark with #E31B3F left accent)
      const dateW = 38;
      const dateX = pw - m - dateW;
      doc.setFillColor(9, 9, 9);
      doc.setDrawColor(75, 75, 85);
      doc.setLineWidth(0.25);
      doc.roundedRect(dateX, 24.5, dateW, 7.5, 1, 1, 'FD');
      doc.setFillColor(227, 27, 63);
      doc.rect(dateX, 24.5, 1.4, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.6);
      doc.setTextColor(255, 255, 255);
      doc.text('DEC 7 - 9, 2026', dateX + dateW / 2 + 0.5, 29.4, { align: 'center' });

      // 3. PROMINENT PARTICIPANT PASS CARD (Dark #090909 floating over header bottom)
      const cardY = 41.5;
      const cardH = 44;

      doc.setFillColor(9, 9, 9);
      doc.setDrawColor(145, 20, 40);
      doc.setLineWidth(0.35);
      doc.roundedRect(m, cardY, cw, cardH, 2, 2, 'FD');

      // Left Bright Crimson Accent Bar
      doc.setFillColor(227, 27, 63);
      doc.rect(m, cardY, 1.8, cardH, 'F');

      // Architectural corner calibration reticles (top-left & bottom-right)
      doc.setDrawColor(227, 27, 63);
      doc.setLineWidth(0.6);
      doc.line(m, cardY, m + 5, cardY);
      doc.line(m + cw - 5, cardY + cardH, m + cw, cardY + cardH);
      doc.line(m + cw, cardY + cardH - 5, m + cw, cardY + cardH);

      // Left Zone Header: PARTICIPANT PASS
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.4);
      doc.setTextColor(227, 27, 63);
      doc.text('PARTICIPANT PASS', m + 7, cardY + 7.5);
      doc.setDrawColor(95, 22, 34);
      doc.setLineWidth(0.2);
      doc.line(m + 42, cardY + 6.5, m + cw - 68, cardY + 6.5);

      // Dominant Participant Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18.5);
      doc.setTextColor(255, 255, 255);
      const nameText = participantName || 'Registered Participant';
      let displayName = nameText;
      const maxNameWidth = cw - 76;
      if (doc.getTextWidth(displayName) > maxNameWidth) {
        while (doc.getTextWidth(displayName + '...') > maxNameWidth && displayName.length > 0) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }
      doc.text(displayName, m + 7, cardY + 18);

      // Participation Type & Verification Badges side-by-side cleanly
      let displayEntry = teamName ? `TEAM: ${teamName.toUpperCase()}` : 'SOLO COMPETITOR';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      if (doc.getTextWidth(displayEntry) > 46) {
        while (doc.getTextWidth(displayEntry + '...') > 46 && displayEntry.length > 0) {
          displayEntry = displayEntry.slice(0, -1);
        }
        displayEntry += '...';
      }
      const entryW = doc.getTextWidth(displayEntry) + 8;
      doc.setFillColor(26, 26, 34);
      doc.setDrawColor(85, 86, 95);
      doc.setLineWidth(0.25);
      doc.roundedRect(m + 7, cardY + 25.5, entryW, 6.5, 1.2, 1.2, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text(displayEntry, m + 7 + entryW / 2, cardY + 29.8, { align: 'center' });

      const verX = m + 7 + entryW + 3;
      const verW = 54;
      doc.setFillColor(55, 12, 21);
      doc.setDrawColor(227, 27, 63);
      doc.setLineWidth(0.3);
      doc.roundedRect(verX, cardY + 25.5, verW, 6.5, 1.2, 1.2, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.text('100% VERIFIED & CONFIRMED', verX + verW / 2, cardY + 29.8, { align: 'center' });

      if (theme) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.6);
        doc.setTextColor(191, 192, 197);
        const accomText = accommodation ? `  |  ACCOMMODATION: ${accommodation.toUpperCase()}` : '';
        doc.text(`THEME: ${theme.toUpperCase()}${accomText}`, m + 7, cardY + 38.5);
      } else if (accommodation) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.6);
        doc.setTextColor(191, 192, 197);
        doc.text(`ACCOMMODATION: ${accommodation.toUpperCase()}`, m + 7, cardY + 38.5);
      }

      // Right Zone: Registration Fee & Event Details
      const feeW = 63;
      const feeX = m + cw - feeW;
      doc.setFillColor(14, 10, 12);
      doc.rect(feeX, cardY + 0.5, feeW - 0.5, cardH - 1, 'F');
      doc.setDrawColor(145, 20, 40);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([1.2, 1.2], 0);
      doc.line(feeX, cardY + 2, feeX, cardY + cardH - 2);
      doc.setLineDashPattern([], 0);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(191, 192, 197);
      doc.text('REGISTRATION FEE', feeX + 5.5, cardY + 9);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17.5);
      doc.setTextColor(227, 27, 63);
      doc.text('INR ', feeX + 5.5, cardY + 19.5);
      const inrW = doc.getTextWidth('INR ');
      doc.setTextColor(255, 255, 255);
      doc.text(`${amount || '0'}/-`, feeX + 5.5 + inrW, cardY + 19.5);

      doc.setDrawColor(38, 38, 46);
      doc.setLineWidth(0.2);
      doc.line(feeX + 5.5, cardY + 24, feeX + feeW - 5.5, cardY + 24);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(191, 192, 197);
      const cleanEventName = eventName.replace(/[₹\u20B9]/g, 'Rs. ').trim();
      const evLines = doc.splitTextToSize(cleanEventName, feeW - 11);
      doc.text(evLines.slice(0, 2), feeX + 5.5, cardY + 30);

      // 4. REGISTRATION DETAILS SECTION
      let y = cardY + cardH + 9;
      drawSectionHeader('REGISTRATION DETAILS', y);
      y += 5;

      const halfW = (cw - 4) / 2;

      // Order ID Card
      doc.setFillColor(9, 9, 9);
      doc.setDrawColor(38, 38, 46);
      doc.setLineWidth(0.25);
      doc.roundedRect(m, y, halfW, 14.5, 1.5, 1.5, 'FD');
      doc.setFillColor(181, 18, 42);
      doc.rect(m, y + 0.5, 1.4, 13.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(191, 192, 197);
      doc.text('CONFIRMATION (ORDER) ID', m + 5, y + 5.2);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(255, 255, 255);
      doc.text(orderId, m + 5, y + 11);

      // Payment ID Card
      const rightX = m + halfW + 4;
      doc.setFillColor(9, 9, 9);
      doc.setDrawColor(38, 38, 46);
      doc.setLineWidth(0.25);
      doc.roundedRect(rightX, y, halfW, 14.5, 1.5, 1.5, 'FD');
      doc.setFillColor(181, 18, 42);
      doc.rect(rightX, y + 0.5, 1.4, 13.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(191, 192, 197);
      doc.text('RAZORPAY PAYMENT ID', rightX + 5, y + 5.2);

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(255, 255, 255);
      doc.text(paymentId || 'N/A', rightX + 5, y + 11);

      y += 17.5;

      // Database Registration UUID & Unique Registration ID
      if (registrationId || uniqueRegId) {
        // Left: Database UUID
        doc.setFillColor(9, 9, 9);
        doc.setDrawColor(38, 38, 46);
        doc.setLineWidth(0.25);
        doc.roundedRect(m, y, halfW, 14.5, 1.5, 1.5, 'FD');
        doc.setFillColor(227, 27, 63);
        doc.rect(m, y + 0.5, 1.4, 13.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(191, 192, 197);
        doc.text('DATABASE REGISTRATION ID (UUID)', m + 5, y + 5.2);

        doc.setFont('courier', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(255, 255, 255);
        doc.text(registrationId || 'N/A', m + 5, y + 11);

        // Right: Unique Registration ID
        doc.setFillColor(9, 9, 9);
        doc.setDrawColor(38, 38, 46);
        doc.setLineWidth(0.25);
        doc.roundedRect(rightX, y, halfW, 14.5, 1.5, 1.5, 'FD');
        doc.setFillColor(0, 230, 118);
        doc.rect(rightX, y + 0.5, 1.4, 13.5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(191, 192, 197);
        doc.text('UNIQUE REGISTRATION ID', rightX + 5, y + 5.2);

        doc.setFont('courier', 'bold');
        doc.setFontSize(8.8);
        doc.setTextColor(0, 230, 118);
        doc.text(uniqueRegId, rightX + 5, y + 11);

        y += 22.5;
      } else {
        y += 6;
      }

      // 5. CAMPUS INSTRUCTIONS SECTION
      drawSectionHeader('CAMPUS INSTRUCTIONS', y);
      y += 5;

      const instructions = [
        {
          num: '1',
          title: 'Entry Gate',
          desc: 'GNDEC Bidar Main Gate. Reporting begins at 8:30 AM on Day 1.',
        },
        {
          num: '2',
          title: 'ID Mandatory',
          desc: 'Carry a valid college or institution ID card along with this pass.',
        },
        {
          num: '3',
          title: 'Hackathon Teams',
          desc: 'College lunch, dinner, breakfast and overnight accommodation provided.',
        },
      ];

      const instH = 13.5;
      const instGap = 3;

      instructions.forEach((inst) => {
        doc.setFillColor(9, 9, 9);
        doc.setDrawColor(38, 38, 46);
        doc.setLineWidth(0.25);
        doc.roundedRect(m, y, cw, instH, 1.5, 1.5, 'FD');

        // Crimson numbered square badge
        doc.setFillColor(181, 18, 42);
        doc.roundedRect(m + 4, y + (instH - 6.8) / 2, 6.8, 6.8, 1.2, 1.2, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text(inst.num, m + 7.4, y + instH / 2 + 1.15, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.6);
        doc.setTextColor(255, 255, 255);
        doc.text(inst.title, m + 15, y + 5.2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.6);
        doc.setTextColor(191, 192, 197);
        doc.text(inst.desc, m + 15, y + 10);

        y += instH + instGap;
      });

      y += 5.5;

      // 6. OFFICIAL EVENT COORDINATORS SECTION
      drawSectionHeader('OFFICIAL EVENT COORDINATORS', y);
      y += 5;

      const coordinators = [
        { role: 'HEAD, CSE - AIML', name: 'Dr. Praveen Reddy', phone: '+91 99165 42332', isFaculty: true },
        { role: 'CONVENER (IIC)', name: 'Prof. Channa Reddy', phone: '+91 861 881 3191', isFaculty: true },
        { role: 'CEO (INCUBATION CTR)', name: 'Prof. Rakesh Marturkar', phone: '+91 99024 24263', isFaculty: true },
        { role: 'STUDENT COORDINATOR', name: 'Armaandeep Singh', phone: '+91 8427027540', isFaculty: false },
        { role: 'STUDENT COORDINATOR', name: 'Sangmesh', phone: '+91 9353142522', isFaculty: false },
        { role: 'STUDENT COORDINATOR', name: 'Abdul Aziz', phone: '+91 8296683831', isFaculty: false },
      ];

      const coordW = (cw - 4) / 2;
      const coordH = 13.5;
      const coordGap = 3;

      coordinators.forEach((c, idx) => {
        const col = idx % 2;
        const rowIdx = Math.floor(idx / 2);
        const cx = m + col * (coordW + 4);
        const cy = y + rowIdx * (coordH + coordGap);

        doc.setFillColor(9, 9, 9);
        doc.setDrawColor(38, 38, 46);
        doc.setLineWidth(0.25);
        doc.roundedRect(cx, cy, coordW, coordH, 1.5, 1.5, 'FD');

        if (c.isFaculty) {
          doc.setFillColor(227, 27, 63); // Bright Crimson
        } else {
          doc.setFillColor(181, 18, 42); // Deep Crimson
        }
        doc.rect(cx, cy + 0.5, 1.4, coordH - 1, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.2);
        if (c.isFaculty) {
          doc.setTextColor(227, 27, 63);
        } else {
          doc.setTextColor(191, 192, 197);
        }
        doc.text(c.role, cx + 5, cy + 4.8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.6);
        doc.setTextColor(255, 255, 255);
        doc.text(c.name, cx + 5, cy + 10.2);

        doc.setFont('courier', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(191, 192, 197);
        doc.text(c.phone, cx + coordW - 4, cy + 10.2, { align: 'right' });
      });

      // 7. FULL-WIDTH DARK TECH FOOTER
      const footH = 19;
      const footY = ph - footH;

      doc.setFillColor(9, 9, 9);
      doc.rect(0, footY, pw, footH, 'F');

      doc.setFillColor(181, 18, 42);
      doc.rect(0, footY, pw, 0.7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(227, 27, 63);
      doc.text('NEED HELP?', m, footY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Spectrum101213@gmail.com', m, footY + 10.2);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(191, 192, 197);
      doc.text('SPECTRUM 1.0  |  DECEMBER 7-9, 2026  |  GNDEC BIDAR', m, footY + 14.8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('spectrum10.vercel.app', pw - m, footY + 10.2, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(191, 192, 197);
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      doc.text(`Generated ${nowStr} (IST)  |  System Authorized Pass`, pw - m, footY + 14.8, { align: 'right' });

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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
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
                    fontSize: '0.8rem',
                    color: 'var(--color-star-white, #f4eacc)',
                  }}
                >
                  <span style={{ color: '#d32f2f', fontWeight: 800, letterSpacing: '0.05em' }}>THEME:</span>
                  <span>{theme}</span>
                </div>
              )}
              {accommodation && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    background: 'rgba(46, 125, 50, 0.15)',
                    border: '1px solid rgba(46, 125, 50, 0.4)',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    color: 'var(--color-star-white, #f4eacc)',
                  }}
                >
                  <span style={{ color: '#4caf50', fontWeight: 800, letterSpacing: '0.05em' }}>ACCOMMODATION:</span>
                  <span>{accommodation.toUpperCase() === 'YES' ? 'YES (STAY & MEALS INCLUDED)' : 'NO (SELF ARRANGED)'}</span>
                </div>
              )}
            </div>

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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              
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
                    Database Registration ID (UUID)
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

            {/* Unique Registration ID */}
            <div
              style={{
                background: 'rgba(0, 230, 118, 0.03)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                borderRadius: '6px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#00e676', fontWeight: 'bold' }}>
                  Unique Registration ID
                </span>
                <button
                  onClick={() => handleCopy(uniqueRegId, 'unique')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedKey === 'unique' ? '#00e676' : 'rgba(244, 234, 204, 0.8)',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                >
                  {copiedKey === 'unique' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedKey === 'unique' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  color: '#00e676',
                  background: 'rgba(0, 0, 0, 0.55)',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 230, 118, 0.3)',
                  wordBreak: 'break-all',
                }}
              >
                {uniqueRegId}
              </div>
            </div>
          </div>
        </div>
        </motion.div>

        {/* Action Buttons: Mandatory Form, Download PDF & Back Home */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}
        >
          {/* Mandatory Microsoft Form Notice & Button */}
          <div
            style={{
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
              id="mandatory-form-register-btn"
              href="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAANAAWqllTJUMzFKNlY2MklYUEdZUUszT1pGR1lKWFhDMy4u"
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
            <li><strong>Mandatory:</strong> Fill out the official form via the <strong>REGISTER</strong> button above.</li>
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
