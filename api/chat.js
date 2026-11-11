// Serverless Backend API Route for Crimson AI Concierge
// Keeps the Gemini API key 100% hidden and secure on the server (never exposed to browser)

const SYSTEM_INSTRUCTION = `You are Crimson, the official AI Concierge and Sentinel of SPECTRUM 1.0 — the premier National Level Technical & Cultural Festival at Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka.

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
   - Fee: ₹500 per team (2–4 members).
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
   - Fee: ₹600 per team (1–4 members).
   - Day 1 (Dec 7): 11:30 AM – 1:00 PM across GNDEC campus.
   - Prizes: 1st Prize: ₹3,000 + Trophies.
6. IMPOSSIBLE TO SELL (Creative Pitching):
   - Fee: ₹100 per entry (1–2 members).
   - Day 1 (Dec 7): 2:00 PM – 4:00 PM.
   - Prizes: 1st Prize: ₹2,000 + Trophies.
7. MOCK INTERVIEW (Career Simulation):
   - Fee: ₹100 per individual.
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

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage = message.trim().slice(0, 500); // Safety limit

    // Authoritative Server-side API key (never sent to client)
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on server' });
    }

    // 1. Google Gemini API
    if (!apiKey.startsWith('sk-or-')) {
      const contents = [];

      // Last 4 turns of history
      (history || []).slice(-4).forEach((msg) => {
        if (msg.sender === 'user' && msg.text) {
          contents.push({ role: 'user', parts: [{ text: String(msg.text).slice(0, 500) }] });
        } else if ((msg.sender === 'crimson' || msg.sender === 'model') && msg.text) {
          contents.push({ role: 'model', parts: [{ text: String(msg.text).slice(0, 500) }] });
        }
      });

      // Current prompt
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      // Call Google Gemini API (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash fallback)
      const modelsToTry = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
      ];

      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: SYSTEM_INSTRUCTION }],
                },
                contents: contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 250,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const data = await geminiRes.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply && reply.trim()) {
              return res.status(200).json({ reply: reply.trim() });
            }
          }
        } catch (modelErr) {
          console.warn(`Model ${model} failed, trying next:`, modelErr.message);
        }
      }

      return res.status(502).json({ error: 'Failed to generate response from Gemini' });
    }

    // 2. OpenRouter Fallback (if key is sk-or-...)
    const messages = [{ role: 'system', content: SYSTEM_INSTRUCTION }];
    (history || []).slice(-4).forEach((msg) => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: String(msg.text).slice(0, 500),
      });
    });
    messages.push({ role: 'user', content: userMessage });

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://spectrum10.vercel.app',
        'X-Title': 'SPECTRUM 1.0',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: messages,
        max_tokens: 250,
      }),
    });

    if (openRouterRes.ok) {
      const data = await openRouterRes.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply && reply.trim()) {
        return res.status(200).json({ reply: reply.trim() });
      }
    }

    return res.status(502).json({ error: 'Failed to generate response from OpenRouter' });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

