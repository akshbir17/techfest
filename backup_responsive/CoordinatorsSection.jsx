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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Faculty Coordinators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <GlassCard style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(211, 47, 47, 0.3)', paddingBottom: '1rem' }}>
                <User color="var(--color-neon-cyan)" size={24} />
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-neon-cyan)' }}>
                  Faculty Coordinators
                </h3>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 8, 8, 0.4)', padding: '1rem', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--color-star-white)', fontSize: '1rem' }}>Dr. Nagraj R.G</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-star-white)', opacity: 0.8, fontSize: '0.875rem' }}>
                  <Phone size={14} />
                  <span>+91 9448585396</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Student Coordinators */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <GlassCard style={{ height: '100%' }}>
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
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 8, 8, 0.4)', padding: '1rem', borderRadius: '4px', border: '1px solid #1a1a1a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-star-white)', fontSize: '1rem' }}>{student.name}</span>
                        <span style={{ color: 'var(--color-neon-cyan)', fontSize: '0.8rem', opacity: 0.9 }}>Data Science</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-star-white)', opacity: 0.8, fontSize: '0.875rem' }}>
                        <Phone size={14} />
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
