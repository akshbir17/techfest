/**
 * Spectrum 1.0 Calendar Integration Utilities
 * Supports direct Google Calendar links and downloadable .ics files (Apple/Outlook/Device)
 * All times are calculated from Indian Standard Time (IST: UTC+5:30) with custom reminders.
 */

export const EVENT_SCHEDULE_DATA = {
  hackathon: {
    title: 'Spectrum 1.0: 24-Hour Hackathon',
    start: '2026-12-08T12:00:00+05:30',
    end: '2026-12-09T12:00:00+05:30',
    venue: 'CSE Advanced Computing Lab, GNDEC Campus, Bidar',
    description: 'Flagship 24-Hour Hackathon at Spectrum 1.0. Rapid innovation & coding. Kickoff at 12:00 PM on 8 Dec. ID Card distribution closes at 11:00 AM sharp. College-provided lunch, dinner, breakfast & accommodation included.\n\nWebsite: https://spectrum10.vercel.app',
  },
  tech_quiz: {
    title: 'Spectrum 1.0: TechQuiz (Prelims & Finals)',
    start: '2026-12-07T13:00:00+05:30',
    end: '2026-12-07T17:00:00+05:30',
    venue: 'Seminar Hall 1 & Main Stage, GNDEC Campus, Bidar',
    description: 'Test your algorithmic acumen, CS fundamentals, and tech trivia. Round 1 Written Prelims at 1:00 PM; Round 2 Stage Finals at 4:00 PM.\n\nWebsite: https://spectrum10.vercel.app',
  },
  photo_booth: {
    title: 'Spectrum 1.0: Photography Contest',
    start: '2026-12-07T09:00:00+05:30',
    end: '2026-12-09T12:30:00+05:30',
    venue: 'Spectrum Themed Photo Booth & GNDEC Campus, Bidar',
    description: 'Capture the essence and aesthetics of Spectrum 1.0. Official submission link shared on 9 Dec at 12:00 PM sharp. Open to phone & DSLR photographers.\n\nWebsite: https://spectrum10.vercel.app',
  },
  impossible_to_sell: {
    title: 'Spectrum 1.0: Impossible to Sell',
    start: '2026-12-07T14:00:00+05:30',
    end: '2026-12-07T16:00:00+05:30',
    venue: 'Main Stage / Seminar Hall 2, GNDEC Campus, Bidar',
    description: 'High-voltage creative selling challenge. Pitch absurd and difficult items on stage. 3 mins preparation, 3-4 mins live stage pitch.\n\nWebsite: https://spectrum10.vercel.app',
  },
  bgmi: {
    title: 'Spectrum 1.0: BGMI Squad Tournament',
    start: '2026-12-07T09:00:00+05:30',
    end: '2026-12-07T11:00:00+05:30',
    venue: 'Esports Arena / CC Lab 2, GNDEC Campus, Bidar',
    description: 'Battlegrounds Mobile India squad showdown on Erangel, Miramar, and Sanhok. Strictly mobile devices only. BGIS competitive point matrix.\n\nWebsite: https://spectrum10.vercel.app',
  },
  free_fire: {
    title: 'Spectrum 1.0: Free Fire Squad Tournament',
    start: '2026-12-07T09:00:00+05:30',
    end: '2026-12-07T11:00:00+05:30',
    venue: 'Esports Arena / CC Lab 3, GNDEC Campus, Bidar',
    description: 'High-octane mobile battle royale on Bermuda, Purgatory, and Kalahari. Mobile phones only. Runs 9:00 AM – 11:00 AM on Day 1.\n\nWebsite: https://spectrum10.vercel.app',
  },
  treasure_hunt: {
    title: 'Spectrum 1.0: Campus Treasure Hunt',
    start: '2026-12-07T11:30:00+05:30',
    end: '2026-12-07T13:00:00+05:30',
    venue: 'GNDEC Campus Grounds, Bidar',
    description: 'Exhilarating campus-wide mystery quest! Crack cryptic clues, solve riddles, and race across checkpoints. Concludes strictly at 1:00 PM.\n\nWebsite: https://spectrum10.vercel.app',
  },
  killer_game: {
    title: 'Spectrum 1.0: Killer Game',
    start: '2026-12-07T13:00:00+05:30',
    end: '2026-12-07T14:00:00+05:30',
    venue: 'Campus Ground / Open Lawn, GNDEC Campus, Bidar',
    description: 'Stealth elimination and social deduction mystery challenge. Runs 1:00 PM – 2:00 PM on Day 1 in parallel with TechQuiz Round 1.\n\nWebsite: https://spectrum10.vercel.app',
  },
  full_fest: {
    title: 'Spectrum 1.0: National TechFest (All 3 Days)',
    start: '2026-12-07T09:00:00+05:30',
    end: '2026-12-09T17:00:00+05:30',
    venue: 'Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka 585403',
    description: 'Spectrum 1.0 — 3 Days of Technical, Esports, & Creative Excellence at GNDEC Bidar. 24-Hour Hackathon, BGMI, Free Fire, TechQuiz, Treasure Hunt, and more!\n\nWebsite: https://spectrum10.vercel.app',
  },
};

