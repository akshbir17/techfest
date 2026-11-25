import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  ExternalLink,
  MapPin,
  Mail,
  Copy,
  Check,
  Compass,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Zap,
  Rocket,
  Users,
} from 'lucide-react';

const EMAIL_ADDRESS = 'Spectrum101213@gmail.com';
const DIRECTIONS_URL =
  'https://maps.google.com/?q=Guru+Nanak+Dev+Engineering+College+Bidar,+Mailoor+Road,+Bidar,+Karnataka+585403';
const MAP_EMBED_URL =
  'https://maps.google.com/maps?q=Guru%20Nanak%20Dev%20Engineering%20College%20Bidar,%20Mailur%20Rd,%20Mailoor,%20Bidar,%20Karnataka%20585403&t=&z=15&ie=UTF8&iwloc=&output=embed';
const RAZORPAY_SUPPORT_URL = 'https://razorpay.me/@spectrum10';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DiscordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const SOCIAL_CHANNELS = [
  {
    id: 'instagram',
    name: 'INSTAGRAM',
    handle: '@spectrum.1.0',
    href: 'https://www.instagram.com/spectrum.1.0?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==',
    icon: InstagramIcon,
    accentBg: 'rgba(225, 48, 108, 0.16)',
    accentColor: '#fb7185',
    borderColor: 'rgba(225, 48, 108, 0.4)',
  },
  {
    id: 'discord',
    name: 'DISCORD',
    handle: 'Join Community',
    href: 'https://discord.gg/Dk9NyYj5bN',
    icon: DiscordIcon,
    accentBg: 'rgba(88, 101, 242, 0.18)',
    accentColor: '#818cf8',
    borderColor: 'rgba(88, 101, 242, 0.45)',
  },
];

const IMPACT_PILLARS = [
  { icon: Zap, label: 'Create Opportunities' },
  { icon: Rocket, label: 'Empower Talent' },
  { icon: Users, label: 'Build Community' },
];

