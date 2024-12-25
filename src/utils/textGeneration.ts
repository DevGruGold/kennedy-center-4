import { generateWithGemini } from './textGeneration/geminiService';

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    return await generateWithGemini(prompt);
  } catch (error) {
    console.error("AI generation error:", error);
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};