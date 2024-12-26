import { supabase } from "@/integrations/supabase/client";

export const playWithElevenLabs = async (
  text: string,
  voiceId: string,
  onWordBoundary?: (wordIndex: number) => void
): Promise<boolean> => {
  try {
    console.log("Starting ElevenLabs TTS process...");
    
    const { data: secrets } = await supabase
      .from('secrets')
      .select('key_value')
      .eq('key_name', 'ELEVEN_LABS_API_KEY')
      .maybeSingle();
    
    if (!secrets?.key_value) {
      console.error("ElevenLabs API key not found in Supabase secrets");
      throw new Error("ElevenLabs API key not found");
    }

    console.log("Retrieved API key from Supabase, initiating TTS request...");
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": secrets.key_value,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.3,
            similarity_boost: 0.85,
            style: 1.0,
            use_speaker_boost: true
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    return new Promise<boolean>((resolve) => {
      const words = text.split(' ');
      let currentWordIndex = 0;
      let wordTimer: NodeJS.Timeout | null = null;
      
      const cleanupResources = () => {
        if (wordTimer) {
          clearInterval(wordTimer);
          wordTimer = null;
        }
        if (onWordBoundary) {
          onWordBoundary(-1); // Reset highlighting
        }
        URL.revokeObjectURL(audioUrl);
      };

      audio.onloadedmetadata = () => {
        console.log("Audio loaded, duration:", audio.duration);
        if (onWordBoundary) {
          const averageWordsPerMinute = 130; // Adjusted for more natural timing
          const wordDuration = (60 / averageWordsPerMinute);
          
          wordTimer = setInterval(() => {
            if (currentWordIndex < words.length) {
              console.log("Highlighting word:", currentWordIndex, words[currentWordIndex]);
              onWordBoundary(currentWordIndex);
              currentWordIndex++;
            } else {
              cleanupResources();
            }
          }, wordDuration * 1000);
        }
      };

      audio.onended = () => {
        console.log("Audio playback ended");
        cleanupResources();
        resolve(true);
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        cleanupResources();
        resolve(false);
      };

      console.log("Starting audio playback...");
      audio.play().catch((error) => {
        console.error("Audio playback error:", error);
        cleanupResources();
        resolve(false);
      });
    });
  } catch (error) {
    console.error("ElevenLabs error:", error);
    return false;
  }
};

export const playWithBrowserSpeech = async (text: string): Promise<void> => {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};