import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { User, Phone, GraduationCap } from 'lucide-react';

const CoordinatorsSection = () => {
  const facultyCoordinators = [
    { name: 'Dr. Ramesh Patil (Faculty Convener)', dept: 'Computer Science & Engineering', phone: '+91 9448123456' },
    { name: 'Prof. Sunita Biradar (Faculty Co-Convener)', dept: 'Data Science', phone: '+91 9845987654' },
    { name: 'Prof. Vijay Kumar (Faculty Coordinator)', dept: 'Artificial Intelligence & ML', phone: '+91 9901234567' },
  ];

  const studentCoordinators = [
    { name: 'RISHIKESH DESHMUKH (Overall Lead)', dept: 'Data Science', phone: '+91 9035896633' },
    { name: 'Siddalinga (Co-Coordinator)', dept: 'Data Science', phone: '+91 9902664144' },
    { name: 'Sangmesh (Co-Coordinator)', dept: 'Data Science', phone: '+91 9353142522' },
    { name: 'Akshbir Singh Seehra (Co-Coordinator)', dept: 'Data Science', phone: '+91 9833337788' }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" style={{ gap: '2rem' }}>
          
          {/* Faculty Coordinators (Left) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(211, 47, 47, 0.3)', paddingBottom: '1rem' }}>
                <GraduationCap color="var(--color-neon-cyan)" size={24} />
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-neon-cyan)' }}>
                  Faculty Coordinators
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {facultyCoordinators.map((faculty, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 8, 8, 0.4)', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #1a1a1a', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '180px', flex: '1 1 180px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-star-white)', fontSize: '1.05rem', wordBreak: 'break-word' }}>{faculty.name}</span>
                      <span style={{ color: 'var(--color-neon-cyan)', fontSize: '0.8rem', opacity: 0.9 }}>{faculty.dept}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-star-white)', opacity: 0.85, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      <Phone size={15} color="var(--color-neon-cyan)" />
                      <a href={`tel:${faculty.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {faculty.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Student Coordinators (Right) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            style={{ height: '100%' }}
          >
            <GlassCard style={{ height: '100%', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(211, 47, 47, 0.3)', paddingBottom: '1rem' }}>
                <User color="var(--color-neon-cyan)" size={24} />
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-neon-cyan)' }}>
                  Student Coordinators
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {studentCoordinators.map((student, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(8, 8, 8, 0.4)', padding: '1rem 1.25rem', borderRadius: '4px', border: '1px solid #1a1a1a', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '180px', flex: '1 1 180px' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-star-white)', fontSize: '1.05rem', wordBreak: 'break-word' }}>{student.name}</span>
                      <span style={{ color: 'var(--color-neon-cyan)', fontSize: '0.8rem', opacity: 0.9 }}>{student.dept}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-star-white)', opacity: 0.85, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      <Phone size={15} color="var(--color-neon-cyan)" />
                      <a href={`tel:${student.phone.replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {student.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CoordinatorsSection;
