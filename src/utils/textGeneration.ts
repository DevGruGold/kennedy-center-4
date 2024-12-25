import { pipeline } from "@huggingface/transformers";
import { supabase } from "@/integrations/supabase/client";

interface GenerationOutput {
  generated_text: string;
}

const generateHuggingFaceResponse = async (prompt: string): Promise<string> => {
  const generator = await pipeline(
    "text-generation",
    "microsoft/phi-2",  // Using a more reliable model that's available for browsers
    { 
      device: "webgpu"
    }
  );

  const output = await generator(prompt, {
    max_length: 100,
    num_return_sequences: 1,
  });

  if (Array.isArray(output)) {
    const firstOutput = output[0] as GenerationOutput;
    return String(firstOutput.generated_text || "No response generated");
  }
  
  return String((output as GenerationOutput).generated_text || "No response generated");
};

const generateOpenAIResponse = async (prompt: string): Promise<string> => {
  const { data: { OPENAI_API_KEY }, error } = await supabase
    .from('secrets')
    .select('OPENAI_API_KEY')
    .single();

  if (error || !OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const generateReplicateResponse = async (prompt: string): Promise<string> => {
  const { data: { REPLICATE_API_KEY }, error } = await supabase
    .from('secrets')
    .select('REPLICATE_API_KEY')
    .single();

  if (error || !REPLICATE_API_KEY) {
    throw new Error('Replicate API key not found');
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${REPLICATE_API_KEY}`,
    },
    body: JSON.stringify({
      version: "2b017567119ce1987cf8345b86545589227154c93d02f351598f471b7791f1df",
      input: {
        prompt: prompt,
        max_new_tokens: 150,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Replicate API request failed');
  }

  const data = await response.json();
  return String(data.output || "No response generated");
};

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    // Try Hugging Face first
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