const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const systemInstruction = `You are Crimson, the official AI Assistant and Guide of Spectrum 1.0.
    Your tone is polite, sharp, and helpful.
    You assist participants with all festival inquiries.
    
    KEY FESTIVAL INFORMATION:
    - Name: SPECTRUM 1.0
    - Location: Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka.
    - Dates: December 7 – 9, 2026.
    - Aesthetic: Obsidian Black, Crimson Red, and Cream/Parchment.
    
    EVENTS:
    - Technical:
      * 24-Hour Hackathon: ₹800 per team (2–4 members). Flagship 24-hour sprint (8 Dec 12 PM to 9 Dec 12:30 PM). College lunch, dinner, breakfast & accommodation provided. ₹30,000 first prize, ₹14,000 second prize + trophies.
      * TechQuiz: ₹300 per team (1–3 members). Day 1 (Round 1: 1:00 PM – 2:00 PM | Round 2: 4:00 PM – 5:00 PM). ₹3,000 first prize.
    - Creative:
      * Impossible to Sell: ₹100 per entry (1–2 members). Day 1 (2:00 PM – 4:00 PM). Creative selling & pitching challenge. ₹2,000 first prize + trophies.
      * Mock Interview: ₹120 per individual. Day 1. Real-world corporate HR & tech simulation. ₹1,000 cash prize.
      * Photography: ₹100 per entry (max 3 submissions). Google Drive submission link shared on 9 Dec at 12:00 PM. ₹1,000 prize pool.
    - Games & Esports:
      * BGMI Tournament: ₹400 per squad (4 members). Day 1 (9:00 AM – 11:00 AM, runs in parallel with Free Fire). ₹4,000 first prize, ₹2,000 second prize.
      * Free Fire Tournament: ₹400 per squad (4 members). Day 1 (9:00 AM – 11:00 AM, runs in parallel with BGMI). ₹4,000 first prize, ₹2,000 second prize.
      * Treasure Hunt: ₹400 per team (1–4 members). Day 1 (11:30 AM – 1:00 PM). ₹3,000 first prize + trophies.
      * Killer Game: ₹50 per player. Day 1 (1:00 PM – 2:00 PM, parallel with TechQuiz Round 1). Social deduction & stealth elimination.

    SCHEDULE HIGHLIGHTS:
    - Day 1 (7 Dec): BGMI & Free Fire (9-11 AM), Poster Reveal (11-11:30 AM), Treasure Hunt (11:30 AM - 1 PM), TechQuiz R1 & Killer Game (1-2 PM), Impossible to Sell (2-4 PM), TechQuiz R2 (4-5 PM).
    - Day 2 (8 Dec): ID Cards (9-11 AM cutoff), Problem Statements (11 AM - 1 PM cutoff), Hackathon Starts (12 PM), College Lunch (2-3 PM), College Dinner (8-9:30 PM), Entertainment (10-11 PM).
    - Day 3 (9 Dec): College Breakfast (8-9 AM), Photo Link Shared (12 PM), Project Evaluations (12:30-1:30 PM), Closing Ceremony & Speeches (2-4 PM), Prize Distribution (4-5 PM).
    
    COORDINATORS:
    - Faculty Coordinator: Dr. Praveen Reddy (+91 99165 42332).
    - Student Coordinators: Sangmesh (+91 9353142522), Abdul Aziz (+91 8296683831), Armaandeep Singh (+91 8427027540).
    
    REGISTRATION:
    - Users can register directly on the website via the in-app Individual or Team registration modals with online Razorpay payment!
    
    INSTRUCTIONS:
    - Keep responses relatively brief (2-3 sentences).
    - If you don't know something, guide the user to contact the 'Event Coordinators'.`;

