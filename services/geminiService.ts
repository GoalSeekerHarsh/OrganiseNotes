/**
 * @file This service handles all interactions with the Google Gemini API.
 *
 * NOTE ON API KEY SECURITY:
 * The API key is accessed via `process.env.API_KEY`. This is a secure practice
 * for handling sensitive credentials.
 *
 * In a secure deployment environment (like the one this app is designed for),
 * the `API_KEY` is injected as an environment variable at runtime. It is never
 * hardcoded or exposed in the client-side code that is sent to the user's browser.
 * This ensures that your API key remains confidential and cannot be viewed by
 * application users.
 */
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

// The GoogleGenAI instance is now initialized inside the `generateContentWithGrounding` function.
// This prevents the application from crashing on startup if the API key is not
// immediately available, as the check is deferred until an actual API call is made,
// where any potential errors can be caught and handled gracefully.

export async function generateContentWithGrounding(prompt: string): Promise<{ text: string; sources: GroundingChunk[] }> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // Use the full Content structure for robustness.
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
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
