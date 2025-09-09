import { GoogleGenAI } from "@google/genai";
import { DrivingDataPoint } from '../types';

// IMPORTANT: The API key is sourced from environment variables for security.
// Do not hardcode API keys in the application.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

// Lazily initialize the AI instance to prevent app crash on start if API_KEY is missing.
const getAiInstance = (): GoogleGenAI | null => {
  if (!ai && API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
}

export const analyzeDrivingData = async (data: DrivingDataPoint[]): Promise<string> => {
  const aiInstance = getAiInstance();
  if (!aiInstance) {
    return "AI feature is currently unavailable. API Key is not configured.";
  }
  
  if (data.length < 5) {
    return "Not enough driving data to analyze. Please drive for a bit longer.";
  }

  const model = 'gemini-2.5-flash';
  
  // Take the last 20 data points for recent analysis
  const recentData = data.slice(-20);
  const dataString = recentData.map(p => `Speed: ${p.speed.toFixed(1)} km/h`).join(', ');

  const prompt = `
    You are an expert motorcycle driving coach AI.
    Analyze the following recent driving data which consists of speed readings (in km/h).
    Based on the most recent patterns, provide one single, concise, actionable voice command (under 15 words) to help the rider improve fuel mileage *right now*.
    For example: "Avoid sudden acceleration," or "Maintain a steady speed for better mileage."
    If driving is smooth and efficient, respond with "Keep up the smooth driving."

    Recent Driving Data:
    [${dataString}]
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.4,
        thinkingConfig: { thinkingBudget: 0 }, // For low latency
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't analyze the data right now. Please check your network connection and try again.";
  }
};