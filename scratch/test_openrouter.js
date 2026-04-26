async function testOpenRouter() {
  const apiKey = "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";
  const model = "google/gemini-2.0-flash-001";
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173", // Optional, for OpenRouter analytics
        "X-Title": "Techfest 2026" // Optional
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello!" }
        ]
      })
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testOpenRouter();
