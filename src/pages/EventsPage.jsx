import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import TeamRegModal from '../components/sections/TeamRegModal';
import { Calendar, Users, Eye } from 'lucide-react';
import EventRulesModal from '../components/EventRulesModal';
import AddToCalendarButton from '../components/AddToCalendarButton';

// Robust helper to ensure clean Indian Rupee symbol formatting
const formatPrice = (price) => {
  if (!price) return 'Free';
  const str = String(price).trim();
  if (str.toLowerCase().includes('free')) return 'Free';
  // Strip any existing rupee symbol, mojibake, or question marks
  const cleaned = str.replace(/^[â‚¹?\s]+/, '').replace(/^₹\s*/, '');
  return `₹${cleaned}`;
};

// Set to true to reveal all fest events (TechQuiz, Photography, Games)
const SHOW_ALL_EVENTS = false;

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
            <GlassCard style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h3 className="text-xl font-bold uppercase" style={{ color: 'var(--color-star-white)', letterSpacing: '0.05em', wordBreak: 'break-word', flex: '1 1 180px' }}>
                  {event.name}
                </h3>
                <span style={{ border: '1px solid var(--color-neon-cyan)', backgroundColor: 'transparent', color: 'var(--color-neon-cyan)', fontWeight: 'bold', padding: '0.2rem 0.8rem', borderRadius: '4px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                  {formatPrice(event.price)}
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-6 flex-grow" style={{ color: 'rgba(244, 234, 204, 0.7)' }}>
                {event.description}
              </p>

              <div className="text-sm mb-6" style={{ color: 'var(--color-star-white)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} color="var(--color-neon-cyan)" />
                  <span style={{ opacity: 0.8 }}>{event.date || 'Dec 8 – 10, 2026'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} color="var(--color-neon-cyan)" />
                  <span style={{ opacity: 0.8 }}>Team Size: {event.teamSize}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  id={`rules-btn-${event.id}`}
                  onClick={() => onOpenRules(event)}
                  className="w-full py-3 transition-all duration-300"
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

                <AddToCalendarButton event={event} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const EventsPage = ({ isEmbedded = false }) => {
  const [selectedRuleEvent, setSelectedRuleEvent] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  

  useEffect(() => {
    if (!isEmbedded) {
      window.scrollTo(0, 0);
    }
  }, [isEmbedded]);

  
  const technicalEvents = [
    {
      id: 'hackathon',
      name: '24-Hour Hackathon',
      category: 'Technical',
      type: 'team',
      price: '₹500 per team',
      teamSize: '2 to 4 Members',
      date: '9th to 10th Dec 2026',
      venue: 'CSE Advanced Computing Lab',
      prize: '₹40,000',
      description: 'Flagship event — build something amazing in 24 hours of rapid innovation & coding. Kickoff at 12:00 PM on 9 Dec, Evaluation at 12:30 PM on 10 Dec. College-provided lunch, dinner, breakfast & accommodation included.',
      rules: [
        'Teams must consist of 2 to 4 members. Inter-college and inter-branch teams are fully permitted.',
        'Mandatory Day 2 Deadlines: ID card distribution closes at 11:00 AM sharp. Problem statement submission window is 11:00 AM – 1:00 PM (no submissions accepted after 1:00 PM).',
        'Official 24-hour hackathon begins at 12:00 PM on 9 December 2026. All code and design must be created within this window (standard libraries, APIs & boilerplates allowed).',
        'Teams must maintain a public GitHub repository and commit code regularly throughout the hackathon.',
        'Mentors will conduct 2 mandatory checkpoint evaluations (Checkpoint 1: Architecture & Progress at 8 hours; Checkpoint 2: Feature Freeze & Polish at 18 hours).',
        'Final presentations & parallel theme project evaluation will be conducted at 12:30 PM on 10 December before the Grand Closing Ceremony.',
        'Complimentary meals (Lunch & Dinner on 9 Dec, Breakfast on 10 Dec) and accommodation are arranged by the college.',
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
      price: '₹300 per team',
      teamSize: '1 to 3 Members',
      date: '8th Dec 2026 (R1: 1:00 PM | R2: 4:00 PM)',
      venue: 'Seminar Hall 1',
      prize: 'Revealing Soon',
      description: 'Test your technical acumen, algorithmic thinking, and tech trivia against the sharpest minds across the region.',
      rules: [
        'Teams can consist of 1 to 3 participants.',
        'Round 1 (Written Prelims): 1:00 PM – 2:00 PM on 8 Dec. 30 questions covering CS fundamentals, logic, algorithms, and emerging tech. Top teams qualify for stage finals.',
        'Round 2 (Stage Finals): 4:00 PM – 5:00 PM on 8 Dec. Live buzzer rounds, audio-visual rounds, code debugging, and rapid fire on the main stage.',
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
      id: 'photo_booth',
      name: 'Photography',
      category: 'Creative',
      type: 'individual',
      price: '₹100 per entry',
      teamSize: 'Max 3 entries / person',
      date: '8th to 10th Dec 2026',
      venue: 'Spectrum Photo Booth & GNDEC Campus',
      prize: 'Revealing Soon',
      description: 'Capture the essence, aesthetics, and energy of Spectrum 1.0 through your lens. Showcase framing, perspective, and visual storytelling.',
      rules: [
        'Each registration allows submission of 1 photograph (participants may register up to 3 entries at ₹100 each).',
        'All photographs must be captured during the days of Spectrum 1.0 (Dec 8–10, 2026) within the GNDEC campus or at the official themed photo booth.',
        'Special Announcement: The official Google Drive submission link will be shared on 10 December 2026 at 12:00 PM. Participants must submit their photographs using the provided link.',
        'Submissions from both smartphones and DSLRs / Mirrorless cameras are welcome.',
        'Basic adjustments (contrast, brightness, cropping, color grading) are permitted. Generative AI fills or manipulative digital filters are prohibited.',
        'Entries will be showcased in the Spectrum Art Gallery and judged by professional guest photographers.'
      ],
      judging: [
        'Composition & Framing (30%)',
        'Creativity & Originality (25%)',
        'Lighting & Technical Quality (25%)',
        'Theme Relevance & Storytelling (20%)'
      ]
    },
    {
      id: 'impossible_to_sell',
      name: 'Impossible to Sell',
      category: 'Creative',
      type: 'individual',
      price: '₹100 per entry',
      teamSize: 'Individual or Duo',
      date: '8th Dec 2026 (2:00 PM – 4:00 PM)',
      venue: 'Main Stage / Seminar Hall 2',
      prize: 'Revealing Soon',
      description: 'A high-voltage creative selling challenge where participants put their persuasion, wit, and salesmanship to the test by pitching an unusual, absurd, or notoriously difficult-to-sell product or concept.',
      rules: [
        'Participants may compete solo or as a duo (2 members).',
        'Each participant or team will be given an unusual, absurd, or difficult-to-sell item or concept on the spot.',
        'Preparation time: 3 minutes. Live pitch duration: 3 to 4 minutes on stage.',
        'Humor, creative storytelling, innovative value propositions, and sharp persuasion tactics are highly encouraged.',
        'Vulgar, offensive, or disparaging language will result in immediate disqualification.'
      ],
      judging: [
        'Creativity & Originality of the Pitch (30%)',
        'Persuasiveness & Storytelling (25%)',
        'Humor, Wit & Audience Engagement (25%)',
        'Spontaneous Objection Handling (20%)'
      ]
    },
  ];

  const gamesEvents = [
    {
      id: 'bgmi',
      name: 'BGMI Tournament',
      category: 'Games & Fun',
      type: 'team',
      price: '₹400 per squad',
      teamSize: '4 Members (Squad)',
      date: '8th Dec 2026 (9:00 AM – 11:00 AM)',
      venue: 'Esports Arena / CC Lab 2',
      prize: 'Revealing Soon',
      description: 'Competitive squad-based Battlegrounds Mobile India showdown. Runs in parallel with the Free Fire Tournament from 9:00 AM to 11:00 AM on Day 1.',
      rules: [
        'Squad format (4 players per team; 1 optional substitute registered in advance).',
        'Runs in parallel with Free Fire Tournament (9:00 AM – 11:00 AM on 8 Dec).',
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
      price: '₹400 per squad',
      teamSize: '4 Members (Squad)',
      date: '8th Dec 2026 (9:00 AM – 11:00 AM)',
      venue: 'Esports Arena / CC Lab 3',
      prize: 'Revealing Soon',
      description: 'High-octane mobile squad battle royale. Runs in parallel with the BGMI Tournament from 9:00 AM to 11:00 AM on Day 1.',
      rules: [
        'Squad format (4 players per squad).',
        'Runs in parallel with BGMI Tournament (9:00 AM – 11:00 AM on 8 Dec).',
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
    {
      id: 'treasure_hunt',
      name: 'Treasure Hunt',
      category: 'Games & Fun',
      type: 'team',
      price: '₹600 per team',
      teamSize: '1 to 4 Members',
      date: '8th Dec 2026 (11:30 AM – 1:00 PM)',
      venue: 'GNDEC Campus Grounds',
      prize: 'Revealing Soon',
      description: 'An exhilarating campus-wide mystery quest! Crack cryptic clues, solve riddles, navigate hidden checkpoints, and race against fellow seekers. Strictly ends at 1:00 PM.',
      rules: [
        'Teams must consist of 1 to 4 members. Inter-college and inter-branch teams are permitted.',
        'Scheduled on Day 1 from 11:30 AM to 1:00 PM sharp.',
        'All teams must report to the starting point together for briefing and collecting their initial clue.',
        'Clues must be discovered and solved strictly in sequential order. Checkpoint marshals will verify each step before handing out the next clue.',
        'Physical tampering with clues, sabotaging other squads, or accessing restricted campus areas will result in instant disqualification.',
        'Motorized vehicles of any kind are strictly prohibited during the hunt.',
        'The first squad to crack the final puzzle and deliver the treasure to the finish desk claims victory.'
      ],
      judging: [
        'Order of completion with all verified checkpoints',
        'Total completion time',
        'Strict adherence to game boundaries and fair play'
      ]
    },
    {
      id: 'killer_game',
      name: 'Killer Game',
      category: 'Games & Fun',
      type: 'individual',
      price: '₹50 per player',
      teamSize: 'Individual',
      date: '8th Dec 2026 (1:00 PM – 2:00 PM)',
      venue: 'Campus Ground / Open Lawn',
      prize: 'Revealing Soon',
      description: 'An exhilarating social deduction and stealth mystery elimination challenge of strategy, deception, and razor-sharp survival instincts. Runs in parallel with TechQuiz Round 1.',
      rules: [
        'Individual solo participation.',
        'Runs during the 1:00 PM – 2:00 PM time slot on Day 1.',
        'Each player secretly receives a target identity and a secret elimination condition.',
        'Eliminations must be performed stealthily without any third-party witnesses.',
        'Physical aggression, foul play, or trespassing in restricted college areas is strictly prohibited.',
        'Players with the highest number of confirmed eliminations and surviving finalists claim victory.'
      ],
      judging: [
        'Total Confirmed Eliminations',
        'Survival Time & Stealth Execution'
      ]
    },
  ];

  const ContainerTag = isEmbedded ? 'section' : 'main';

  return (
    <ContainerTag id="events" className={isEmbedded ? 'section-container' : 'content-layer'} style={!isEmbedded ? { paddingTop: 'calc(var(--nav-height) + 2rem)' } : undefined}>

      {!isEmbedded && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
          style={{ padding: '0 1rem' }}
        >
          <h1 className="hero-title responsive-hero-title" style={{ marginBottom: '1rem' }}>
            THE <span className="text-gradient">GRAND</span> TRIALS
          </h1>
          <p style={{ color: 'var(--color-star-white)', opacity: 0.7, maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Choose your battlefield. Test your skills against the greatest minds across technical mastery, creative vision, and martial wit at Spectrum 1.0.
          </p>
        </motion.div>
      )}

      {!SHOW_ALL_EVENTS ? (
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto 5rem auto', padding: '0 1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="section-title text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.1em' }}>
              Technical Events
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
            <GlassCard style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 3.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'inline-block', padding: '0.35rem 1rem', background: 'rgba(211, 47, 47, 0.15)', border: '1px solid rgba(211, 47, 47, 0.4)', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.12em', color: 'var(--color-bright-crimson)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  Flagship Technical Event
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', letterSpacing: '0.05em' }}>
                  Hackathon Participation
                </h2>
                
                <p className="mb-6 font-light leading-relaxed max-w-xl" style={{ color: 'rgba(244, 234, 204, 0.8)', fontSize: '1rem', minHeight: '3rem' }}>
                  Register your team for the flagship 24-Hour Hackathon. Build breakthrough solutions, collaborate with peers, and compete for victory.
                </p>

                {/* Highlights Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', width: '100%', marginBottom: '2.25rem', textAlign: 'left' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Prize Pool</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>₹40,000</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Cash prizes + trophies</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Team Size</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>2 – 4 Members</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Inter-college welcome</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 234, 204, 0.15)', borderRadius: '6px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}>Registration Fee</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-bright-crimson)', fontFamily: 'var(--font-heading)', marginTop: '0.2rem' }}>₹500 / Team</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.6)' }}>Stay & meals included</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '380px' }}>
                  <NeonButton
                    id="events-hackathon-register-btn"
                    type="button"
                    style={{ width: '100%', padding: '1rem 2rem', fontSize: '1rem' }}
                    onClick={() => setShowTeamModal(true)}
                  >
                    REGISTER FOR HACKATHON
                  </NeonButton>

                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <button
                      id="events-hackathon-rules-btn"
                      onClick={() => setSelectedRuleEvent(technicalEvents[0])}
                      style={{
                        flex: 1,
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        border: '1px solid var(--color-neon-cyan)',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        color: 'var(--color-star-white)',
                        fontFamily: 'var(--font-primary)',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.15)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Eye size={16} />
                      Rules & Details
                    </button>

                    <div style={{ flex: 1 }}>
                      <AddToCalendarButton event={technicalEvents[0]} variant="compact" />
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      ) : (
        <>
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
        </>
      )}

      {/* Modals portalled to document.body so they stay above all stacking contexts */}
      {typeof document !== 'undefined' && createPortal(
        <>
          <AnimatePresence>
            {selectedRuleEvent && (
              <EventRulesModal
                key="rules-modal"
                event={selectedRuleEvent}
                onClose={() => setSelectedRuleEvent(null)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showTeamModal && (
              <TeamRegModal
                key="hackathon-modal"
                initialEventId="hackathon"
                onClose={() => setShowTeamModal(false)}
              />
            )}
          </AnimatePresence>
        </>,
        document.body
      )}

    </ContainerTag>
  );
};

export default EventsPage;
