import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Gamepad2, UtensilsCrossed, BedDouble, Sparkles } from 'lucide-react';

const highlights = [
  {
    icon: Flame,
    title: 'Hackathon',
    description: 'Our flagship event, where teams collaborate, build innovative solutions, and turn ideas into reality through coding, creativity, and problem-solving.',
  },
  {
    icon: Gamepad2,
    title: 'Gaming Competitions',
    description: 'Put your gaming skills to the test, challenge fellow participants, and compete for victory.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Stalls & Canteen Facilities',
    description: 'Explore various stalls and enjoy food, refreshments, and a lively event atmosphere.',
  },
  {
    icon: BedDouble,
    title: 'Accommodation Facilities',
    description: 'Accommodation will be available for participants travelling from outside the local area. Contact the organising team for availability and booking details.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const AboutSection = () => {
  return (
    <section id="about" className="section-container about-section">
      <div className="about-content">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">ABOUT</span> SPECTRUM
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        {/* Intro Block */}
        <motion.div
          className="about-intro-card glass-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
        >
          <div className="about-intro-badge">
            <Sparkles size={16} />
            <span>WHERE INNOVATION MEETS COMPETITION</span>
          </div>

          <p className="about-intro-text">
            <strong style={{ color: 'var(--color-neon-cyan)' }}>Spectrum 1.0</strong> is a college-level technical and cultural event centred around innovation, creativity, and problem-solving. At the heart of the event is our <strong style={{ color: 'var(--color-neon-cyan)' }}>Hackathon</strong>—an opportunity for aspiring developers, innovators, and tech enthusiasts to collaborate, transform ideas into solutions, and showcase their technical skills.
          </p>
          <p className="about-intro-text" style={{ marginTop: '1rem' }}>
            Alongside the hackathon, Spectrum 1.0 features exciting gaming competitions, interactive activities, and engaging experiences that bring students together in a vibrant atmosphere of technology, teamwork, and entertainment.
          </p>
        </motion.div>

        {/* What Awaits You Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: '3rem', marginBottom: '1.5rem' }}
        >
          <h3 className="about-subheading">
            <span className="about-subheading-line"></span>
            What Awaits You?
            <span className="about-subheading-line"></span>
          </h3>
        </motion.div>

        <motion.div
          className="about-highlights-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="about-highlight-card glass-card"
                variants={itemVariants}
              >
                <div className="about-highlight-icon">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h4 className="about-highlight-title">{item.title}</h4>
                <p className="about-highlight-desc">{item.description}</p>
                {/* Corner decorations */}
                <span className="about-corner about-corner-tl"></span>
                <span className="about-corner about-corner-br"></span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Block */}
        <motion.div
          className="about-cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="about-cta-inner">
            <h3 className="about-cta-title">Be Part of the Innovation</h3>
            <p className="about-cta-text">
              Whether you're a developer with a groundbreaking idea, a competitive gamer, or someone looking to experience technology and creativity, Spectrum 1.0 has something for you.
            </p>
            <p className="about-cta-tagline">
              Bring your ideas. Build solutions. Compete. Connect.<br />
              <span style={{ color: 'var(--color-neon-cyan)', fontWeight: 800 }}>Experience Spectrum 1.0.</span>
            </p>
            <button
              className="neon-button"
              style={{ marginTop: '1.5rem' }}
              onClick={() => {
                const el = document.getElementById('registration');
                if (el) {
                  if (window.lenis) {
                    window.lenis.scrollTo(el);
                  } else {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              <span className="neon-button-text">Register Now</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;

