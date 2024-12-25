import { HfInference } from '@huggingface/transformers';
import { supabase } from "@/integrations/supabase/client";

let blenderBotModel: any = null;

export const preloadBlenderBot = async () => {
  if (blenderBotModel) return;
  
  try {
    console.log('Initializing BlenderBot model...');
    
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'HUGGING_FACE_ACCESS_TOKEN')
      .maybeSingle();
      
    if (secretError) {
      console.error('Failed to retrieve Hugging Face token:', secretError);
      return;
    }

    if (!secretData) {
      console.error('Hugging Face token not found in secrets');
      return;
    }

    const pipeline = (await import('@huggingface/transformers')).pipeline;
    
    blenderBotModel = await pipeline(
      "text2text-generation",
      "Xenova/blenderbot-400M-new",
      { revision: "main" }
    );
    console.log('BlenderBot model loaded successfully');
  } catch (error) {
    console.error('Error loading BlenderBot:', error);
    blenderBotModel = null;
  }
};

export const generateWithBlenderBot = async (prompt: string): Promise<string> => {
  if (!blenderBotModel) {
    throw new Error('BlenderBot model not initialized');
  }

  try {
    const output = await blenderBotModel(prompt, {
      max_length: 150,
      num_return_sequences: 1,
      temperature: 0.7,
      top_p: 0.9,
      do_sample: true
    });
    
    if (Array.isArray(output)) {
      const firstOutput = output[0];
      return String(firstOutput.generated_text || "").trim();
    }
    return String(output.generated_text || "").trim();
  } catch (error) {
    console.error("BlenderBot error:", error);
    throw error;
  }
};