import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  HeartPulse,
  Leaf,
  Bot,
  Target,
  Sparkles,
  Info,
  ChevronDown,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

const HACKATHON_THEMES = [
  {
    id: 'agritech',
    number: '01',
    title: 'Agriculture, FoodTech & Rural Development',
    tagline: 'Sustainable Farming & Rural Livelihoods',
    icon: Sprout,
    accentColor: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.38)',
    tags: ['Offline AI', 'IoT Soil Sensors', 'Supply Chain'],
    focus:
      'Using technology to support rural livelihoods, optimize farming practices, and secure the food supply chain against climate change and logistical inefficiencies.',
    ideas: [
      'AI-powered crop disease detection via smartphone cameras (designed for offline use in low-connectivity zones).',
      'Precision irrigation control systems using IoT soil sensors.',
      'Peer-to-peer micro-lending and equipment sharing platforms for rural artisans and farmers.',
    ],
  },
  {
    id: 'healthtech',
    number: '02',
    title: 'MedTech, HealthTech & Workplace Wellbeing',
    tagline: 'Healthcare Access & Medical IoT',
    icon: HeartPulse,
    accentColor: '#F43F5E',
    accentBg: 'rgba(244, 63, 94, 0.12)',
    accentBorder: 'rgba(244, 63, 94, 0.38)',
    tags: ['Health Triage', 'Medical IoT', 'Mental Wellbeing'],
    focus:
      'Democratizing access to healthcare, optimizing hospital resources, and addressing the growing need for mental health support.',
    ideas: [
      'AI mental health triage chatbots localized for rural dialects.',
      'Blockchain-based vaccine distribution and cold-chain trackers.',
      'Real-time emergency resource allocators for hospital beds and oxygen supplies.',
      'Affordable, non-invasive wearable devices for elderly health monitoring.',
    ],
  },
  {
    id: 'sustainability',
    number: '03',
    title: 'Clean & Green Technology (Sustainability)',
    tagline: 'Climate Innovation & Smart Cities',
    icon: Leaf,
    accentColor: '#00F0FF',
    accentBg: 'rgba(0, 240, 255, 0.12)',
    accentBorder: 'rgba(0, 240, 255, 0.38)',
    tags: ['Climate Tech', 'Circular Economy', 'Smart Cities'],
    focus:
      'Climate tech, circular economy practices, waste management, and reducing carbon footprints in rapidly growing urban environments.',
    ideas: [
      'Real-time river pollution and quality monitoring using distributed IoT.',
      'Carbon footprint trackers tailored for cloud software deployment.',
      'Predictive water leak detection models for smart cities.',
      'AI-enabled automated garbage segregators using computer vision.',
    ],
  },
  {
    id: 'ai_automation',
    number: '04',
    title: 'Smart Automation & Agentic AI',
    tagline: 'Autonomous Agents & Enterprise AI',
    icon: Bot,
    accentColor: '#A855F7',
    accentBg: 'rgba(168, 85, 247, 0.12)',
    accentBorder: 'rgba(168, 85, 247, 0.38)',
    tags: ['Agentic Workflows', 'Zero-Trust Sec', 'Public Systems'],
    focus:
      'Upgrading legacy government or enterprise systems with autonomous AI agents and machine learning to optimize resources and eliminate bottlenecks.',
    ideas: [
      'Zero-trust API security scanners and automated vulnerability patchers.',
      'Automated public building maintenance and energy-saving systems.',
      'Predictive demand forecasting models for public transport networks.',
      'AI tools for personalized learning gap analysis in primary education.',
    ],
  },
];

