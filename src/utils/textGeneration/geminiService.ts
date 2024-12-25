import { supabase } from "@/integrations/supabase/client";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export const generateWithGemini = async (prompt: string): Promise<string> => {
  try {
    const { data: secretData } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'GEMINI_API_KEY')
      .maybeSingle();

    if (!secretData) {
      throw new Error('Gemini API key not found');
    }

    // Using the Gemini 1.5 Pro model with specific configuration for JFK responses
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
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
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data: GeminiResponse = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
};