// Crimson AI Concierge - Client Service
// All Gemini API calls are securely routed through /api/chat so no API key is ever exposed in the browser.
// System prompt lives server-side in /api/chat.js.

// Intelligent offline knowledge engine fallback
const getOfflineResponse = (query) => {
  const q = query.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|who are you)/i.test(q)) {
    return "Greetings! I am Crimson, the official AI concierge for SPECTRUM 1.0. How can I help you with events, registrations, schedule, or rules?";
  }

  // Hackathon
  if (q.includes('hackathon') || q.includes('24 hour') || q.includes('coding')) {
    return "The 24-Hour Hackathon runs from Dec 9, 12:00 PM to Dec 10, 12:30 PM. Team size: 2–4 members (₹500/team). Food & overnight accommodation are provided! Prize Pool is ₹40,000 cash prizes + trophies & certificates.";
  }

  // BGMI / PUBG
  if (q.includes('bgmi') || q.includes('pubg')) {
    return "The BGMI Tournament takes place on Day 1 (Dec 8) from 9:00 AM to 11:00 AM. Entry is ₹400 per squad (4 members). Prizes are Revealing Soon!";
  }

  // Free Fire
  if (q.includes('free fire') || q.includes('ff')) {
    return "The Free Fire Tournament is on Day 1 (Dec 8) from 9:00 AM to 11:00 AM. Entry is ₹400 per squad (4 members). Prizes are Revealing Soon!";
  }

  // TechQuiz
  if (q.includes('quiz') || q.includes('techquiz')) {
    return "TechQuiz is on Day 1 (Dec 8) with Round 1 at 1:00 PM and Round 2 at 4:00 PM. Teams can have 1–3 members (₹300/team). Prizes are Revealing Soon!";
  }

  // Treasure Hunt
  if (q.includes('treasure') || q.includes('hunt')) {
    return "The Treasure Hunt is on Day 1 (Dec 8) from 11:30 AM to 1:00 PM across the GNDEC campus. Team size: 1–4 members (₹600/team). Prizes are Revealing Soon!";
  }

  // Photography
  if (q.includes('photo') || q.includes('camera')) {
    return "Photography entries cost ₹100 per entry (up to 3 photos). The upload link will be shared on Dec 10 at 12:00 PM. Prizes are Revealing Soon!";
  }

  // Impossible to Sell
  if (q.includes('sell') || q.includes('impossible')) {
    return "Impossible to Sell is on Day 1 (Dec 8) from 2:00 PM to 4:00 PM. Pitch an eccentric item! Entry is ₹100 (1–2 members). Prizes are Revealing Soon!";
  }

  // Killer Game
  if (q.includes('killer') || q.includes('stealth')) {
    return "Killer Game is a stealth social-deduction game on Day 1 (Dec 8) from 1:00 PM to 2:00 PM. Entry is ₹50 per player. Prizes are Revealing Soon!";
  }

  // Registration & Payment
  if (q.includes('register') || q.includes('registration') || q.includes('payment') || q.includes('pay') || q.includes('razorpay') || q.includes('cost') || q.includes('price') || q.includes('fee')) {
    return "You can register directly on this website under the 'Event Registration' section! Pick your event, fill out your team or individual details, and complete secure payment via Razorpay. Your pass is emailed instantly!";
  }

  // Dates & Venue / Location
  if (q.includes('when') || q.includes('date') || q.includes('time') || q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('college')) {
    return "SPECTRUM 1.0 is held from December 8 to December 10, 2026 at Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka - 585403.";
  }

  // Coordinators / Contact / Phone
  if (q.includes('contact') || q.includes('coordinator') || q.includes('phone') || q.includes('help') || q.includes('call') || q.includes('number')) {
    return "You can contact Faculty Coordinators: Dr. Praveen Reddy (+91 99165 42332), Prof. Channa Reddy (+91 861 881 3191), and Prof. Rakesh Marturkar (+91 99024 24263), or Student Coordinators: Armaandeep Singh (+91 8427027540), Sangmesh (+91 9353142522), and Abdul Aziz (+91 8296683831).";
  }

  // Schedule
  if (q.includes('schedule') || q.includes('timeline') || q.includes('itinerary') || q.includes('day 1') || q.includes('day 2') || q.includes('day 3')) {
    return "Day 1 (Dec 8): Esports & Creative Events. Day 2 (Dec 9): 24-Hr Hackathon Kickoff (12 PM). Day 3 (Dec 10): Evaluations, Valedictory Ceremony & Prize Distribution (4 PM). Check the Schedule section for detailed times!";
  }

  // Support / Donate
  if (q.includes('support') || q.includes('donate') || q.includes('sponsor')) {
    return "You can support SPECTRUM 1.0 through our Support Us section or directly at razorpay.me/@spectrum10. Every contribution fuels student creativity and innovation!";
  }

  return "I am Crimson, guardian of SPECTRUM 1.0! You can ask me anything about the 24-Hour Hackathon, Esports (BGMI/Free Fire), TechQuiz, registration fees, schedule, venue, or coordinators.";
};

/**
 * Main AI response handler:
 * 1. Calls secure serverless backend (/api/chat) where the Gemini API key is completely protected.
 * 2. If the network or serverless route is unreachable, gracefully falls back to the local offline knowledge engine.
 */
export const getCrimsonResponse = async (userMessage, history = []) => {
  if (!userMessage || !userMessage.trim()) return "";

  // 1. Secure Server-side API Route (/api/chat)
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.reply && data.reply.trim()) {
        return data.reply.trim();
      }
    }
  } catch (apiErr) {
    console.warn("Secure chat endpoint unreachable, falling back to local engine:", apiErr.message);
  }

  // 2. High-reliability instant knowledge base fallback
  return getOfflineResponse(userMessage);
};