// Intelligent offline knowledge engine: guarantees Crimson always answers accurately even without an API key
const getOfflineResponse = (query) => {
  const q = query.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|greetings|hola|namaste|sup|who are you)/i.test(q)) {
    return "Greetings, warrior! I am Crimson, the sentinel of Spectrum 1.0. How may I assist you with events, registrations, schedule, or rules?";
  }

  // Hackathon
  if (q.includes('hackathon') || q.includes('24 hour') || q.includes('coding')) {
    return "The 24-Hour Hackathon runs from Dec 8, 12:00 PM to Dec 9, 12:30 PM. Team size is 2–4 members (₹800/team). Food & accommodation are provided! 1st Prize is ₹30,000 and 2nd Prize is ₹14,000 + trophies.";
  }

  // BGMI / PUBG
  if (q.includes('bgmi') || q.includes('pubg')) {
    return "The BGMI Tournament takes place on Day 1 (Dec 7) from 9:00 AM to 11:00 AM. It's ₹400 per squad (4 members). 1st Prize is ₹4,000 and 2nd Prize is ₹2,000!";
  }

  // Free Fire
  if (q.includes('free fire') || q.includes('ff')) {
    return "The Free Fire Tournament is held on Day 1 (Dec 7) from 9:00 AM to 11:00 AM. Entry fee is ₹400 per squad (4 members). 1st Prize is ₹4,000 and 2nd Prize is ₹2,000!";
  }

  // TechQuiz
  if (q.includes('quiz') || q.includes('techquiz')) {
    return "TechQuiz is on Day 1 (Dec 7) with Round 1 at 1:00 PM and Round 2 at 4:00 PM. Teams can have 1–3 members (₹300/team). 1st Prize is ₹3,000 and 2nd Prize is ₹1,500!";
  }

  // Treasure Hunt
  if (q.includes('treasure') || q.includes('hunt')) {
    return "The Treasure Hunt is on Day 1 (Dec 7) from 11:30 AM to 1:00 PM across the GNDEC campus. Team size is 1–4 members (₹400/team) with a ₹3,000 first prize + trophies!";
  }

  // Photography
  if (q.includes('photo') || q.includes('camera')) {
    return "Photography entries cost ₹100 per submission (up to 3 submissions allowed). The official Google Drive upload link will be shared on Dec 9 at 12:00 PM. Total prize pool is ₹1,000!";
  }

  // Mock Interview
  if (q.includes('interview') || q.includes('mock')) {
    return "Mock Interview is on Day 1 (Dec 7). Entry fee is ₹120 per individual. Experience simulated HR & tech rounds, receive industry feedback scorecards, and compete for a ₹1,000 cash prize!";
  }

  // Impossible to Sell
  if (q.includes('sell') || q.includes('impossible')) {
    return "Impossible to Sell is on Day 1 (Dec 7) from 2:00 PM to 4:00 PM. Pitch an eccentric or bizarre item! Entry is ₹100 (1–2 members) with a ₹2,000 first prize + trophies.";
  }

  // Killer Game
  if (q.includes('killer') || q.includes('stealth')) {
    return "Killer Game is a stealth social-deduction game on Day 1 (Dec 7) from 1:00 PM to 2:00 PM. Entry is ₹50 per player with trophies and exclusive merch!";
  }

  // Registration & Payment
  if (q.includes('register') || q.includes('registration') || q.includes('payment') || q.includes('pay') || q.includes('razorpay') || q.includes('cost') || q.includes('price') || q.includes('fee')) {
    return "You can register directly in the Registration section of this website! Choose your event, fill out your details, and complete payment securely via Razorpay. Instant confirmation is recorded in our database.";
  }

  // Dates & Venue / Location
  if (q.includes('when') || q.includes('date') || q.includes('time') || q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('college')) {
    return "Spectrum 1.0 is held from December 7 to December 9, 2026 at Guru Nanak Dev Engineering College (GNDEC), Mailoor Road, Bidar, Karnataka 585403.";
  }

  // Coordinators / Contact / Phone
  if (q.includes('contact') || q.includes('coordinator') || q.includes('phone') || q.includes('help') || q.includes('call') || q.includes('number')) {
    return "You can reach Faculty Coordinator Dr. Praveen Reddy at +91 99165 42332, or Student Coordinators Sangmesh (+91 9353142522), Abdul Aziz (+91 8296683831), and Armaandeep (+91 8427027540).";
  }

  // Schedule
  if (q.includes('schedule') || q.includes('timeline') || q.includes('itinerary') || q.includes('day 1') || q.includes('day 2') || q.includes('day 3')) {
    return "Day 1 (Dec 7): Esports & Creative Events. Day 2 (Dec 8): 24-Hr Hackathon Kickoff (12 PM). Day 3 (Dec 9): Evaluations, Valedictory Ceremony & Prize Distribution (4 PM). Check the Schedule section for detailed times!";
  }

  // Support
  if (q.includes('support') || q.includes('donate') || q.includes('sponsor')) {
    return "You can support Spectrum 1.0 through our Support Us section or directly at razorpay.me/@spectrum10. Every contribution fuels creativity and innovation!";
  }

  // Fallback default
  return "I am Crimson, guardian of Spectrum 1.0! You can ask me about events (Hackathon, BGMI, Quiz, etc.), registration fees, rules, venue, or coordinators.";
};

export const getCrimsonResponse = async (userMessage) => {
  // If user provided a message, attempt remote AI if key looks plausible
  if (apiKey && apiKey.startsWith("sk-or-v1-")) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://spectrum10.vercel.app",
          "X-Title": "Spectrum 1.0"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userMessage }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
      }
    } catch {
      // Graceful fallback below
    }
  }

  // High-reliability instant knowledge base fallback
  return getOfflineResponse(userMessage);
};