const ContactSection = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [darkMap, setDarkMap] = useState(true);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback if clipboard permission is blocked
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }
  };

  return (
    <section id="contact" className="section-container contact-section">
      <div className="contact-content">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="rules-header"
          style={{ marginBottom: '2.75rem' }}
        >
          <div className="contact-eyebrow">
            <span className="contact-eyebrow-line" />
            <span className="contact-eyebrow-text">Connect • Navigate • Contribute</span>
            <span className="contact-eyebrow-line right" />
          </div>

          <h2 className="rules-title">
            <span className="text-gradient">CONTACT</span> &amp; SUPPORT
          </h2>
          <div className="rules-divider" />
          <p className="contact-subtitle">
            Reach the SPECTRUM 1.0 command desk, explore our Bidar campus venue, or help fuel the experience.
          </p>
        </motion.div>

        {/* Two-Column Equal-Height Architectural Cards */}
        <div className="contact-grid">
          {/* Left Panel: Venue & Communication Hub */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ height: '100%' }}
          >
            <div className="contact-panel">
              <div className="contact-panel-top-glow" />
              <div className="about-corner about-corner-tl" />
              <div className="about-corner about-corner-br" />

              {/* Header */}
              <div>
                <div className="contact-panel-header">
                  <div className="contact-panel-title-wrap">
                    <div className="contact-icon-crest">
                      <Compass size={20} />
                    </div>
                    <h3 className="contact-panel-title">Venue &amp; Channels</h3>
                  </div>
                  <span className="contact-status-pill">
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#34d399',
                        boxShadow: '0 0 8px #34d399',
                      }}
                    />
                    Desk Active
                  </span>
                </div>

                {/* Info Tiles */}
                <div className="contact-info-stack" style={{ marginTop: '1.15rem' }}>
                  {/* Address Tile */}
                  <div className="contact-info-tile">
                    <div className="contact-tile-left">
                      <MapPin size={18} className="contact-tile-icon" />
                      <div>
                        <div className="info-label">Campus Venue</div>
                        <div className="info-text">
                          <strong>Guru Nanak Dev Engineering College</strong>
                          <br />
                          <span style={{ color: 'rgba(244, 234, 204, 0.78)', fontSize: '0.88rem' }}>
                            Mailoor Road, Bidar, Karnataka 585403
                          </span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-action-chip"
                    >
                      <span>Directions</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {/* Email Tile */}
                  <div className="contact-info-tile">
                    <div className="contact-tile-left">
                      <Mail size={18} className="contact-tile-icon" />
                      <div>
                        <div className="info-label">Official Email</div>
                        <div className="info-text">
                          <a
                            href={`mailto:${EMAIL_ADDRESS}`}
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            {EMAIL_ADDRESS}
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className={`contact-action-chip ${copiedEmail ? 'copied' : ''}`}
                      aria-label="Copy official email address"
                    >
                      {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Mystic Threads / Social Channels */}
                  <div style={{ marginTop: '0.2rem' }}>
                    <div className="info-label" style={{ marginBottom: '0.55rem' }}>
                      Mystic Threads • Community
                    </div>
                    <div className="contact-social-grid">
                      {SOCIAL_CHANNELS.map((channel) => {
                        const Icon = channel.icon;
                        return (
                          <a
                            key={channel.id}
                            href={channel.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`contact-social-card ${channel.id}`}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                              <div
                                className="contact-social-badge"
                                style={{
                                  background: channel.accentBg,
                                  border: `1px solid ${channel.borderColor}`,
                                  color: channel.accentColor,
                                }}
                              >
                                <Icon />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div
                                  style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.1em',
                                    color: 'var(--color-star-white)',
                                  }}
                                >
                                  {channel.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.74rem',
                                    color: 'rgba(244, 234, 204, 0.68)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {channel.handle}
                                </div>
                              </div>
                            </div>
                            <ExternalLink size={14} style={{ opacity: 0.65, flexShrink: 0 }} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tactical Campus Map Embed */}
              <div className="contact-map-frame">
                <div className="contact-map-hud">
                  <span className="contact-map-hud-title">
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#d32f2f',
                        boxShadow: '0 0 8px #d32f2f',
                      }}
                    />
                    Campus Radar • Bidar, KA
                  </span>
                  <button
                    type="button"
                    onClick={() => setDarkMap((prev) => !prev)}
                    className="contact-map-toggle"
                    title="Switch map color mode"
                  >
                    {darkMap ? <Sun size={11} /> : <Moon size={11} />}
                    <span>{darkMap ? 'Light Map' : 'Dark Map'}</span>
                  </button>
                </div>
                <iframe
                  title="GNDEC Bidar Location"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="195"
                  style={{
                    border: 0,
                    display: 'block',
                    filter: darkMap
                      ? 'invert(90%) hue-rotate(180deg) contrast(0.96) saturate(0.85)'
                      : 'none',
                    transition: 'filter 0.3s ease',
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Support Us Card */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            style={{ height: '100%' }}
          >
            <div
              className="contact-panel"
              style={{
                background:
                  'radial-gradient(ellipse at top right, rgba(211, 47, 47, 0.14) 0%, transparent 55%), linear-gradient(160deg, rgba(18, 10, 12, 0.94) 0%, rgba(8, 8, 8, 0.98) 100%)',
              }}
            >
              <div className="contact-panel-top-glow" />
              <div className="about-corner about-corner-tl" />
              <div className="about-corner about-corner-br" />

              {/* Top & Narrative */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                <div className="contact-panel-header">
                  <div className="contact-panel-title-wrap">
                    <div className="contact-icon-crest">
                      <Heart size={20} fill="rgba(211, 47, 47, 0.35)" />
                    </div>
                    <h3 className="contact-panel-title">
                      Support <span style={{ color: 'var(--color-neon-cyan)' }}>Us</span>
                    </h3>
                  </div>
                  <span className="contact-patron-pill">
                    <Sparkles size={11} />
                    Community Patron
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: '1.03rem',
                    lineHeight: '1.72',
                    color: 'var(--color-star-white)',
                    fontWeight: 500,
                  }}
                >
                  Spectrum is more than just an event — it&apos;s a platform built to bring together creativity,
                  innovation, technology and talent.
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.94rem',
                    lineHeight: '1.75',
                    color: 'rgba(244, 234, 204, 0.78)',
                  }}
                >
                  Your support helps us make this experience bigger, better and more memorable. Every contribution,
                  no matter how small, motivates us to create opportunities, empower participants and build an amazing
                  community.
                </p>

                {/* Impact Pillars */}
                <div className="support-impact-grid">
                  {IMPACT_PILLARS.map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <span key={pillar.label} className="support-impact-pill">
                        <Icon size={14} color="#d4af37" />
                        <span>{pillar.label}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Highlight Callout */}
                <div className="support-mission-callout">
                  Be a part of our journey. Support Spectrum and help us make it extraordinary!
                </div>
              </div>

              {/* Bottom CTA Zone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontStyle: 'italic',
                    fontSize: '0.92rem',
                    color: '#d4af37',
                  }}
                >
                  <Heart size={15} fill="#d32f2f" color="#d32f2f" />
                  <span>Thank you for believing in us.</span>
                </div>

                <a
                  href={RAZORPAY_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="support-cta-btn"
                >
                  <Heart size={18} fill="#f4eacc" color="#080808" strokeWidth={2.2} />
                  <span>SUPPORT US!</span>
                  <ExternalLink size={16} strokeWidth={2.4} />
                </a>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontSize: '0.73rem',
                    color: 'rgba(244, 234, 204, 0.56)',
                    letterSpacing: '0.06em',
                  }}
                >
                  <ShieldCheck size={14} color="#34d399" />
                  <span>Secure contribution via Razorpay • Every bit fuels innovation</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div
            style={{
              marginBottom: '0.5rem',
              fontSize: '0.84rem',
              letterSpacing: '0.16em',
              fontFamily: 'var(--font-heading)',
              color: 'rgba(244, 234, 204, 0.8)',
              textTransform: 'uppercase',
            }}
          >
            MADE BY : <span style={{ color: 'var(--color-neon-cyan)', fontWeight: 800 }}>AKSHBIR SINGH SEEHRA</span>
          </div>
          <div>SPECTRUM 1.0 © DECEMBER 2026 • THE AWAKENING</div>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
