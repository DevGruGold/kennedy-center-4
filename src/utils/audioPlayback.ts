import { supabase } from "@/integrations/supabase/client";

export const playWithElevenLabs = async (text: string) => {
  try {
    const { data: secrets, error } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'ELEVEN_LABS_API_KEY')
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching ElevenLabs API key:", error);
      throw new Error("Failed to fetch ElevenLabs API key");
    }

    if (!secrets?.key_value) {
      console.error("ElevenLabs API key not found in secrets");
      throw new Error("ElevenLabs API key not found");
    }

    const ELEVEN_LABS_API_KEY = secrets.key_value;
    const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Using Chris's voice
    
    console.log("Making request to ElevenLabs API...");
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream/with-timestamps?optimize_streaming_latency=0`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.3, // Lower stability for more expressive speech
            similarity_boost: 0.85, // Higher similarity to better match the voice characteristics
            style: 1.0, // Maximum style transfer for stronger accent
            use_speaker_boost: true // Enhanced voice clarity
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("ElevenLabs API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      throw new Error(`Failed to generate speech: ${response.statusText}`);
    }

    console.log("Successfully received audio response");
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve(true);
      };
      audio.play();
    });
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return false;
  }
};

export const playWithBrowserSpeech = (text: string) => {
  return new Promise<boolean>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices);
    
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => 
        v.name.includes("Male") && v.name.includes("US")
      ) || voices[0];
      utterance.voice = preferredVoice;
      console.log("Selected voice:", preferredVoice);
    }
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    utterance.onend = () => {
      console.log("Speech synthesis completed");
      resolve(true);
    };
  });
};