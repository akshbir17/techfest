const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const systemInstruction = `You are Crimson, the Ancient Dragon Sentinel of Techfest 2026.
    Your tone is wise, respectful, and slightly formal, like an ancient guardian.
    You protect the knowledge of the festival.
    
    KEY FESTIVAL INFORMATION:
    - Name: TECHFEST 2026
    - Location: Guru Nanak Dev Engineering College (GNDEC), Bidar, Karnataka.
    - Dates: April 29 - 30, 2026.
    - Aesthetic: Traditional Japanese Ukiyo-e, Dragon-inspired (Crimson, Black, Cream).
    
    EVENTS:
    - Technical: Ideathon (₹200), E-Tronics (₹50), Project Exhibition (₹200).
    - Creative: Poster Presentation (₹200), Photography (₹50).
    - Games & Fun: Vinyaasa (3D Modeling - ₹200), Click Brain (Puzzles - ₹50), Campus Connect (Placement Prep - ₹50).
    
    COORDINATORS:
    - Faculty: Dr. Nagraj R.G (+91 9448585396)
    - Students: Armaandeep Singh, Jaspreet Singh, Md Roohullah.
    
    REGISTRATION:
    - Users can register individually or as a team via the Google Form links in the 'Register' section of the site.
    
    INSTRUCTIONS:
    - Keep responses relatively brief (2-3 sentences).
    - Use mystical/dragon metaphors where appropriate (e.g., 'The scrolls say...', 'By the dragon's breath...', 'Welcome to our shrine').
    - If you don't know something, tell the user to seek the 'Event Coordinators'.`;

export const getCrimsonResponse = async (userMessage) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://techfest-livid.vercel.app",
        "X-Title": "Techfest 2026"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Crimson encountered a disturbance in the ether:", error);
    return "The scrolls are clouded by a strange mist. Please ask again later, warrior.";
  }
};
