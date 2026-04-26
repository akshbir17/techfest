import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import { Calendar, Users } from 'lucide-react';

const EventsPreviewSection = () => {
  const navigate = useNavigate();

  const previewEvents = [
    { name: 'Hackathon', category: 'TECHNICAL', price: '250', teamSize: '2 - 4 Members', date: '11th May 2026 Monday' },
    { name: 'Poster Presentation', category: 'CREATIVE', price: '100', teamSize: 'Individual / Team', date: '12th May 2026 Tuesday' },
    { name: 'BGMI Tournament', category: 'GAMES', price: '200', teamSize: '4 Members', date: '12th May 2026 Tuesday' }
  ];

  return (
    <section id="events-preview" className="section-container" style={{ minHeight: 'unset', padding: '100px 2rem' }}>
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">THE GRAND</span> TRIALS
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {previewEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              style={{ width: '100%', aspectRatio: '1/1' }}
            >
              <GlassCard style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-neon-cyan)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                  {event.category}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 className="text-xl font-bold uppercase" style={{ color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                    {event.name}
                  </h3>
                  <span style={{ backgroundColor: 'var(--color-neon-cyan)', color: 'var(--color-space-black)', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                    ₹{event.price}
                  </span>
                </div>
                
                <div className="mt-auto mb-4" style={{ color: 'var(--color-star-white)', opacity: 0.8, fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Calendar size={16} color="var(--color-neon-cyan)" />
                    <span>{event.date || 'April 29 - 30, 2026'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} color="var(--color-neon-cyan)" />
                    <span>Team Size: {event.teamSize}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <NeonButton onClick={() => {
            navigate('/events');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            VIEW ALL TRIALS
          </NeonButton>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsPreviewSection;
