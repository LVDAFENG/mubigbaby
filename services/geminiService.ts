import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const polishMemoryText = async (rawText: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing");
    return rawText;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Please rewrite the following memory description to be more romantic, poetic, and heartfelt, but keep it concise (under 100 words). Maintain the original meaning but make it sound beautiful like a diary entry of a loving partner. Text: "${rawText}"`,
    });

    return response.text?.trim() || rawText;
  } catch (error) {
    console.error("Error polishing text with Gemini:", error);
    return rawText; // Fallback to original
  }
};

export const suggestMemoryTitle = async (description: string): Promise<string> => {
  if (!apiKey) return "A Beautiful Memory";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, romantic, 3-5 word title for a memory described as: "${description}". Do not use quotes in the output.`,
    });
    return response.text?.trim() || "A Beautiful Memory";
  } catch (error) {
    return "A Beautiful Memory";
  }
};
