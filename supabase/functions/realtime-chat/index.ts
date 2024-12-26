import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected websocket', { status: 400 })
  }

  // Get JWT from URL params for authentication
  const url = new URL(req.url)
  const jwt = url.searchParams.get('jwt')
  if (!jwt) {
    return new Response('Missing JWT', { status: 401 })
  }

  const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)

  clientSocket.onopen = () => {
    console.log('Client connected')
    
    // Connect to OpenAI's WebSocket
    const openaiWS = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [
        'realtime',
        `openai-insecure-api-key.${OPENAI_API_KEY}`,
        'openai-beta.realtime-v1',
      ]
    )

    openaiWS.onopen = () => {
      console.log('Connected to OpenAI')
      
      // Forward client messages to OpenAI
      clientSocket.onmessage = (event) => {
        if (openaiWS.readyState === 1) {
          console.log('Forwarding to OpenAI:', event.data)
          openaiWS.send(event.data)
        }
      }
    }

    // Forward OpenAI responses to client
    openaiWS.onmessage = (event) => {
      console.log('Received from OpenAI:', event.data)
      clientSocket.send(event.data)
    }

    openaiWS.onerror = (error) => {
      console.error('OpenAI WebSocket error:', error)
      clientSocket.send(JSON.stringify({
        type: 'error',
        message: 'OpenAI connection error'
      }))
    }

    openaiWS.onclose = () => {
      console.log('OpenAI connection closed')
      clientSocket.close()
    }
  }

  clientSocket.onerror = (error) => {
    console.error('Client WebSocket error:', error)
  }

  clientSocket.onclose = () => {
    console.log('Client disconnected')
  }

  return response
})