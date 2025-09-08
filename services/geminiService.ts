
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
  
  // Convert the data points to a more readable format for the prompt.
  const dataString = data.map(p => `Speed: ${p.speed.toFixed(1)} km/h`).join(', ');

  const prompt = `
    You are an expert motorcycle mechanic and fuel efficiency coach.
    Analyze the following driving data which consists of speed readings (in km/h) taken every few seconds.
    Based on this data, provide concise, actionable suggestions to improve the rider's fuel mileage.
    Focus on patterns like rapid acceleration, hard braking (inferred from rapid deceleration), and inconsistent speeds.
    Keep your response under 100 words.

    Driving Data:
    [${dataString}]
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.5,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't analyze the data right now. Please check your network connection and try again.";
  }
};
