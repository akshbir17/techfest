import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Radio, Calendar, Sparkles } from 'lucide-react';

// Official Schedule with exact timestamps (IST: UTC+5:30)
const EVENT_SCHEDULE = [
  // Day 1 — 8 Dec 2026
  {
    title: 'BGMI & Free Fire Tournaments',
    venue: 'Esports Arena (CC Lab 2 & 3)',
    category: 'Esports',
    start: new Date('2026-12-08T09:00:00+05:30').getTime(),
    end: new Date('2026-12-08T11:00:00+05:30').getTime(),
  },
  {
    title: 'Official SPECTRUM 1.0 Poster Reveal',
    venue: 'Main Campus & Central Stage',
    category: 'Ceremony',
    start: new Date('2026-12-08T11:00:00+05:30').getTime(),
    end: new Date('2026-12-08T11:30:00+05:30').getTime(),
  },
  {
    title: 'Treasure Hunt',
    venue: 'GNDEC Campus Grounds',
    category: 'Games & Adventure',
    start: new Date('2026-12-08T11:30:00+05:30').getTime(),
    end: new Date('2026-12-08T13:00:00+05:30').getTime(),
  },
  {
    title: 'TechQuiz — Round 1 & Killer Game',
    venue: 'Seminar Hall 1 & Open Lawn',
    category: 'Technical / Fun',
    start: new Date('2026-12-08T13:00:00+05:30').getTime(),
    end: new Date('2026-12-08T14:00:00+05:30').getTime(),
  },
  {
    title: 'Impossible to Sell',
    venue: 'Main Stage / Seminar Hall 2',
    category: 'Creative Pitch',
    start: new Date('2026-12-08T14:00:00+05:30').getTime(),
    end: new Date('2026-12-08T16:00:00+05:30').getTime(),
  },
  {
    title: 'TechQuiz — Round 2 (Stage Finals)',
    venue: 'Main Auditorium / Seminar Hall 1',
    category: 'Technical Finals',
    start: new Date('2026-12-08T16:00:00+05:30').getTime(),
    end: new Date('2026-12-08T17:00:00+05:30').getTime(),
  },

  // Day 2 — 9 Dec 2026
  {
    title: 'ID Card Distribution (Closes at 11:00 AM)',
    venue: 'Central Registration Desk',
    category: 'Check-in',
    start: new Date('2026-12-09T09:00:00+05:30').getTime(),
    end: new Date('2026-12-09T11:00:00+05:30').getTime(),
  },
  {
    title: 'Problem Statement Submission Window',
    venue: 'Hackathon Desk / Online Portal',
    category: 'Submissions',
    start: new Date('2026-12-09T11:00:00+05:30').getTime(),
    end: new Date('2026-12-09T13:00:00+05:30').getTime(),
  },
  {
    title: '24-Hour Hackathon Begins',
    venue: 'CSE Advanced Computing Lab',
    category: 'Flagship Championship',
    start: new Date('2026-12-09T12:00:00+05:30').getTime(),
    end: new Date('2026-12-10T12:00:00+05:30').getTime(),
  },
  {
    title: 'Lunch (College-Provided)',
    venue: 'Campus Dining Area',
    category: 'Meal',
    start: new Date('2026-12-09T14:00:00+05:30').getTime(),
    end: new Date('2026-12-09T15:00:00+05:30').getTime(),
  },
  {
    title: 'Dinner (College-Provided)',
    venue: 'Campus Dining Area',
    category: 'Meal',
    start: new Date('2026-12-09T20:00:00+05:30').getTime(),
    end: new Date('2026-12-09T21:30:00+05:30').getTime(),
  },
  {
    title: 'Entertainment Activity',
    venue: 'Central Campus Stage',
    category: 'Fun & Music',
    start: new Date('2026-12-09T22:00:00+05:30').getTime(),
    end: new Date('2026-12-09T23:00:00+05:30').getTime(),
  },

  // Day 3 — 10 Dec 2026
  {
    title: 'Breakfast (College-Provided)',
    venue: 'Campus Dining Area',
    category: 'Meal',
    start: new Date('2026-12-10T08:00:00+05:30').getTime(),
    end: new Date('2026-12-10T09:00:00+05:30').getTime(),
  },
  {
    title: 'Photography Submission Link Shared',
    venue: 'Official Google Drive Portal',
    category: 'Submissions',
    start: new Date('2026-12-10T12:00:00+05:30').getTime(),
    end: new Date('2026-12-10T12:30:00+05:30').getTime(),
  },
  {
    title: 'Project Evaluation (Parallel Themes)',
    venue: 'CSE Labs & Evaluation Centers',
    category: 'Jury Evaluation',
    start: new Date('2026-12-10T12:30:00+05:30').getTime(),
    end: new Date('2026-12-10T13:30:00+05:30').getTime(),
  },
  {
    title: 'Grand Closing Ceremony & Cultural Performances',
    venue: 'Main Auditorium',
    category: 'Closing Ceremony',
    start: new Date('2026-12-10T14:00:00+05:30').getTime(),
    end: new Date('2026-12-10T15:00:00+05:30').getTime(),
  },
  {
    title: 'Dignitary Speeches & Addresses',
    venue: 'Main Auditorium',
    category: 'Formal Addresses',
    start: new Date('2026-12-10T15:00:00+05:30').getTime(),
    end: new Date('2026-12-10T16:00:00+05:30').getTime(),
  },
  {
    title: 'Prize Distribution & Formal Conclusion',
    venue: 'Main Auditorium',
    category: 'Prize Distribution',
    start: new Date('2026-12-10T16:00:00+05:30').getTime(),
    end: new Date('2026-12-10T17:00:00+05:30').getTime(),
  },
];

