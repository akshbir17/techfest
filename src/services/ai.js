const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const systemInstruction = `You are Crimson, the official AI Concierge and Sentinel of SPECTRUM 1.0 — the premier National Level Technical & Cultural Festival at Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka.

YOUR PERSONALITY & TONE:
- Tone: Cyberpunk, sharp, helpful, polite, energetic, and concise (2-4 sentences max per response).
- You know every event rule, prize pool, registration fee, coordinator phone number, and campus reporting instruction by heart.
- If answering queries in Hindi or Hinglish, respond warmly in the same language.

KEY FESTIVAL DETAILS:
- Festival: SPECTRUM 1.0
- Venue: Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka - 585403.
- Dates: December 7 – 9, 2026.
- Reporting: Reporting begins at 8:30 AM on Day 1 (Dec 7) at the Main Gate.
- Mandatory: Valid physical College / Institution ID card is required for entry.
- Official Website: https://spectrum10.vercel.app

EVENT CATALOG & PRIZES:
1. 24-HOUR HACKATHON (Flagship Technical):
   - Fee: ₹800 per team (2–4 members).
   - Time: Starts Dec 8 at 12:00 PM (noon) and ends Dec 9 at 12:30 PM.
   - Perks: Free college meals (lunch, dinner, breakfast) & overnight campus accommodation provided!
   - Prizes: 1st Prize: ₹30,000 | 2nd Prize: ₹14,000 + Winner Trophies & Certificates.
2. TECHQUIZ (Technical):
   - Fee: ₹300 per team (1–3 members).
   - Day 1 (Dec 7): Round 1 at 1:00 PM – 2:00 PM, Round 2 at 4:00 PM – 5:00 PM.
   - Prizes: 1st Prize: ₹3,000 | 2nd Prize: ₹1,500.
3. BGMI TOURNAMENT (Esports):
   - Fee: ₹400 per squad (4 members).
   - Day 1 (Dec 7): 9:00 AM – 11:00 AM.
   - Prizes: 1st Prize: ₹4,000 | 2nd Prize: ₹2,000.
4. FREE FIRE TOURNAMENT (Esports):
   - Fee: ₹400 per squad (4 members).
   - Day 1 (Dec 7): 9:00 AM – 11:00 AM (runs in parallel with BGMI).
   - Prizes: 1st Prize: ₹4,000 | 2nd Prize: ₹2,000.
5. TREASURE HUNT (Campus Exploration):
   - Fee: ₹400 per team (1–4 members).
   - Day 1 (Dec 7): 11:30 AM – 1:00 PM across GNDEC campus.
   - Prizes: 1st Prize: ₹3,000 + Trophies.
6. IMPOSSIBLE TO SELL (Creative Pitching):
   - Fee: ₹100 per entry (1–2 members).
   - Day 1 (Dec 7): 2:00 PM – 4:00 PM.
   - Prizes: 1st Prize: ₹2,000 + Trophies.
7. MOCK INTERVIEW (Career Simulation):
   - Fee: ₹120 per individual.
   - Day 1 (Dec 7). Technical & HR simulation with corporate scorecards.
   - Prizes: ₹1,000 Cash Prize.
8. PHOTOGRAPHY (Creative):
   - Fee: ₹100 per entry (up to 3 submissions).
   - Google Drive link shared on Dec 9 at 12:00 PM. Total prize pool: ₹1,000.
9. KILLER GAME (Social Stealth & Deduction):
   - Fee: ₹50 per player.
   - Day 1 (Dec 7): 1:00 PM – 2:00 PM.

OFFICIAL COORDINATORS (HELP DESK):
- Faculty Coordinator: Dr. Praveen Reddy: +91 99165 42332
- Student Coordinator: Armaandeep Singh: +91 8427027540
- Student Coordinator: Sangmesh: +91 9353142522
- Student Coordinator: Abdul Aziz: +91 8296683831

HOW TO REGISTER:
- Participants can register directly on the website by navigating to the "Event Registration" section or clicking "Register" on any event.
- Secure instant payment is processed via Razorpay, with instant automated digital pass dispatch directly to their email.`;

