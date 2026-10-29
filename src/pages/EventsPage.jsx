import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import { Calendar, Users, Eye } from 'lucide-react';
import EventRulesModal from '../components/EventRulesModal';
import IndividualRegModal from '../components/sections/IndividualRegModal';
import TeamRegModal from '../components/sections/TeamRegModal';

const EventCategory = ({ title, events, delay, onOpenRules }) => {
  return (
    <div className="mb-20 w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: delay }}
        className="text-center mb-10"
      >
        <h2 className="section-title text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.1em' }}>
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
                  <span style={{ opacity: 0.8 }}>{event.date || 'Dec 18 - 20, 2026'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} color="var(--color-neon-cyan)" />
                  <span style={{ opacity: 0.8 }}>Team Size: {event.teamSize}</span>
                </div>
              </div>
              
              <button 
                id={`rules-btn-${event.id}`}
                onClick={() => onOpenRules(event)}
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
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.15)' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Eye size={18} />
                Rules & Details
              </button>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EventsPage = ({ isEmbedded = false }) => {
  const [selectedRuleEvent, setSelectedRuleEvent] = useState(null);
  const [showIndividualModal, setShowIndividualModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [targetEventId, setTargetEventId] = useState(null);

  useEffect(() => {
    if (!isEmbedded) {
      window.scrollTo(0, 0);
    }
  }, [isEmbedded]);

  const handleRegisterFromRules = (event) => {
    setTargetEventId(event.id);
    if (event.type === 'team') {
      setShowTeamModal(true);
    } else {
      setShowIndividualModal(true);
    }
  };

  const technicalEvents = [
    {
      id: 'hackathon',
      name: '24-Hour Hackathon',
      category: 'Technical',
      type: 'team',
      price: '800 per team',
      teamSize: '2–4 Members',
      date: '18th – 19th Dec 2026',
      venue: 'CSE Advanced Computing Lab',
      prize: '₹30,000 First Prize, ₹14,000 Second Prize + Trophies',
      description: 'Flagship event — build something amazing in 24 hours of rapid innovation & coding. Solve challenges across AI, Web3, FinTech, and Open Innovation.',
      rules: [
        'Teams must consist of 2 to 4 members. Inter-college and inter-branch teams are fully permitted.',
        'All development, coding, and design must be executed strictly within the 24-hour hackathon window. Pre-built code is strictly prohibited (boilerplates, standard libraries, APIs, and frameworks are allowed).',
        'Teams must maintain a public GitHub repository and commit code regularly throughout the hackathon.',
        'Mentors will conduct 2 mandatory checkpoint evaluations (Checkpoint 1: Architecture & Progress at 8 hours; Checkpoint 2: Feature Freeze & Polish at 18 hours).',
        'Final presentations will consist of a 5-minute live working demo followed by a 3-minute Q&A with the industry jury panel.',
        'Plagiarism, pre-packaged templates, or unethical conduct will result in immediate disqualification without refund.'
      ],
      judging: [
        'Innovation & Novelty (25%)',
        'Technical Complexity & Architecture (25%)',
        'UI/UX & User Experience (20%)',
        'Practical Feasibility & Impact (15%)',
        'Live Demo & Pitch Quality (15%)'
      ]
    },
    {
      id: 'tech_quiz',
      name: 'TechQuiz',
      category: 'Technical',
      type: 'team',
      price: '300 per team',
      teamSize: '1–3 Members',
      date: '19th Dec 2026',
      venue: 'Seminar Hall 1',
      prize: '₹3,000 First Prize, ₹1,500 Second Prize + Certificates',
      description: 'Test your technical acumen, algorithmic thinking, and tech trivia against the sharpest minds across the region.',
      rules: [
        'Teams can consist of 1 to 3 participants.',
        'Round 1 (Written Prelims): 30 questions in 30 minutes covering CS fundamentals, tech history, algorithms, emerging tech, and logical reasoning. Top 6 teams qualify for finals.',
        'Round 2 (Stage Finals): Includes Audio-Visual rounds, Code Snippet Debugging, Buzzer rounds, and a Rapid Fire round.',
        'Negative marking applies during the Buzzer round (-5 points for each incorrect answer).',
        'Electronic devices (smartphones, smartwatches, calculators) are strictly prohibited during the competition.',
        'Quizmaster\'s decisions are final and incontrovertible.'
      ],
      judging: [
        'Prelims Score (Qualification)',
        'Final Stage Points Accumulation',
        'Buzzer Accuracy & Speed',
        'Sudden Death Tiebreaker (if required)'
      ]
    },
  ];

  const creativeEvents = [
    {
      id: 'open_mic',
      name: 'Open Mic',
      category: 'Creative',
      type: 'individual',
      price: '200 per individual',
      teamSize: 'Individual',
      date: '20th Dec 2026',
      venue: 'Open Air Amphitheatre',
      prize: 'Trophy, Certificate of Excellence & Spotlight Feature',
      description: 'Unleash your creativity and command the stage with spoken word, stand-up comedy, singing, poetry, beatboxing, or music.',
      rules: [
        'Individual solo performance only.',
        'Genres permitted: Poetry, Stand-up Comedy, Vocal/Instrumental Music, Beatboxing, Storytelling, or Monologue.',
        'Performance time limit is 4 to 6 minutes. A warning bell rings at 4 minutes; overtime beyond 6 minutes leads to deduction of marks.',
        'Backing tracks or accompaniment audio must be submitted to the stage coordinator on a USB drive 45 minutes prior to the event.',
        'Performers must bring their own instruments (standard acoustic guitar cable connection and mic provided).',
        'Strict adherence to decency: Content must not contain hate speech, discriminatory remarks, or vulgar language. Violators will be disqualified immediately.'
      ],
      judging: [
        'Stage Presence & Confidence (25%)',
        'Originality & Depth of Content (35%)',
        'Delivery, Voice Modulation & Rhythm (20%)',
        'Audience Impact & Engagement (20%)'
      ]
    },
    {
      id: 'mock_interview',
      name: 'Mock Interview',
      category: 'Creative',
      type: 'individual',
      price: '120 per individual',
      teamSize: 'Individual',
      date: '19th Dec 2026',
      venue: 'Training & Placement Cell, GNDEC',
      prize: '₹1,000 Cash Prize + Industry Feedback Scorecard & Certificate',
      description: 'Simulate high-stakes corporate HR and Technical interviews conducted by seasoned tech recruiters and corporate evaluators.',
      rules: [
        'Individual participation only. Open to students of all years and branches.',
        'Dress code: Formal business attire is mandatory.',
        'Participants must bring 2 hard copies of their Resume / CV and college ID card.',
        'Round 1 (Aptitude & Technical Screening): 20-minute multiple-choice and situational problem solving.',
        'Round 2 (Face-to-Face Interview): 15-minute 1-on-1 panel interview with HR and Technical evaluation, covering projects, behavioral scenarios, and problem solving.',
        'Every participant will receive a comprehensive personalized performance scorecard and constructive feedback report.'
      ],
      judging: [
        'Technical Domain Knowledge (30%)',
        'Communication & Articulation (25%)',
        'Problem Solving & Analytical Thinking (25%)',
        'Professional Demeanor & Resume Quality (20%)'
      ]
    },
    {
      id: 'photo_booth',
      name: 'Photo Booth Photo Contest',
      category: 'Creative',
      type: 'individual',
      price: '79 per entry',
      teamSize: 'Max 3 entries / person',
      date: '18th – 20th Dec 2026',
      venue: 'Spectrum Photo Booth & GNDEC Campus',
      prize: '₹1,000 Prize Pool + Feature in Official Fest Aftermovie & Exhibition',
      description: 'Capture the essence, aesthetics, and energy of Spectrum 1.0 through your lens. Showcase framing, perspective, and visual storytelling.',
      rules: [
        'Each registration allows submission of 1 photograph (participants may register up to 3 entries at ₹79 each).',
        'All photographs must be captured during the days of Spectrum 1.0 (Dec 18–20, 2026) within the GNDEC campus or at the official themed photo booth.',
        'Submissions from both smartphones and DSLRs / Mirrorless cameras are welcome.',
        'Basic adjustments (contrast, brightness, cropping, color grading) are permitted. Generative AI fills, excessive filters, or digital manipulation are strictly prohibited.',
        'Photographs must be submitted in high-resolution JPG/PNG format with EXIF metadata intact via the submission portal before Dec 20, 3:00 PM.',
        'Entries will be showcased in the Spectrum Art Gallery and judged by professional guest photographers.'
      ],
      judging: [
        'Composition & Framing (30%)',
        'Creativity & Originality (25%)',
        'Lighting & Technical Quality (25%)',
        'Theme Relevance & Storytelling (20%)'
      ]
    },
  ];

  const gamesEvents = [
    {
      id: 'bgmi',
      name: 'BGMI Tournament',
      category: 'Games & Fun',
      type: 'team',
      price: '400 per squad',
      teamSize: '4 Members (Squad)',
      date: '19th Dec 2026',
      venue: 'Esports Arena / CC Lab 2',
      prize: '₹4,000 First Prize, ₹2,000 Second Prize + Trophies',
      description: 'Squad-based competitive Battlegrounds Mobile India showdown. Strategize, survive, and dominate the battlegrounds.',
      rules: [
        'Squad format (4 players per team; 1 optional substitute registered in advance).',
        'Strictly Mobile Devices Only: Tablets, iPads, triggers, emulators, or Bluetooth controllers are strictly barred. Devices will be physically inspected before matches.',
        'Tournament maps: Erangel, Miramar, and Sanhok (Classic Battle Royale mode).',
        'Official BGIS Scoring Matrix: 1 point per kill + placement points (1st: 10 pts, 2nd: 6 pts, 3rd: 5 pts, 4th: 4 pts, 5th: 3 pts, 6th: 2 pts, 7th-8th: 1 pt).',
        'Use of hacks, config files, third-party textures, glitches, or teaming up with opposing squads will result in instant disqualification and permanent ban.',
        'Players must bring their own charged devices, earphones, and mobile data (backup Wi-Fi will be provided). Custom room credentials will be shared 15 minutes before the match.'
      ],
      judging: [
        'Total Overall Match Points (Placement + Kill points)',
        'Tiebreaker 1: Total Finish / Kill Points',
        'Tiebreaker 2: Total Chicken Dinners Won'
      ]
    },
    {
      id: 'free_fire',
      name: 'Free Fire Tournament',
      category: 'Games & Fun',
      type: 'team',
      price: '400 per squad',
      teamSize: '4 Members (Squad)',
      date: '19th Dec 2026',
      venue: 'Esports Arena / CC Lab 3',
      prize: '₹4,000 First Prize, ₹2,000 Second Prize + Trophies',
      description: 'High-octane mobile battle royale. Fast-paced squad combat where reflex, team coordination, and survival instincts crown the ultimate champions.',
      rules: [
        'Squad format (4 players per squad).',
        'Mobile phones only: No PC, emulators, iPad, macros, or external hardware triggers permitted.',
        'Maps: Bermuda, Purgatory, and Kalahari.',
        'Standard competitive settings: Gun attributes ON/OFF as per official FFIC esports guidelines. Character skills allowed.',
        'Point distribution: 1 point per kill + placement points (1st: 12 pts, 2nd: 9 pts, 3rd: 8 pts, 4th: 7 pts, 5th: 6 pts, etc.).',
        'Any use of modified APKs, speed boosters, or toxic/unsportsmanlike conduct in lobby or voice chat will trigger instant disqualification without refund.'
      ],
      judging: [
        'Cumulative Match Score (Kill Points + Placement Points)',
        'Tiebreaker 1: Cumulative Kill Points across all maps',
        'Tiebreaker 2: Best Single Match Placement'
      ]
    },
  ];

  const ContainerTag = isEmbedded ? 'section' : 'main';

  return (
    <ContainerTag id="events" className={isEmbedded ? 'section-container' : 'content-layer'}>
      
      {!isEmbedded && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="hero-title responsive-hero-title" style={{ marginBottom: '1rem' }}>
            THE <span className="text-gradient">GRAND</span> TRIALS
          </h1>
          <p style={{ color: 'var(--color-star-white)', opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Choose your battlefield. Test your skills against the greatest minds across technical mastery, creative vision, and martial wit at Spectrum 1.0.
          </p>
        </motion.div>
      )}

      <EventCategory
        title="Technical Events"
        events={technicalEvents}
        delay={0.2}
        onOpenRules={(event) => setSelectedRuleEvent(event)}
      />
      <EventCategory
        title="Creative Events"
        events={creativeEvents}
        delay={0.4}
        onOpenRules={(event) => setSelectedRuleEvent(event)}
      />
      <EventCategory
        title="Games & Fun"
        events={gamesEvents}
        delay={0.6}
        onOpenRules={(event) => setSelectedRuleEvent(event)}
      />

      {/* Event Rules Modal */}
      <AnimatePresence>
        {selectedRuleEvent && (
          <EventRulesModal
            key="rules-modal"
            event={selectedRuleEvent}
            onClose={() => setSelectedRuleEvent(null)}
            onRegister={handleRegisterFromRules}
          />
        )}
      </AnimatePresence>

      {/* Registration Modals triggered from Rules */}
      <AnimatePresence>
        {showIndividualModal && (
          <IndividualRegModal
            key="ind-reg-modal"
            initialEventId={targetEventId}
            onClose={() => {
              setShowIndividualModal(false);
              setTargetEventId(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeamModal && (
          <TeamRegModal
            key="team-reg-modal"
            initialEventId={targetEventId}
            onClose={() => {
              setShowTeamModal(false);
              setTargetEventId(null);
            }}
          />
        )}
      </AnimatePresence>
      
    </ContainerTag>
  );
};

export default EventsPage;
