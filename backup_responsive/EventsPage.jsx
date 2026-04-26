import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import { Calendar, Users, Eye } from 'lucide-react';

const EventCategory = ({ title, events, delay }) => {
  return (
    <div className="mb-20 w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: delay }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.1em' }}>
          {title}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: delay + (idx * 0.1) }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-xl font-bold uppercase" style={{ color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                  {event.name}
                </h3>
                <span style={{ border: '1px solid var(--color-neon-cyan)', backgroundColor: 'transparent', color: 'var(--color-neon-cyan)', fontWeight: 'bold', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                  ₹{event.price}
                </span>
              </div>
              
              <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'rgba(244, 234, 204, 0.7)' }}>
                {event.description}
              </p>
              
              <div className="text-sm mb-6" style={{ color: 'var(--color-star-white)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} color="var(--color-neon-cyan)" />
                  <span style={{ opacity: 0.8 }}>{event.date || 'April 29 - 30, 2026'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} color="var(--color-neon-cyan)" />
                  <span style={{ opacity: 0.8 }}>Team Size: {event.teamSize}</span>
                </div>
              </div>
              
              <button 
                className="w-full py-3 mt-auto transition-all duration-300"
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  border: '1px solid var(--color-neon-cyan)',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-star-white)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 'bold',
                  letterSpacing: '0.1em',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.1)' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Eye size={18} />
                Rules
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EventsPage = ({ isEmbedded = false }) => {
  useEffect(() => {
    if (!isEmbedded) {
      window.scrollTo(0, 0);
    }
  }, [isEmbedded]);

  const technicalEvents = [
    { name: 'Hackathon', price: '250 per team', teamSize: '2 - 4 Members', date: '11th May 2026 Monday', description: '12-hour rapid innovation & coding challenge' }
  ];

  const creativeEvents = [
    { name: 'Poster Presentation', price: '100 per entry', teamSize: 'Individual / Team', date: '12th May 2026 Tuesday', description: 'Research, project & concept showcase' },
    { name: 'Meme Battle', price: '50 per entry', teamSize: 'Individual', date: '11th May 2026 Monday', description: 'Creative meme competition judged on humor & wit' }
  ];

  const gamesEvents = [
    { name: 'BGMI Tournament', price: '200 per squad', teamSize: '4 Members (Squad)', date: '12th May 2026 Tuesday', description: 'Squad-based competitive e-sports tournament' },
    { name: 'Treasure Hunt', price: '200 per team', teamSize: '4 members', date: '12th May 2026 Tuesday', description: 'the search of treasure has to be done.' }
  ];

  const ContainerTag = isEmbedded ? 'section' : 'main';

  return (
    <ContainerTag id="events" className={isEmbedded ? 'section-container' : 'content-layer'} style={!isEmbedded ? { width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '120px', paddingBottom: '40px', paddingLeft: '2rem', paddingRight: '2rem' } : { minHeight: 'unset', padding: '100px 2rem' }}>
      
      {!isEmbedded && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            THE <span className="text-gradient">GRAND</span> TRIALS
          </h1>
          <p style={{ color: 'var(--color-star-white)', opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Choose your battlefield. Test your skills against the greatest minds across technical mastery, creative vision, and martial wit.
          </p>
        </motion.div>
      )}

      <EventCategory title="Technical Events" events={technicalEvents} delay={0.2} />
      <EventCategory title="Creative Events" events={creativeEvents} delay={0.4} />
      <EventCategory title="Games & Fun" events={gamesEvents} delay={0.6} />
      
    </ContainerTag>
  );
};

export default EventsPage;
