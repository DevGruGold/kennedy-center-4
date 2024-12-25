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

const generateWithOpenAI = async (prompt: string): Promise<string> {
  try {
    const { data: secretData } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'OPENAI_API_KEY')
      .maybeSingle();

    if (!secretData) {
      throw new Error('OpenAI API key not found');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretData.key_value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a historical figure simulation. Respond in character based on the provided context.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw error;
  }
};

const generateWithGemini = async (prompt: string): Promise<string> {
  try {
    const { data: secretData } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'GEMINI_API_KEY')
      .maybeSingle();

    if (!secretData) {
      throw new Error('Gemini API key not found');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': secretData.key_value,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
};

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Try BlenderBot first
    if (blenderBotModel) {
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
      }
    }

    // Try OpenAI as first fallback
    try {
      return await generateWithOpenAI(prompt);
    } catch (openAIError) {
      console.error("OpenAI fallback failed:", openAIError);
    }

    // Try Gemini as second fallback
    try {
      return await generateWithGemini(prompt);
    } catch (geminiError) {
      console.error("Gemini fallback failed:", geminiError);
    }

    // If all attempts fail, return a graceful error message
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  } catch (error) {
    console.error("All generation attempts failed:", error);
    return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
  }
};