// Intelligent offline knowledge engine fallback
const getOfflineResponse = (query) => {
  const q = query.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|who are you)/i.test(q)) {
    return "Greetings! I am Crimson, the official AI concierge for SPECTRUM 1.0. How can I help you with events, registrations, schedule, or rules?";
  }

  // Hackathon
  if (q.includes('hackathon') || q.includes('24 hour') || q.includes('coding')) {
    return "The 24-Hour Hackathon runs from Dec 8, 12:00 PM to Dec 9, 12:30 PM. Team size: 2–4 members (₹800/team). Food & overnight accommodation are provided! 1st Prize: ₹30,000 | 2nd Prize: ₹14,000 + trophies.";
  }

  // BGMI / PUBG
  if (q.includes('bgmi') || q.includes('pubg')) {
    return "The BGMI Tournament takes place on Day 1 (Dec 7) from 9:00 AM to 11:00 AM. Entry is ₹400 per squad (4 members). 1st Prize: ₹4,000 | 2nd Prize: ₹2,000!";
  }

  // Free Fire
  if (q.includes('free fire') || q.includes('ff')) {
    return "The Free Fire Tournament is on Day 1 (Dec 7) from 9:00 AM to 11:00 AM. Entry is ₹400 per squad (4 members). 1st Prize: ₹4,000 | 2nd Prize: ₹2,000!";
  }

  // TechQuiz
  if (q.includes('quiz') || q.includes('techquiz')) {
    return "TechQuiz is on Day 1 (Dec 7) with Round 1 at 1:00 PM and Round 2 at 4:00 PM. Teams can have 1–3 members (₹300/team). 1st Prize: ₹3,000 | 2nd Prize: ₹1,500!";
  }

  // Treasure Hunt
  if (q.includes('treasure') || q.includes('hunt')) {
    return "The Treasure Hunt is on Day 1 (Dec 7) from 11:30 AM to 1:00 PM across the GNDEC campus. Team size: 1–4 members (₹400/team) with a ₹3,000 1st prize + trophies!";
  }

  // Photography
  if (q.includes('photo') || q.includes('camera')) {
    return "Photography entries cost ₹100 per entry (up to 3 photos). The upload link will be shared on Dec 9 at 12:00 PM. Total prize pool is ₹1,000!";
  }

  // Mock Interview
  if (q.includes('interview') || q.includes('mock')) {
    return "Mock Interview is on Day 1 (Dec 7). Entry is ₹120 per individual. Experience simulated HR & tech rounds, receive industry feedback, and compete for a ₹1,000 cash prize!";
  }

  // Impossible to Sell
  if (q.includes('sell') || q.includes('impossible')) {
    return "Impossible to Sell is on Day 1 (Dec 7) from 2:00 PM to 4:00 PM. Pitch an eccentric item! Entry is ₹100 (1–2 members) with a ₹2,000 first prize + trophies.";
  }

  // Killer Game
  if (q.includes('killer') || q.includes('stealth')) {
    return "Killer Game is a stealth social-deduction game on Day 1 (Dec 7) from 1:00 PM to 2:00 PM. Entry is ₹50 per player with trophies and exclusive merch!";
  }

  // Registration & Payment
  if (q.includes('register') || q.includes('registration') || q.includes('payment') || q.includes('pay') || q.includes('razorpay') || q.includes('cost') || q.includes('price') || q.includes('fee')) {
    return "You can register directly on this website under the 'Event Registration' section! Pick your event, fill out your team or individual details, and complete secure payment via Razorpay. Your pass is emailed instantly!";
  }

  // Dates & Venue / Location
  if (q.includes('when') || q.includes('date') || q.includes('time') || q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('college')) {
    return "SPECTRUM 1.0 is held from December 7 to December 9, 2026 at Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka - 585403.";
  }

  // Coordinators / Contact / Phone
  if (q.includes('contact') || q.includes('coordinator') || q.includes('phone') || q.includes('help') || q.includes('call') || q.includes('number')) {
    return "You can contact Faculty Coordinator Dr. Praveen Reddy at +91 99165 42332, or Student Coordinators Armaandeep Singh (+91 8427027540), Sangmesh (+91 9353142522), and Abdul Aziz (+91 8296683831).";
  }

  // Schedule
  if (q.includes('schedule') || q.includes('timeline') || q.includes('itinerary') || q.includes('day 1') || q.includes('day 2') || q.includes('day 3')) {
    return "Day 1 (Dec 7): Esports & Creative Events. Day 2 (Dec 8): 24-Hr Hackathon Kickoff (12 PM). Day 3 (Dec 9): Evaluations, Valedictory Ceremony & Prize Distribution (4 PM). Check the Schedule section for detailed times!";
  }

  // Support / Donate
  if (q.includes('support') || q.includes('donate') || q.includes('sponsor')) {
    return "You can support SPECTRUM 1.0 through our Support Us section or directly at razorpay.me/@spectrum10. Every contribution fuels student creativity and innovation!";
  }

  return "I am Crimson, guardian of SPECTRUM 1.0! You can ask me anything about the 24-Hour Hackathon, Esports (BGMI/Free Fire), TechQuiz, registration fees, schedule, venue, or coordinators.";
};

/**
 * Main AI response handler:
 * 1. Checks for Google Gemini API key (official Google AI Studio format: AIzaSy...)
 * 2. Checks for OpenRouter API key (sk-or-v1-...)
 * 3. Gracefully falls back to offline knowledge engine if network fails or key is exhausted.
 */
export const getCrimsonResponse = async (userMessage, history = []) => {
  if (!userMessage || !userMessage.trim()) return "";

  // 1. Official Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
  if (apiKey && (apiKey.startsWith("AIzaSy") || (!apiKey.startsWith("sk-or-") && apiKey.length > 25))) {
    try {
      // Build conversation contents with history
      const contents = [];
      
      // Include last 4 turns of history for contextual awareness
      const recentHistory = (history || []).slice(-4);
      recentHistory.forEach((msg) => {
        if (msg.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.text }] });
        } else if (msg.sender === 'crimson') {
          contents.push({ role: 'model', parts: [{ text: msg.text }] });
        }
      });

      // Add current user prompt
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250,
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply && reply.trim()) {
          return reply.trim();
        }
      }
    } catch (geminiErr) {
      console.warn("Gemini API call failed, falling back:", geminiErr);
    }
  }

  // 2. OpenRouter API Fallback
  if (apiKey && apiKey.startsWith("sk-or-v1-")) {
    try {
      const messages = [{ role: "system", content: systemInstruction }];
      (history || []).slice(-4).forEach((msg) => {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
      messages.push({ role: "user", content: userMessage });

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://spectrum10.vercel.app",
          "X-Title": "SPECTRUM 1.0"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: messages,
          max_tokens: 250
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.choices?.[0]?.message?.content) {
          return data.choices[0].message.content.trim();
        }
      }
    } catch {
      // Graceful fallback below
    }
  }

  // 3. High-reliability instant knowledge base fallback
  return getOfflineResponse(userMessage);
};
