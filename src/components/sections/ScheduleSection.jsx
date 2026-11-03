import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Sparkles,
  Utensils,
  AlertTriangle,
  Trophy,
  Flame,
  Gamepad2,
  FileText,
  Users,
  CheckCircle2,
  Award,
  Music,
  MapPin,
  HelpCircle,
  Building,
  Camera,
  Target,
  Megaphone,
  Share2
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const scheduleData = [
  {
    dayId: 'day1',
    dayNumber: 'DAY 1',
    dayName: 'Monday',
    date: '7 December 2026',
    title: 'Opening Events and Competitions',
    subtitle: 'High-energy esports, creative challenges, quizzes, and campus-wide quests',
    items: [
      {
        time: '9:00 AM – 11:00 AM',
        title: 'BGMI Tournament',
        details: 'Competitive squad battle royale. Runs in parallel with the Free Fire Tournament.',
        category: 'Esports',
        icon: Gamepad2,
        badge: 'Parallel Track',
        highlight: true,
      },
      {
        time: '9:00 AM – 11:00 AM',
        title: 'Free Fire Tournament',
        details: 'Fast-paced squad survival combat. Runs in parallel with the BGMI Tournament.',
        category: 'Esports',
        icon: Gamepad2,
        badge: 'Parallel Track',
        highlight: true,
      },
      {
        time: '11:00 AM – 11:30 AM',
        title: 'Official SPECTRUM 1.0 Poster Reveal',
        details: 'Grand inaugural ceremony and official festival poster unveiling.',
        category: 'Inaugural',
        icon: Sparkles,
        badge: 'Ceremony',
      },
      {
        time: '11:30 AM – 1:00 PM',
        title: 'Treasure Hunt',
        details: 'Campus-wide mystery quest and riddle-solving challenge. Strictly concludes at 1:00 PM.',
        category: 'Games & Fun',
        icon: MapPin,
        badge: 'Ends 1:00 PM',
        highlight: true,
      },
      {
        time: '1:00 PM – 2:00 PM',
        title: 'TechQuiz — Round 1 (Prelims)',
        details: 'Written screening test on CS fundamentals, logic, algorithms, and tech trivia.',
        category: 'Technical',
        icon: HelpCircle,
        badge: 'Prelims',
      },
      {
        time: '1:00 PM – 2:00 PM',
        title: 'Killer Game',
        details: 'Social deduction and stealth elimination game. Runs in the same time window as TechQuiz Round 1.',
        category: 'Games & Fun',
        icon: Target,
        badge: 'Parallel Session',
      },
      {
        time: '2:00 PM – 4:00 PM',
        title: 'Impossible to Sell',
        details: 'Creative selling challenge where participants pitch and sell an unusual or difficult-to-sell product or concept.',
        category: 'Creative',
        icon: Megaphone,
        badge: 'Creative Pitch',
        highlight: true,
      },
      {
        time: '4:00 PM – 5:00 PM',
        title: 'TechQuiz — Round 2 (Stage Finals)',
        details: 'Grand buzzer and audio-visual finale on stage for the top qualified teams.',
        category: 'Technical',
        icon: Trophy,
        badge: 'Stage Finals',
      },
    ],
  },
  {
    dayId: 'day2',
    dayNumber: 'DAY 2',
    dayName: 'Tuesday',
    date: '8 December 2026',
    title: '24-Hour Hackathon Launch',
    subtitle: 'Official hackathon commencement, checkpoints & round-the-clock sprint',
    notice: {
      type: 'critical',
      title: 'Mandatory Hackathon Deadlines — 8 December 2026',
      points: [
        'ID Card Distribution: 9:00 AM – 11:00 AM strictly. Desk closes at 11:00 AM sharp.',
        'Problem Statement Submission: 11:00 AM – 1:00 PM. No submissions accepted after 1:00 PM.',
        'Hackathon food (Lunch, Dinner) and accommodation will be provided by the college.',
      ],
    },
    items: [
      {
        time: '9:00 AM – 11:00 AM',
        title: 'ID Card Distribution',
        details: 'Participants must collect their physical participant ID cards within this time window. Distribution closes at 11:00 AM.',
        category: 'Crucial Deadline',
        icon: AlertTriangle,
        badge: 'Closes 11:00 AM',
        deadline: true,
      },
      {
        time: '11:00 AM – 1:00 PM',
        title: 'Problem Statement Submission Window',
        details: 'Teams must submit their selected problem statements. Strictly no submissions accepted after 1:00 PM.',
        category: 'Crucial Deadline',
        icon: FileText,
        badge: 'Closes 1:00 PM',
        deadline: true,
      },
      {
        time: '12:00 PM',
        title: '24-Hour Hackathon Officially Begins',
        details: 'Flagship 24-hour coding sprint kicks off! 24 hours of rapid innovation, building, and mentorship.',
        category: 'Flagship Event',
        icon: Flame,
        badge: '24-Hour Sprint',
        highlight: true,
      },
      {
        time: '2:00 PM – 3:00 PM',
        title: 'Lunch',
        details: 'Lunch arranged by the college for hackathon participants.',
        category: 'Meal',
        icon: Utensils,
        badge: 'Provided by College',
        meal: true,
      },
      {
        time: '8:00 PM – 9:30 PM',
        title: 'Dinner',
        details: 'Dinner served for all hackathon developers and team members.',
        category: 'Meal',
        icon: Utensils,
        badge: 'Provided by College',
        meal: true,
      },
      {
        time: '10:00 PM – 11:00 PM',
        title: 'Entertainment Activity',
        details: 'Engaging, fun breather session to refresh energy during the overnight sprint.',
        category: 'Recreation',
        icon: Sparkles,
        badge: 'Fun Activity',
      },
    ],
  },
  {
    dayId: 'day3',
    dayNumber: 'DAY 3',
    dayName: 'Wednesday',
    date: '9 December 2026',
    title: 'Hackathon Evaluation and Grand Closing Ceremony',
    subtitle: 'Project jury evaluations, cultural performances, dignitary addresses & prize distribution',
    specialAnnouncement: {
      title: 'Special Announcement — Photography Submission',
      desc: 'The official Google Drive submission link will be shared on 9 December 2026 at 12:00 PM. Please keep your event photographs ready and submit them using the provided link once it is shared.',
    },
    ceremonyProtocol: [
      { step: '1', role: 'Jury Members', desc: 'Addresses & insights by distinguished industry jury members' },
      { step: '2', role: 'Respected VCP Ma’am', desc: 'Keynote address by the respected Vice Chairperson' },
      { step: '3', role: 'HOD, CSE (AI & ML)', desc: 'Official address by Head of Department, CSE (AI & ML)' },
      { step: '4', role: 'Overall Team Lead', desc: 'Vote of thanks to college authorities, faculty, jury, participants, volunteers & organizers' },
    ],
    items: [
      {
        time: '8:00 AM – 9:00 AM',
        title: 'Breakfast',
        details: 'Morning breakfast provided by the college for hackathon developers.',
        category: 'Meal',
        icon: Utensils,
        badge: 'Provided by College',
        meal: true,
      },
      {
        time: '12:00 PM',
        title: 'Photography Submission Link Shared',
        details: 'Official Google Drive submission link shared by the organizing team to submit event photographs.',
        category: 'Submission',
        icon: Camera,
        badge: 'Google Drive Link',
        highlight: true,
      },
      {
        time: '12:30 PM – 1:30 PM',
        title: 'Evaluation of Projects',
        details: 'Conducted across different themes in parallel by the industry expert jury panel.',
        category: 'Evaluation',
        icon: CheckCircle2,
        badge: 'Parallel Panels',
        highlight: true,
      },
      {
        time: '2:00 PM',
        title: 'Grand Closing Ceremony Begins',
        details: 'Official commencement of the final closing assembly.',
        category: 'Ceremony',
        icon: Sparkles,
        badge: 'Commencement',
      },
      {
        time: '2:00 PM – 3:00 PM',
        title: 'Dance Performances & Scheduled Performances',
        details: 'Vibrant cultural performances and artistic showcases as part of the grand closing ceremony.',
        category: 'Cultural',
        icon: Music,
        badge: 'Main Stage',
      },
      {
        time: '3:00 PM – 4:00 PM',
        title: 'Dignitary Speeches & Formal Addresses',
        details: 'Keynote addresses in formal protocol: (1) Jury Members → (2) Respected VCP Ma’am → (3) HOD, CSE (AI & ML) → (4) Overall Team Lead vote of thanks.',
        category: 'Ceremony',
        icon: Users,
        badge: 'Keynote Sequence',
      },
      {
        time: '4:00 PM – 5:00 PM',
        title: 'Prize Distribution & Formal Conclusion',
        details: 'Awarding cash prizes, trophies, and certificates to winners. Official conclusion of SPECTRUM 1.0.',
        category: 'Awards',
        icon: Award,
        badge: 'Trophies & Cash',
        highlight: true,
      },
    ],
  },
];

