import { supabase } from "@/integrations/supabase/client";

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export const playWithElevenLabs = async (
  text: string,
  onWordBoundary?: (wordIndex: number) => void
) => {
  try {
    const { data: secrets } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'ELEVEN_LABS_API_KEY')
      .maybeSingle();
    
    if (!secrets?.key_value) {
      throw new Error("ElevenLabs API key not found");
    }

    const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Chris's voice for JFK
    const voiceSettings: VoiceSettings = {
      stability: 0.3,
      similarity_boost: 0.85,
      style: 1.0,
      use_speaker_boost: true
    };
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream?optimize_streaming_latency=0`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": secrets.key_value,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: voiceSettings,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise<void>((resolve) => {
      let words = text.split(' ');
      let currentWordIndex = 0;
      
      // Estimate word timing based on audio duration
      audio.onloadedmetadata = () => {
        const wordDuration = audio.duration / words.length;
        let wordTimer = setInterval(() => {
          if (currentWordIndex < words.length) {
            onWordBoundary?.(currentWordIndex);
            currentWordIndex++;
          } else {
            clearInterval(wordTimer);
          }
        }, wordDuration * 1000);
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };

      audio.play();
    });
  } catch (error) {
    console.error("ElevenLabs error:", error);
    throw error;
  }
};