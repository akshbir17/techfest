// Shared authoritative event catalog and participant/ID formatting helpers for Vercel API routes

export const EVENT_CATALOG = {
  // Individual Events
  impossible_to_sell: { name: 'Impossible to Sell', fee: 100, type: 'individual' },
  killer_game: { name: 'Killer Game', fee: 50, type: 'individual' },
  photo_booth: { name: 'Photography', fee: 100, type: 'individual' },
  photography: { name: 'Photography', fee: 100, type: 'individual' },
  // Team Events
  hackathon: { name: '24-Hour Hackathon', fee: 1, type: 'team' },
  tech_quiz: { name: 'TechQuiz', fee: 300, type: 'team' },
  bgmi: { name: 'BGMI Tournament', fee: 400, type: 'team' },
  free_fire: { name: 'Free Fire Tournament', fee: 400, type: 'team' },
  treasure_hunt: { name: 'Treasure Hunt', fee: 600, type: 'team' },
};

export function getEventConfig(eventId) {
  if (!eventId) return null;
  return EVENT_CATALOG[String(eventId).trim().toLowerCase()] || null;
}

export function buildEventPrefix(label) {
  return String(label || 'SPEC').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'SPEC';
}

export function formatUniqueRegId(rawId, eventLabel, fallbackHex = '') {
  if (rawId && String(rawId).startsWith('SPEC-')) {
    return String(rawId);
  }
  const eventPrefix = buildEventPrefix(eventLabel);
  const suffix = rawId
    ? String(rawId).replace(/-/g, '').slice(0, 6).toUpperCase()
    : (fallbackHex || Date.now().toString(36).slice(-6)).toUpperCase();
  return `SPEC-${eventPrefix}-${suffix}`;
}

export function formatTeamMembers(rawMembers) {
  if (!Array.isArray(rawMembers) || rawMembers.length === 0) {
    return 'N/A';
  }
  return rawMembers
    .map((m, i) => {
      if (typeof m === 'string') return m;
      let phoneStr = '';
      if (m.phone) {
        const clean = String(m.phone).trim();
        phoneStr = clean.startsWith('+91') ? clean : `+91 ${clean.replace(/^0+/, '')}`;
      }
      return `${m.name || `Member ${i + 2}`}${phoneStr ? ` (${phoneStr})` : ''}`;
    })
    .join(', ');
}

export function isTeamEventName(eventName, teamName) {
  const lower = String(eventName || '').toLowerCase();
  return Boolean(
    teamName &&
      teamName !== 'N/A' &&
      !lower.includes('impossible') &&
      !lower.includes('killer') &&
      !lower.includes('photo')
  );
}

/**
 * Posts payload to Google Apps Script webhook and verifies logical success
 * (Apps Script returns HTTP 200 even when JSON contains { result: 'error' }).
 */
export async function postToSheetsWebhook(webhookUrl, payload) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });

  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }

  const ok = response.ok && Boolean(parsed && parsed.result === 'success');
  return {
    ok,
    status: response.status,
    error: parsed?.error || (!response.ok ? `HTTP ${response.status}` : null),
  };
}

