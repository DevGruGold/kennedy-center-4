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
    console.log('Starting Gemini API request process...');
    console.log('Fetching Gemini API key from Supabase secrets...');
    
    // Log the query we're about to make
    console.log('Executing Supabase query for GEMINI_API_KEY...');
    
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'GEMINI_API_KEY')
      .limit(1)
      .maybeSingle();

    // Log the raw response
    console.log('Supabase query response:', { data: secretData, error: secretError });

    if (secretError) {
      console.error('Error fetching Gemini API key:', secretError);
      throw new Error(`Failed to fetch Gemini API key: ${secretError.message}`);
    }

    if (!secretData) {
      console.error('No Gemini API key found in secrets. Available data:', secretData);
      
      // Let's try to fetch all secrets to see what's available (just names for security)
      const { data: allSecrets, error: allSecretsError } = await supabase
        .from('secrets')
        .select('key_name')
        .limit(10);
      
      console.log('Available secrets in database:', allSecrets);
      if (allSecretsError) {
        console.error('Error fetching all secrets:', allSecretsError);
      }
      
      throw new Error('Gemini API key not found. Please add it to Supabase secrets.');
    }

    const apiKey = secretData.key_value;
    console.log('Successfully retrieved Gemini API key (length):', apiKey?.length || 0);
    console.log('Preparing request to Gemini API...');

    const requestBody = {
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
    };

    console.log('Sending request to Gemini API with body structure:', {
      ...requestBody,
      contents: '[CONTENT HIDDEN FOR SECURITY]'
    });
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('Received response from Gemini API:', {
      status: response.status,
      hasChoices: !!data.candidates?.length,
      firstChoiceLength: data.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0
    });
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Successfully generated text (length):', generatedText.length);
    return generatedText;
  } catch (error) {
    console.error('Error in Gemini generation:', error);
    throw error;
  }
};