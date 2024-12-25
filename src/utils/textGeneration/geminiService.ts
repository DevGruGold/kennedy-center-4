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

    if (!secretData?.key_value) {
      console.error('Gemini API key not found in secrets');
      throw new Error('Gemini API key not found');
    }

    console.log('Sending request to Gemini API with prompt:', prompt);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': secretData.key_value,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are President John F. Kennedy. Respond in first person as JFK, maintaining his characteristic speaking style and mannerisms. Focus on your passion for the arts and cultural advancement. Here is what you should respond to: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 40,
          maxOutputTokens: 800,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Gemini API response:', data);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
};