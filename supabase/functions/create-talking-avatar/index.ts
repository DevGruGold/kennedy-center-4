import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DID_API_KEY = Deno.env.get('DID_API_KEY');
const DID_API_URL = "https://api.d-id.com/talks";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, text } = await req.json();

    // Create talking avatar with D-ID API
    const response = await fetch(DID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: text,
        },
        source_url: imageUrl,
        config: {
          stitch: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`D-ID API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Get the result URL
    const resultResponse = await fetch(`${DID_API_URL}/${data.id}`, {
      headers: {
        'Authorization': `Basic ${DID_API_KEY}`,
      },
    });

    if (!resultResponse.ok) {
      throw new Error(`Failed to get result: ${resultResponse.statusText}`);
    }

    const resultData = await resultResponse.json();

    return new Response(
      JSON.stringify({ url: resultData.result_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});