/**
 * Format a Date object to iCalendar UTC timestamp string: YYYYMMDDTHHmmssZ
 */
export function formatToIcsUtc(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Get resolved event schedule details from event id or generic event object
 */
export function resolveEventData(event) {
  const key = event?.id || (typeof event === 'string' ? event : null);
  const found = key ? EVENT_SCHEDULE_DATA[key] : null;

  if (found) {
    return {
      title: found.title,
      start: new Date(found.start),
      end: new Date(found.end),
      venue: found.venue,
      description: found.description,
    };
  }

  // Fallback to generic fest timing if specific event isn't matched
  return {
    title: `Spectrum 1.0: ${event?.name || 'Fest Event'}`,
    start: new Date('2026-12-07T09:00:00+05:30'),
    end: new Date('2026-12-09T17:00:00+05:30'),
    venue: event?.venue || 'Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka',
    description: (event?.description || 'Spectrum 1.0 National Level Technical & Cultural Fest.') + '\n\nWebsite: https://spectrum10.vercel.app',
  };
}

/**
 * Generate 1-click Google Calendar URL
 */
export function createGoogleCalendarUrl(event) {
  const data = resolveEventData(event);
  const startUtc = formatToIcsUtc(data.start);
  const endUtc = formatToIcsUtc(data.end);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: data.title,
    dates: `${startUtc}/${endUtc}`,
    details: data.description,
    location: data.venue,
    ctz: 'Asia/Kolkata',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate and trigger download of .ics file with custom reminders (Apple / Outlook / Device)
 */
export function downloadIcsFile(event) {
  const data = resolveEventData(event);
  const nowUtc = formatToIcsUtc(new Date());
  const startUtc = formatToIcsUtc(data.start);
  const endUtc = formatToIcsUtc(data.end);
  const uid = `spectrum-1-0-${(event?.id || 'event').toLowerCase()}-${Date.now()}@gndecbidar.ac.in`;

  // Escape special chars according to RFC 5545
  const cleanSummary = data.title.replace(/[,;]/g, ' ');
  const cleanVenue = data.venue.replace(/[,;]/g, ' ');
  const cleanDescription = data.description
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Spectrum 1.0 GNDEC Bidar//TechFest Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Spectrum 1.0 Events',
    'X-WR-TIMEZONE:Asia/Kolkata',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanVenue}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    // Custom Reminder 1: 1 Hour Before
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${cleanSummary} begins in 1 hour at GNDEC Bidar!`,
    'END:VALARM',
    // Custom Reminder 2: 24 Hours (1 Day) Before
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Tomorrow: ${cleanSummary} at Spectrum 1.0!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const filename = `Spectrum_1.0_${(event?.id || 'event').replace(/[^a-zA-Z0-9_-]/g, '_')}.ics`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}