const FEST_START_TIME = new Date('2026-12-08T09:00:00+05:30').getTime();
const FEST_END_TIME = new Date('2026-12-10T17:00:00+05:30').getTime();

const LiveCountdownTracker = () => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute countdown to kickoff
  const timeDiff = Math.max(0, FEST_START_TIME - now);
  const isStarted = now >= FEST_START_TIME;
  const isConcluded = now >= FEST_END_TIME;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  // Dynamic real-time event detector
  const { currentEvent, nextEvent } = useMemo(() => {
    if (!isStarted || isConcluded) {
      return { currentEvent: null, nextEvent: EVENT_SCHEDULE[0] };
    }

    // Active event right now
    const active = EVENT_SCHEDULE.find((ev) => now >= ev.start && now < ev.end);
    // Next upcoming event
    const upcoming = EVENT_SCHEDULE.find((ev) => ev.start > now);

    return { currentEvent: active, nextEvent: upcoming };
  }, [now, isStarted, isConcluded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.7, ease: 'easeOut' }}
      className="live-countdown-container"
      style={{
        marginTop: '2.5rem',
        width: '100%',
        maxWidth: '720px',
        marginInline: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0 1rem',
      }}
    >
      {/* 1. Countdown Blocks (shown before fest begins) */}
      {!isStarted && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 700,
              color: 'var(--color-neon-cyan)',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Clock size={14} className="animate-pulse" />
            <span>COUNTDOWN TO FESTIVAL KICKOFF</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(65px, 1fr))',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              width: '100%',
              maxWidth: '480px',
            }}
          >
            {[
              { label: 'DAYS', value: days },
              { label: 'HOURS', value: hours },
              { label: 'MINUTES', value: minutes },
              { label: 'SECONDS', value: seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(8, 8, 8, 0.7)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(211, 47, 47, 0.45)',
                  boxShadow: '0 0 15px rgba(211, 47, 47, 0.2), inset 0 0 12px rgba(211, 47, 47, 0.08)',
                  borderRadius: '6px',
                  padding: '0.75rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
                    fontWeight: 800,
                    color: 'var(--color-star-white)',
                    lineHeight: 1,
                    textShadow: '0 0 12px rgba(211, 47, 47, 0.8)',
                  }}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(0.6rem, 1.8vw, 0.7rem)',
                    letterSpacing: '0.15em',
                    color: 'rgba(244, 234, 204, 0.75)',
                    marginTop: '0.35rem',
                    fontWeight: 600,
                  }}
                >
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Dynamic "Happening Now" / Live Status Card */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.12) 0%, rgba(8, 8, 8, 0.85) 50%, rgba(211, 47, 47, 0.08) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(211, 47, 47, 0.5)',
          boxShadow: '0 0 25px rgba(211, 47, 47, 0.25), 4px 4px 0px 0px rgba(211, 47, 47, 0.7)',
          borderRadius: '8px',
          padding: 'clamp(0.85rem, 3vw, 1.25rem) clamp(1rem, 4vw, 1.5rem)',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          {/* A) ACTIVE EVENT LIVE RIGHT NOW */}
          {currentEvent && (
            <motion.div
              key="live-now"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#ff2222',
                      boxShadow: '0 0 12px #ff2222',
                      animation: 'pulse 1.2s infinite',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      color: '#ff4444',
                      textTransform: 'uppercase',
                    }}
                  >
                    🔴 LIVE NOW
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      background: 'rgba(211, 47, 47, 0.25)',
                      color: 'var(--color-neon-cyan)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '3px',
                      fontWeight: 700,
                    }}
                  >
                    {currentEvent.category}
                  </span>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.7)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Radio size={13} color="var(--color-neon-cyan)" /> Real-Time Fest Radar
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
                  fontWeight: 800,
                  color: 'var(--color-star-white)',
                  letterSpacing: '0.04em',
                  margin: '0.2rem 0',
                }}
              >
                {currentEvent.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(244, 234, 204, 0.85)' }}>
                <MapPin size={14} color="var(--color-neon-cyan)" style={{ flexShrink: 0 }} />
                <span>{currentEvent.venue}</span>
              </div>
            </motion.div>
          )}

          {/* B) COUNTDOWN PHASE (BEFORE FEST BEGINS) */}
          {!isStarted && (
            <motion.div
              key="upcoming-kickoff"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={14} color="var(--color-neon-cyan)" />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      color: 'var(--color-neon-cyan)',
                      textTransform: 'uppercase',
                    }}
                  >
                    ⚡ UPCOMING INAUGURATION
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(244, 234, 204, 0.65)' }}>
                  Tuesday, 8 Dec 2026 • 9:00 AM
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(0.95rem, 3vw, 1.2rem)',
                  fontWeight: 700,
                  color: 'var(--color-star-white)',
                  letterSpacing: '0.03em',
                  margin: '0.15rem 0',
                }}
              >
                Spectrum 1.0 — 24-Hour Hackathon & More
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'rgba(244, 234, 204, 0.75)' }}>
                <Sparkles size={13} color="var(--color-neon-cyan)" style={{ flexShrink: 0 }} />
                 <span>Full event lineup to be announced — stay tuned!</span>
              </div>
            </motion.div>
          )}

          {/* C) BETWEEN SESSIONS DURING EVENT DAYS */}
          {isStarted && !currentEvent && !isConcluded && nextEvent && (
            <motion.div
              key="next-up"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--color-neon-cyan)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    color: 'var(--color-neon-cyan)',
                    textTransform: 'uppercase',
                  }}
                >
                  ⚡ UPCOMING NEXT
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                  fontWeight: 700,
                  color: 'var(--color-star-white)',
                  margin: '0.15rem 0',
                }}
              >
                {nextEvent.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'rgba(244, 234, 204, 0.8)' }}>
                <MapPin size={13} color="var(--color-neon-cyan)" />
                <span>{nextEvent.venue}</span>
              </div>
            </motion.div>
          )}

          {/* D) CONCLUDED */}
          {isConcluded && (
            <motion.div
              key="concluded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '0.5rem 0' }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-neon-cyan)',
                  letterSpacing: '0.1em',
                }}
              >
                🏆 SPECTRUM 1.0 CONCLUDED
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(244, 234, 204, 0.75)', marginTop: '0.25rem' }}>
                Thank you to all organizers, participants, and faculty for making history!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LiveCountdownTracker;

