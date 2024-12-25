import { pipeline } from "@huggingface/transformers";
import { supabase } from "@/integrations/supabase/client";

interface GenerationOutput {
  generated_text: string;
}

const generateHuggingFaceResponse = async (prompt: string): Promise<string> => {
  const { data: hfToken, error: hfError } = await supabase
    .from('secrets')
    .select('key_value')
    .eq('key_name', 'HUGGING_FACE_ACCESS_TOKEN')
    .maybeSingle();

  if (hfError || !hfToken?.key_value) {
    throw new Error('Hugging Face token not found');
  }

  // Use a model better suited for empathetic conversation
  const generator = await pipeline(
    "text2text-generation",
    "facebook/blenderbot-400M-distill",
    { 
      revision: "main"
    }
  );

  const output = await generator(prompt, {
    max_length: 150,
    num_return_sequences: 1,
    temperature: 0.8,
    top_p: 0.9,
    do_sample: true
  });

  if (Array.isArray(output)) {
    const firstOutput = output[0] as GenerationOutput;
    return String(firstOutput.generated_text || "No response generated").trim();
  }
  
  return String((output as GenerationOutput).generated_text || "No response generated").trim();
};

const generateOpenAIResponse = async (prompt: string): Promise<string> => {
  const { data, error } = await supabase
    .from('secrets')
    .select('key_value')
    .eq('key_name', 'OPENAI_API_KEY')
    .maybeSingle();

  if (error || !data?.key_value) {
    throw new Error('OpenAI API key not found');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.key_value}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI simulating historical figures with empathy and understanding. Respond in first person, maintaining their personality, emotional depth, and speaking style while considering their historical context and experiences."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const responseData = await response.json();
  return responseData.choices[0].message.content;
};

const generateReplicateResponse = async (prompt: string): Promise<string> => {
  const { data, error } = await supabase
    .from('secrets')
    .select('key_value')
    .eq('key_name', 'REPLICATE_API_KEY')
    .maybeSingle();

  if (error || !data?.key_value) {
    throw new Error('Replicate API key not found');
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${data.key_value}`,
    },
    body: JSON.stringify({
      version: "2b017567119ce1987cf8345b86545589227154c93d02f351598f471b7791f1df",
      input: {
        prompt: `As a historical figure speaking with empathy and understanding: ${prompt}`,
        max_new_tokens: 150,
        temperature: 0.8,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Replicate API request failed');
  }

  const responseData = await response.json();
  return String(responseData.output || "No response generated").trim();
};

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Try Hugging Face first since we're using a conversational model
    return await generateHuggingFaceResponse(prompt);
  } catch (error) {
    console.error("Hugging Face error:", error);
    try {
      // Try OpenAI as first fallback
      return await generateOpenAIResponse(prompt);
    } catch (openAIError) {
      console.error("OpenAI error:", openAIError);
      try {
        // Try Replicate as second fallback
        return await generateReplicateResponse(prompt);
      } catch (replicateError) {
        console.error("Replicate error:", replicateError);
        return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
      }
    }
  }
};