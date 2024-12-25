import { generateWithGemini } from './textGeneration/geminiService';

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    console.log('Starting response generation for prompt:', prompt);
    const response = await generateWithGemini(prompt);
    if (!response) {
      throw new Error('No response received from Gemini API');
    }
    console.log('Successfully generated response:', response);
    return response;
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};