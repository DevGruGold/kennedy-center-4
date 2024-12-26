import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { artworkId } = await req.json()
    
    if (!artworkId) {
      throw new Error('Artwork ID is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get artwork details
    const { data: artwork, error: artworkError } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', artworkId)
      .single()

    if (artworkError || !artwork) {
      throw new Error('Artwork not found')
    }

    // Create token metadata
    const tokenMetadata = {
      name: artwork.title,
      description: artwork.description,
      image: artwork.image_url,
      attributes: [
        {
          trait_type: "Artist",
          value: artwork.creator_id
        },
        {
          trait_type: "Creation Date",
          value: artwork.created_at
        }
      ]
    }

    // Simulate blockchain interaction (in production, this would interact with actual smart contracts)
    const mockContractAddress = `0x${crypto.randomUUID().replace(/-/g, '')}`
    const mockTransactionHash = `0x${crypto.randomUUID().replace(/-/g, '')}`

    // Create token record
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .insert({
        artwork_id: artworkId,
        token_uri: `ipfs://mock/${artworkId}`,
        owner_id: artwork.creator_id,
        contract_address: mockContractAddress,
        token_metadata: tokenMetadata,
        blockchain_status: 'minted',
        transaction_hash: mockTransactionHash
      })
      .select()
      .single()

    if (tokenError) {
      throw tokenError
    }

    return new Response(
      JSON.stringify({ 
        message: 'Token minted successfully',
        token 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})