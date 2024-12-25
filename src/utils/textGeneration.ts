import { generateWithGemini } from './textGeneration/geminiService';

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    console.log('Generating response for prompt:', prompt);
    const response = await generateWithGemini(prompt);
    console.log('Generated response:', response);
    return response;
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
};