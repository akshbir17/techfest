import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, HeartPulse, Leaf, Bot, Target, Sparkles, Info } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const HACKATHON_THEMES = [
  {
    id: 'agritech',
    number: '01',
    title: 'Agriculture, FoodTech & Rural Development',
    tagline: 'Sustainable Farming & Rural Livelihoods',
    icon: Sprout,
    accentColor: '#10B981', // Emerald
    accentBg: 'rgba(16, 185, 129, 0.12)',
    accentBorder: 'rgba(16, 185, 129, 0.35)',
    focus: 'Using technology to support rural livelihoods, optimize farming practices, and secure the food supply chain against climate change and logistical inefficiencies.',
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
    accentColor: '#F43F5E', // Rose Crimson
    accentBg: 'rgba(244, 63, 94, 0.12)',
    accentBorder: 'rgba(244, 63, 94, 0.35)',
    focus: 'Democratizing access to healthcare, optimizing hospital resources, and addressing the growing need for mental health support.',
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
    accentColor: '#00F0FF', // Neon Cyan
    accentBg: 'rgba(0, 240, 255, 0.12)',
    accentBorder: 'rgba(0, 240, 255, 0.35)',
    focus: 'Climate tech, circular economy practices, waste management, and reducing carbon footprints in rapidly growing urban environments.',
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
    accentColor: '#A855F7', // Violet Purple
    accentBg: 'rgba(168, 85, 247, 0.12)',
    accentBorder: 'rgba(168, 85, 247, 0.35)',
    focus: 'Upgrading legacy government or enterprise systems with autonomous AI agents and machine learning to optimize resources and eliminate bottlenecks.',
    ideas: [
      'Zero-trust API security scanners and automated vulnerability patchers.',
      'Automated public building maintenance and energy-saving systems.',
      'Predictive demand forecasting models for public transport networks.',
      'AI tools for personalized learning gap analysis in primary education.',
    ],
  },
];

const ThemesSection = () => {
  return (
    <section id="themes" className="section-container themes-section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="themes-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(211, 47, 47, 0.15)', border: '1px solid rgba(211, 47, 47, 0.4)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--color-bright-crimson)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            24-Hour Hackathon Domains
          </div>

          <h2 className="rules-title">
            <span className="text-gradient">HACKATHON</span> THEMES
          </h2>
          <div className="rules-divider"></div>
          
          <p style={{ color: 'rgba(244, 234, 204, 0.75)', maxWidth: '680px', margin: '1rem auto 0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
            Innovate with purpose. Explore the 4 official problem domains of the 24-Hour Hackathon and build high-impact real-world solutions.
          </p>
        </motion.div>

        {/* 2x2 Grid of Theme Cards */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
            gap: '2rem',
            width: '100%'
          }}
        >
          {HACKATHON_THEMES.map((theme, index) => {
            const Icon = theme.icon;

            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                style={{ height: '100%' }}
              >
                <GlassCard
                  style={{
                    height: '100%',
                    padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderColor: theme.accentBorder,
                    boxShadow: `0 0 25px ${theme.accentBg}`,
                    borderRadius: '8px',
                    position: 'relative',
                  }}
                >
                  <div>
                    {/* Top Row: Theme Badge, Tagline & Glowing Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                          <span 
                            style={{ 
                              fontFamily: 'var(--font-heading)',
                              fontSize: '0.75rem', 
                              fontWeight: '800', 
                              color: theme.accentColor, 
                              background: theme.accentBg, 
                              border: `1px solid ${theme.accentBorder}`,
                              padding: '0.2rem 0.65rem',
                              borderRadius: '4px',
                              letterSpacing: '0.1em'
                            }}
                          >
                            THEME {theme.number}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(244, 234, 204, 0.6)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '500' }}>
                          {theme.tagline}
                        </div>
                      </div>

                      <div 
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: theme.accentBg,
                          border: `1px solid ${theme.accentBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 0 15px ${theme.accentBg}`
                        }}
                      >
                        <Icon size={24} color={theme.accentColor} />
                      </div>
                    </div>

                    {/* Theme Title */}
                    <h3 
                      style={{ 
                        fontFamily: 'var(--font-heading)', 
                        fontSize: 'clamp(1.25rem, 2vw, 1.45rem)', 
                        fontWeight: '800', 
                        color: 'var(--color-star-white)', 
                        marginBottom: '1.25rem',
                        lineHeight: '1.35',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {theme.title}
                    </h3>

                    {/* The Focus Callout Box */}
                    <div 
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderLeft: `3px solid ${theme.accentColor}`,
                        borderTop: '1px solid rgba(244, 234, 204, 0.1)',
                        borderRight: '1px solid rgba(244, 234, 204, 0.1)',
                        borderBottom: '1px solid rgba(244, 234, 204, 0.1)',
                        borderRadius: '4px',
                        padding: '1rem 1.15rem',
                        marginBottom: '1.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.12em', color: theme.accentColor, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        <Target size={15} /> The Focus
                      </div>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(244, 234, 204, 0.85)', lineHeight: '1.55' }}>
                        {theme.focus}
                      </p>
                    </div>

                    {/* Winning Project Ideas Section - Hidden */}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Open Innovation Track Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{ marginTop: '2.5rem', width: '100%' }}
        >
          <GlassCard
            style={{
              padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              borderRadius: '8px',
              border: '1px solid rgba(211, 47, 47, 0.45)',
              background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.08) 0%, rgba(8, 8, 8, 0.9) 100%)',
              boxShadow: '0 4px 25px rgba(211, 47, 47, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top glowing accent line */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: 'var(--color-star-white)',
                    background: 'rgba(211, 47, 47, 0.25)',
                    border: '1px solid rgba(211, 47, 47, 0.5)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '4px',
                    letterSpacing: '0.1em',
                  }}
                >
                  TRACK 05
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                    fontWeight: 800,
                    color: 'var(--color-star-white)',
                    margin: 0,
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Sparkles size={22} color="var(--color-bright-crimson, #d32f2f)" />
                  OPEN <span className="text-gradient">INNOVATION</span>
                </h3>
              </div>

              {/* Description */}
              <p
                style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'rgba(244, 234, 204, 0.88)',
                  lineHeight: '1.6',
                }}
              >
                Want to work on an idea outside the given themes? You can do that! First, select any one of the four themes during registration. You can then work on your own idea under Open Innovation.
              </p>

              {/* Note Callout */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.75rem 1.1rem',
                  background: 'rgba(211, 47, 47, 0.1)',
                  border: '1px solid rgba(211, 47, 47, 0.35)',
                  borderRadius: '6px',
                  marginTop: '0.35rem',
                }}
              >
                <Info size={18} color="var(--color-bright-crimson, #d32f2f)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(244, 234, 204, 0.85)', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--color-star-white)' }}>Note:</strong> Please confirm your Open Innovation choice at the Help Desk on the day of the hackathon.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

      </div>
    </section>
  );
};

export default ThemesSection;