const ThemesSection = () => {
  const [expandedThemes, setExpandedThemes] = useState({});

  const toggleIdeas = (id) => {
    setExpandedThemes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollToRegistration = () => {
    const el = document.getElementById('registration');
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -70 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="themes" className="section-container themes-section">
      <div className="themes-content">
        {/* Header */}
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
            <span className="contact-eyebrow-text">24-Hour Hackathon Domains</span>
            <span className="contact-eyebrow-line right" />
          </div>

          <h2 className="rules-title">
            <span className="text-gradient">HACKATHON</span> THEMES
          </h2>
          <div className="rules-divider" />

          <p className="contact-subtitle">
            Innovate with purpose. Explore the 4 official problem domains or build your own breakthrough under Open Innovation.
          </p>
        </motion.div>

        {/* 2x2 Grid of Cyber Domain Cards */}
        <div className="themes-grid">
          {HACKATHON_THEMES.map((theme, index) => {
            const Icon = theme.icon;
            const isExpanded = Boolean(expandedThemes[theme.id]);

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
                style={{ height: '100%' }}
              >
                <div
                  className="theme-card"
                  style={{
                    '--theme-accent': theme.accentColor,
                    '--theme-bg': theme.accentBg,
                    '--theme-border': theme.accentBorder,
                  }}
                >
                  <div className="theme-card-top-glow" />
                  <div className="about-corner about-corner-tl" style={{ borderColor: theme.accentBorder }} />
                  <div className="theme-watermark-num">{theme.number}</div>

                  {/* Card Top */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 2 }}>
                    <div className="theme-card-header">
                      <div>
                        <span className="theme-num-badge">
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: theme.accentColor,
                              boxShadow: `0 0 8px ${theme.accentColor}`,
                            }}
                          />
                          THEME {theme.number}
                        </span>
                        <div className="theme-tagline">{theme.tagline}</div>
                      </div>

                      <div className="theme-icon-crest">
                        <Icon size={24} />
                      </div>
                    </div>

                    <h3 className="theme-card-title">{theme.title}</h3>

                    <div className="theme-tags-row">
                      {theme.tags.map((tag) => (
                        <span key={tag} className="theme-keyword-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="theme-focus-box">
                      <div className="theme-focus-label">
                        <Target size={14} /> The Focus
                      </div>
                      <p style={{ margin: 0, fontSize: '0.89rem', color: 'rgba(244, 234, 204, 0.85)', lineHeight: '1.58' }}>
                        {theme.focus}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Problem Angles Accordion */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <button
                      type="button"
                      onClick={() => toggleIdeas(theme.id)}
                      className="theme-ideas-toggle"
                      aria-expanded={isExpanded}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lightbulb size={15} color={theme.accentColor} />
                        <span>Sample Project Directions ({theme.ideas.length})</span>
                      </span>
                      <ChevronDown
                        size={16}
                        style={{
                          color: theme.accentColor,
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                        }}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul className="theme-ideas-list">
                            {theme.ideas.map((idea, idx) => (
                              <li key={idx} className="theme-ideas-item">
                                <span className="theme-ideas-dot" />
                                <span>{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Open Innovation Split Architectural Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="open-innovation-card">
            <div className="contact-panel-top-glow" />
            <div className="about-corner about-corner-tl" />
            <div className="about-corner about-corner-br" />

            <div className="open-innovation-grid">
              {/* Left: Track 05 Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.73rem',
                      fontWeight: '800',
                      color: 'var(--color-star-white)',
                      background: 'rgba(211, 47, 47, 0.25)',
                      border: '1px solid rgba(211, 47, 47, 0.5)',
                      padding: '0.24rem 0.7rem',
                      borderRadius: '4px',
                      letterSpacing: '0.1em',
                    }}
                  >
                    TRACK 05
                  </span>
                  <span className="contact-patron-pill">
                    <Sparkles size={11} />
                    Wildcard Track
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)',
                    fontWeight: 800,
                    color: 'var(--color-star-white)',
                    margin: 0,
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                  }}
                >
                  <Sparkles size={22} color="#d32f2f" />
                  <span>
                    OPEN <span className="text-gradient">INNOVATION</span>
                  </span>
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: '0.96rem',
                    color: 'rgba(244, 234, 204, 0.85)',
                    lineHeight: '1.65',
                  }}
                >
                  Want to work on an idea outside the given themes? You can do that! First, select any one of the four
                  themes during registration. You can then work on your own idea under Open Innovation.
                </p>
              </div>

              {/* Right: Note + Direct Registration CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.85rem 1.05rem',
                    background: 'rgba(211, 47, 47, 0.1)',
                    border: '1px solid rgba(211, 47, 47, 0.35)',
                    borderLeft: '3px solid #d4af37',
                    borderRadius: '6px',
                  }}
                >
                  <Info size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'rgba(244, 234, 204, 0.88)', lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--color-star-white)' }}>Note:</strong> Please confirm your Open
                    Innovation choice at the Help Desk on the day of the hackathon.
                  </p>
                </div>

                <button type="button" onClick={scrollToRegistration} className="open-innovation-cta">
                  <span>Register Your Squad</span>
                  <ArrowRight size={17} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ThemesSection;
