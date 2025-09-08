
import { GoogleGenAI } from "@google/genai";
import { DrivingDataPoint } from '../types';

// IMPORTANT: The API key is sourced from environment variables for security.
// Do not hardcode API keys in the application.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully,
  // maybe disable the AI feature and show a message to the user.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeDrivingData = async (data: DrivingDataPoint[]): Promise<string> => {
  if (!API_KEY) {
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
    const response = await ai.models.generateContent({
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
