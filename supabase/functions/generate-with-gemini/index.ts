import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }

    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

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

    console.log('Sending request to Gemini API...');
    
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
      console.error('Gemini API error:', {
        status: response.status,
        body: errorText
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error('Invalid Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }

    console.log('Successfully generated response (length):', generatedText.length);

    return new Response(
      JSON.stringify({ generatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-with-gemini function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});