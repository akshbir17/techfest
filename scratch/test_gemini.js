import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyC_ZYuo-HU0jXxY3xyvkU2yfJocXhi_kwU");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
  try {
    const prompt = "Explain how AI works in one sentence.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Success:", text);
  } catch (error) {
    console.error("Error details:", error);
  }
}

run();
