import { pipeline } from "@huggingface/transformers";
import { supabase } from "@/integrations/supabase/client";

interface GenerationOutput {
  generated_text: string;
}

let blenderBotModel: any = null;

export const preloadBlenderBot = async () => {
  if (blenderBotModel) return;
  
  try {
    console.log('Initializing BlenderBot model...');
    blenderBotModel = await pipeline(
      "text2text-generation",
      "facebook/blenderbot-400M-distill",
      { 
        revision: "main",
      }
    );
    console.log('BlenderBot model loaded successfully');
  } catch (error) {
    console.error('Error loading BlenderBot:', error);
    blenderBotModel = null;
  }
};

const generateBlenderBotResponse = async (prompt: string): Promise<string> => {
  if (!blenderBotModel) {
    await preloadBlenderBot();
  }

  if (!blenderBotModel) {
    throw new Error('BlenderBot model not available');
  }

  const output = await blenderBotModel(prompt, {
    max_length: 150,
    num_return_sequences: 1,
    temperature: 0.7,
    top_p: 0.9,
    do_sample: true
  });

  if (Array.isArray(output)) {
    const firstOutput = output[0] as GenerationOutput;
    return String(firstOutput.generated_text || "").trim();
  }
  
  return String((output as GenerationOutput).generated_text || "").trim();
};

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    return await generateBlenderBotResponse(prompt);
  } catch (error) {
    console.error("BlenderBot error:", error);
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};