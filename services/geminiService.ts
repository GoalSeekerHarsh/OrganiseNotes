import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateContentWithGrounding(prompt: string): Promise<{ text: string; sources: GroundingChunk[] }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: The `contents` property for a simple text prompt should be a string.
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to get a response from the AI. Please check your API key and try again.");
  }
}
