import { generateWithGemini } from './textGeneration/geminiService';
import { generateWithOpenAI } from './textGeneration/openaiService';
import { generateWithBlenderBot, preloadBlenderBot } from './textGeneration/blenderBotService';

export { preloadBlenderBot };

export const generateResponse = async (prompt: string): Promise<string> => {
  // Try Gemini first as it's more reliable for this use case
  try {
    return await generateWithGemini(prompt);
  } catch (geminiError) {
    console.error("Gemini failed:", geminiError);
    
    // Try OpenAI as first fallback
    try {
      return await generateWithOpenAI(prompt);
    } catch (openAIError) {
      console.error("OpenAI fallback failed:", openAIError);
    }
    
    // Try BlenderBot as last resort
    try {
      return await generateWithBlenderBot(prompt);
    } catch (error) {
      console.error("BlenderBot error:", error);
    }

    // If all attempts fail, return a graceful error message
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};