const generalGuidelines = [
  {
    icon: AlertTriangle,
    title: 'Crucial Deadlines (8 Dec)',
    description: 'ID card distribution: 9:00 AM – 11:00 AM strictly. Problem statement submission: 11:00 AM – 1:00 PM. No submissions accepted after 1:00 PM.',
  },
  {
    icon: Camera,
    title: 'Photography Submission (9 Dec)',
    description: 'The official Google Drive submission link will be shared on 9 December at 12:00 PM. Keep your photos ready to submit via the provided link.',
  },
  {
    icon: Utensils,
    title: 'Meals Provided by College',
    description: 'All meals marked “Provided by the College” (Day 2 Lunch & Dinner, Day 3 Breakfast) are arranged by GNDEC free of charge for participants.',
  },
  {
    icon: Building,
    title: 'Accommodation Facilities',
    description: 'Food and accommodation for the 24-hour hackathon will be arranged and provided on campus by the college.',
  },
  {
    icon: Gamepad2,
    title: 'Parallel Event Tracks',
    description: 'Day 1: BGMI & Free Fire (9–11 AM) and TechQuiz R1 & Killer Game (1–2 PM) run in parallel. Day 3: Theme evaluations run simultaneously.',
  },
];

const ScheduleSection = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredDays =
    activeTab === 'all'
      ? scheduleData
      : scheduleData.filter((d) => d.dayId === activeTab);

  return (
    <section id="schedule" className="section-container schedule-section" style={{ minHeight: 'auto', padding: '5rem 1rem 4rem 1rem' }}>
      <div className="schedule-content" style={{ width: '100%', maxWidth: '1150px', margin: '0 auto' }}>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="rules-header"
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Calendar size={18} color="var(--color-neon-cyan)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-neon-cyan)', fontWeight: 700 }}>
              Official Event Schedule (Revised) • 7–9 December 2026
            </span>
          </div>

          <h2 className="rules-title section-title">
            <span className="text-gradient">EVENT</span> SCHEDULE
          </h2>
          <div className="rules-divider" style={{ margin: '1rem auto' }}></div>
          <p style={{ color: 'rgba(244, 234, 204, 0.75)', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', maxWidth: '780px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Organized by the Departments of <strong style={{ color: 'var(--color-star-white)' }}>CSE (Data Science)</strong> and <strong style={{ color: 'var(--color-star-white)' }}>CSE (AI & ML)</strong>, Guru Nanak Dev Engineering College (GNDEC), Bidar.
          </p>
        </motion.div>

        {/* Interactive Tab Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
        >
          {[
            { id: 'all', label: 'ALL DAYS' },
            { id: 'day1', label: 'DAY 1 • 7 DEC', sub: 'Opening & Competitions' },
            { id: 'day2', label: 'DAY 2 • 8 DEC', sub: '24-Hour Hackathon' },
            { id: 'day3', label: 'DAY 3 • 9 DEC', sub: 'Evaluation & Closing' },
            { id: 'guidelines', label: 'GUIDELINES', sub: 'Deadlines & Notes' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'var(--color-neon-cyan)' : 'rgba(18, 18, 18, 0.85)',
                  color: isActive ? 'var(--color-space-black)' : 'var(--color-star-white)',
                  border: `1px solid ${isActive ? 'var(--color-neon-cyan)' : 'rgba(211, 47, 47, 0.35)'}`,
                  padding: '0.65rem 1.25rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isActive ? '0 0 16px rgba(211, 47, 47, 0.5)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '130px',
                }}
              >
                <span>{tab.label}</span>
                {tab.sub && (
                  <span style={{ fontSize: '0.68rem', opacity: isActive ? 0.9 : 0.6, fontWeight: 500, marginTop: '2px', letterSpacing: '0.04em' }}>
                    {tab.sub}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Guidelines View */}
        {activeTab === 'guidelines' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ marginBottom: '2rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {generalGuidelines.map((g, idx) => {
                const Icon = g.icon;
                return (
                  <GlassCard key={idx} style={{ padding: '1.75rem', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '4px',
                        background: 'rgba(211, 47, 47, 0.15)',
                        border: '1px solid var(--color-neon-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-neon-cyan)',
                      }}>
                        <Icon size={20} />
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-star-white)', fontSize: '1.05rem', margin: 0 }}>
                        {g.title}
                      </h4>
                    </div>
                    <p style={{ color: 'rgba(244, 234, 204, 0.78)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                      {g.description}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Days Timetable */}
        {activeTab !== 'guidelines' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {filteredDays.map((day, dIdx) => (
              <motion.div
                key={day.dayId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: dIdx * 0.1 }}
                style={{
                  background: 'rgba(12, 12, 14, 0.85)',
                  border: '1px solid rgba(211, 47, 47, 0.4)',
                  borderRadius: '6px',
                  boxShadow: '4px 4px 0px 0px rgba(211, 47, 47, 0.75)',
                  overflow: 'hidden',
                }}
              >
                {/* Day Header Banner */}
                <div
                  style={{
                    background: 'linear-gradient(90deg, rgba(211, 47, 47, 0.22) 0%, rgba(8, 8, 8, 0.95) 100%)',
                    borderBottom: '2px solid var(--color-neon-cyan)',
                    padding: '1.25rem 1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{
                      background: 'var(--color-neon-cyan)',
                      color: 'var(--color-space-black)',
                      fontWeight: 800,
                      fontFamily: 'var(--font-heading)',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '3px',
                      fontSize: '0.85rem',
                      letterSpacing: '0.12em',
                    }}>
                      {day.dayNumber}
                    </div>

                    <div>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--color-star-white)',
                        fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)',
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: '0.05em',
                      }}>
                        {day.dayName}, {day.date}
                      </h3>
                      <p style={{
                        color: 'var(--color-neon-cyan)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        margin: '0.2rem 0 0 0',
                        letterSpacing: '0.04em',
                      }}>
                        {day.title}
                      </p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.8rem',
                    color: 'rgba(244, 234, 204, 0.65)',
                    fontStyle: 'italic',
                  }}>
                    {day.subtitle}
                  </span>
                </div>

                {/* Day 2 Crucial Notice Callout */}
                {day.notice && (
                  <div
                    style={{
                      background: 'rgba(211, 47, 47, 0.1)',
                      borderBottom: '1px solid rgba(211, 47, 47, 0.35)',
                      padding: '1rem 1.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                    }}
                  >
                    <AlertTriangle size={22} color="var(--color-neon-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h5 style={{ color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-heading)', fontSize: '0.9rem', margin: '0 0 0.35rem 0', letterSpacing: '0.06em' }}>
                        {day.notice.title}
                      </h5>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'rgba(244, 234, 204, 0.88)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {day.notice.points.map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Day 3 Special Announcement Callout */}
                {day.specialAnnouncement && (
                  <div
                    style={{
                      background: 'linear-gradient(90deg, rgba(211, 47, 47, 0.15) 0%, rgba(255, 179, 0, 0.08) 100%)',
                      borderBottom: '1px solid rgba(211, 47, 47, 0.4)',
                      padding: '1rem 1.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                    }}
                  >
                    <Camera size={22} color="var(--color-neon-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h5 style={{ color: 'var(--color-star-white)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', margin: '0 0 0.25rem 0', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-neon-cyan)', fontWeight: 800 }}>[SPECIAL ANNOUNCEMENT]</span> {day.specialAnnouncement.title}
                      </h5>
                      <p style={{ margin: 0, color: 'rgba(244, 234, 204, 0.85)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                        {day.specialAnnouncement.desc}
                      </p>
                    </div>
                  </div>
                )}

                {/* Timetable Items */}
                <div style={{ padding: '0.75rem 1rem' }}>
                  {day.items.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'minmax(140px, 190px) 1fr auto',
                          gap: '1rem',
                          alignItems: 'center',
                          padding: '1rem 1rem',
                          borderBottom: idx < day.items.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                          background: item.highlight
                            ? 'rgba(211, 47, 47, 0.07)'
                            : item.deadline
                            ? 'rgba(211, 47, 47, 0.04)'
                            : 'transparent',
                          borderLeft: item.highlight
                            ? '3px solid var(--color-neon-cyan)'
                            : item.deadline
                            ? '3px solid #ff9800'
                            : item.meal
                            ? '3px solid #4caf50'
                            : '3px solid transparent',
                          borderRadius: '2px',
                          transition: 'background 0.2s ease',
                        }}
                        className="timetable-row"
                      >
                        {/* Time */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={16} color="var(--color-neon-cyan)" style={{ flexShrink: 0 }} />
                          <span style={{
                            fontFamily: 'var(--font-heading)',
                            color: 'var(--color-star-white)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            whiteSpace: 'nowrap',
                          }}>
                            {item.time}
                          </span>
                        </div>

                        {/* Title & Details */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                            <span style={{
                              fontFamily: 'var(--font-heading)',
                              color: item.highlight ? 'var(--color-neon-cyan)' : 'var(--color-star-white)',
                              fontWeight: 700,
                              fontSize: '1rem',
                              letterSpacing: '0.04em',
                            }}>
                              {item.title}
                            </span>

                            {item.meal && (
                              <span style={{
                                fontSize: '0.7rem',
                                background: 'rgba(76, 175, 80, 0.15)',
                                color: '#81c784',
                                border: '1px solid rgba(76, 175, 80, 0.4)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '3px',
                                fontWeight: 600,
                                letterSpacing: '0.04em',
                              }}>
                                Arranged by College
                              </span>
                            )}
                          </div>

                          <p style={{
                            margin: 0,
                            color: 'rgba(244, 234, 204, 0.72)',
                            fontSize: '0.85rem',
                            lineHeight: 1.5,
                            fontWeight: 300,
                          }}>
                            {item.details}
                          </p>
                        </div>

                        {/* Badge / Category */}
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: item.deadline ? '#ffb74d' : 'var(--color-neon-cyan)',
                            background: item.deadline ? 'rgba(255, 152, 0, 0.1)' : 'rgba(211, 47, 47, 0.12)',
                            border: `1px solid ${item.deadline ? 'rgba(255, 152, 0, 0.4)' : 'rgba(211, 47, 47, 0.35)'}`,
                            padding: '0.3rem 0.75rem',
                            borderRadius: '3px',
                            whiteSpace: 'nowrap',
                          }}>
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Day 3 Protocol Callout */}
                {day.ceremonyProtocol && (
                  <div
                    style={{
                      background: 'rgba(211, 47, 47, 0.05)',
                      borderTop: '1px solid rgba(211, 47, 47, 0.25)',
                      padding: '1.25rem 1.75rem',
                    }}
                  >
                    <h5 style={{
                      color: 'var(--color-neon-cyan)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      margin: '0 0 0.85rem 0',
                      letterSpacing: '0.08em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <Award size={18} />
                      Closing Ceremony Presidential Address Sequence (3:00 PM – 4:00 PM)
                    </h5>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '0.85rem',
                    }}>
                      {day.ceremonyProtocol.map((proto) => (
                        <div
                          key={proto.step}
                          style={{
                            background: 'rgba(18, 18, 18, 0.7)',
                            border: '1px solid rgba(211, 47, 47, 0.2)',
                            borderRadius: '4px',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'flex-start',
                          }}
                        >
                          <span style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            borderRadius: '50%',
                            background: 'var(--color-neon-cyan)',
                            color: 'var(--color-space-black)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}>
                            {proto.step}
                          </span>
                          <div>
                            <div style={{ color: 'var(--color-star-white)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-heading)' }}>
                              {proto.role}
                            </div>
                            <div style={{ color: 'rgba(244, 234, 204, 0.65)', fontSize: '0.75rem', marginTop: '2px', lineHeight: 1.4 }}>
                              {proto.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Participant Quick Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.08) 0%, rgba(8, 8, 8, 0.95) 50%, rgba(211, 47, 47, 0.06) 100%)',
            border: '1px solid rgba(211, 47, 47, 0.5)',
            borderRadius: '4px',
            padding: '1.75rem 2rem',
            boxShadow: '4px 4px 0px 0px rgba(211, 47, 47, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-neon-cyan)', margin: '0 0 0.35rem 0', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
              Ready to Compete in Spectrum 1.0?
            </h4>
            <p style={{ color: 'rgba(244, 234, 204, 0.78)', margin: 0, fontSize: '0.88rem' }}>
              Register your team or solo entry now before slots fill up. Seamless online payment supported.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="neon-button"
              style={{ padding: '0.75rem 1.75rem', fontSize: '0.8rem' }}
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

export default ScheduleSection;
