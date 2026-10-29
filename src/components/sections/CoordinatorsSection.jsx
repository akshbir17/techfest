import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { User, Phone } from 'lucide-react';

const CoordinatorsSection = () => {
  return (
    <section id="coordinators" className="section-container rules-section">
      <div className="rules-content">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">EVENT</span> COORDINATORS
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          
          {/* Student Coordinators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <GlassCard style={{ height: '100%', padding: '2.5rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(211, 47, 47, 0.3)', paddingBottom: '1rem' }}>
                <User color="var(--color-neon-cyan)" size={24} />
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-neon-cyan)' }}>
                  Student Coordinators
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {
                  [
                    { name: 'RISHIKESH DESHMUKH (Overall Lead)', phone: '+91 9035896633' },
                    { name: 'Siddalinga (Co-Coordinator)', phone: '+91 9902664144' },
                    { name: 'Sangmesh (Co-Coordinator)', phone: '+91 9353142522' },
                    { name: 'Akshbir Singh Seehra (Co-Coordinator)', phone: '+91 9833337788' }
                  ].map((student, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 8, 8, 0.4)', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-star-white)', fontSize: '1.05rem' }}>{student.name}</span>
                        <span style={{ color: 'var(--color-neon-cyan)', fontSize: '0.8rem', opacity: 0.9 }}>Data Science</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-star-white)', opacity: 0.85, fontSize: '0.9rem' }}>
                        <Phone size={15} color="var(--color-neon-cyan)" />
                        <span>{student.phone}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CoordinatorsSection;
