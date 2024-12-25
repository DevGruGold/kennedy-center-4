import { generateWithGemini } from './textGeneration/geminiService';
import { generateWithOpenAI } from './textGeneration/openaiService';

export const generateResponse = async (prompt: string): Promise<string> => {
  // Try Gemini first as it's more reliable for this use case
  try {
    return await generateWithGemini(prompt);
  } catch (geminiError) {
    console.error("Gemini failed:", geminiError);
    
    // Try OpenAI as fallback
    try {
      return await generateWithOpenAI(prompt);
    } catch (openAIError) {
      console.error("OpenAI fallback failed:", openAIError);
      return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
    }
  }
};