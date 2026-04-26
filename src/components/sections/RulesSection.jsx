import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const RulesSection = () => {
  const rules = [
    { title: "Honor of the Dojo", content: "All warriors must carry their valid college crest (ID). Badges of honor must be worn at all times." },
    { title: "Eligibility", content: "Open to all undergraduate and postgraduate martial scholars. Inter-clan teams are permitted." },
    { title: "Code of the Dragon", content: "Dishonorable conduct or harassment will result in immediate banishment from the tournament." },
    { title: "Path of Victory", content: "Innovation, Execution, Impact, and Presentation will be the core metrics for the Grand Trials." },
    { title: "The Emperor's Bounty", content: "Over ₹5 Lakhs in gold, plus exclusive apprenticeships and mystical artifacts for the victors." },
    { title: "Sacred Grounds", content: "Use of dark magic (malicious scripts) outside of designated combat zones is strictly forbidden." }
  ];

  return (
    <section id="rules" className="section-container rules-section">
      <div className="rules-content">
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rules-header"
        >
          <h2 className="rules-title">
            <span className="text-gradient">THE ANCIENT</span> LAWS
          </h2>
          <div className="rules-divider"></div>
        </motion.div>

        <div className="rules-grid">
          {rules.map((rule, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              style={{ height: '100%' }}
            >
              <GlassCard style={{ height: '100%' }}>
                <h3 className="rule-card-title">
                  <span className="rule-card-dot"></span>
                  {rule.title}
                </h3>
                <p className="rule-card-content">
                  {rule.content}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
