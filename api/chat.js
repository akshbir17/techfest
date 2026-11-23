import { applyCors, checkRateLimit } from './_lib/security.js';

// Serverless Backend API Route for Crimson AI Concierge
// Keeps AI API keys 100% hidden and secure on the server (never exposed to browser)

const SYSTEM_INSTRUCTION = `You are Crimson, the official AI Concierge and Sentinel of SPECTRUM 1.0 — the premier National Level Technical & Cultural Festival at Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka.

YOUR PERSONALITY & TONE:
- Tone: Cyberpunk, sharp, helpful, polite, energetic, and concise (2-4 sentences max per response).
- You know every event rule, prize pool, registration fee, coordinator phone number, and campus reporting instruction by heart.
- If answering queries in Hindi or Hinglish, respond warmly in the same language.

KEY FESTIVAL DETAILS:
- Festival: SPECTRUM 1.0
- Venue: Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka - 585403.
- Dates: December 9 – 10, 2026.
- Registration Deadline: Registrations close on 29th November.
- Entry Gate & Reporting: Entry Gate 1, GNDEC Bidar Main Gate. Exact reporting timings will be informed in the official WhatsApp group.
- Mandatory: Valid physical College / Institution ID card is required for entry.
- Official Website: https://spectrum10.vercel.app
- Associate Sponsor: SV Traders.
- Media Partner: Eventopia.

HACKATHON THEMES & OPEN INNOVATION:
- Theme 01: Agriculture, FoodTech & Rural Development
- Theme 02: MedTech, HealthTech & Workplace Wellbeing
- Theme 03: Clean & Green Technology (Sustainability)
- Theme 04: Smart Automation & Agentic AI
- Open Innovation: Want to work on an idea outside the four given themes? You can now directly select "Open Innovation" as your theme during registration! Build anything you're passionate about.

EVENT CATALOG & PRIZES:
1. 24-HOUR HACKATHON (Flagship Technical):
   - Fee: ₹500 per team (2–4 members).
   - Time: Starts Dec 9 at 12:00 PM (noon) and evaluation at Dec 10 at 12:30 PM.
   - Perks: College-provided lunch, dinner, breakfast, and restroom/stay facilities included!
   - Prizes: ₹40,000 Cash Prize Pool + Trophies & Certificates.
2. TECHQUIZ (Technical):
   - Fee: ₹300 per team (1–3 members). Prizes: Revealing Soon.
3. BGMI TOURNAMENT (Esports):
   - Fee: ₹400 per squad (4 members). Prizes: Revealing Soon.
4. FREE FIRE TOURNAMENT (Esports):
   - Fee: ₹400 per squad (4 members). Prizes: Revealing Soon.
5. TREASURE HUNT (Campus Exploration):
   - Fee: ₹600 per team (1–4 members). Prizes: Revealing Soon.
6. IMPOSSIBLE TO SELL (Creative Pitching):
   - Fee: ₹100 per entry (1–2 members). Prizes: Revealing Soon.
7. PHOTOGRAPHY (Creative):
   - Fee: ₹100 per entry (up to 3 submissions). Prizes: Revealing Soon.
8. KILLER GAME (Social Stealth & Deduction):
   - Fee: ₹50 per player. Prizes: Revealing Soon.

OFFICIAL COORDINATORS (HELP DESK):
- Faculty Coordinator: Dr. Praveen Reddy (Head, CSE - AIML): +91 99165 42332
- Faculty Coordinator: Prof. Channa Reddy (Convener, Institution Innovation Council): +91 861 881 3191
- Faculty Coordinator: Prof. Rakesh Marturkar (CEO, Incubation Center GNJERBI): +91 99024 24263
- Student Coordinator: Armaandeep Singh: +91 8427027540
- Student Coordinator: Sangmesh: +91 9353142522
- Student Coordinator: Abdul Aziz: +91 8296683831

HOW TO REGISTER:
- Participants can register directly on the website by navigating to the "Event Registration" section or clicking "Register" on the 24-Hour Hackathon card.
- Secure instant payment is processed via Razorpay, with instant digital pass download and confirmation email.`;

export default async function handler(req, res) {
  applyCors(req, res, 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const limit = checkRateLimit(req, 'chat', 15, 60_000);
  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute before sending more messages.' });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userMessage = message.trim().slice(0, 500); // Safety limit

    // Authoritative Server-side API keys only (never accept client-exposed VITE_ fallbacks)
    const groqKey = (process.env.GROQ_API_KEY || '').trim();
    const geminiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!groqKey && !geminiKey) {
      return res.status(500).json({ error: 'AI API key is not configured on server' });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(
            (msg) =>
              msg &&
              typeof msg === 'object' &&
              (msg.sender === 'user' || msg.sender === 'crimson' || msg.sender === 'model') &&
              typeof msg.text === 'string' &&
              msg.text.trim().length > 0
          )
          .slice(-4)
      : [];

    const openAiMessages = [{ role: 'system', content: SYSTEM_INSTRUCTION }];
    safeHistory.forEach((msg) => {
      openAiMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text.trim().slice(0, 500),
      });
    });
    openAiMessages.push({ role: 'user', content: userMessage });

    // 1. Groq API (primary - ultra-fast inference)
    if (groqKey) {
      const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
      for (const model of groqModels) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${groqKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model,
              messages: openAiMessages,
              reasoning_effort: 'low',
              temperature: 0.7,
              max_completion_tokens: 450,
            }),
          });

          if (groqRes.ok) {
            const data = await groqRes.json();
            const reply = data?.choices?.[0]?.message?.content;
            if (reply && reply.trim()) {
              return res.status(200).json({ reply: reply.trim() });
            }
          }
        } catch (groqErr) {
          console.warn(`Groq model ${model} failed, trying next:`, groqErr.message);
        }
      }
    }

    // 2. Google Gemini API (fallback if GEMINI_API_KEY is configured)
    if (geminiKey && !geminiKey.startsWith('sk-or-')) {
      const contents = [];
      safeHistory.forEach((msg) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text.trim().slice(0, 500) }],
        });
      });
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const model of modelsToTry) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 250 },
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
          console.warn(`Gemini model ${model} failed, trying next:`, modelErr.message);
        }
      }
    }

    // 3. OpenRouter Fallback (if key is sk-or-...)
    if (geminiKey && geminiKey.startsWith('sk-or-')) {
      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${geminiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://spectrum10.vercel.app',
          'X-Title': 'SPECTRUM 1.0',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: openAiMessages,
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
    }

    return res.status(502).json({ error: 'Failed to generate AI response' });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
