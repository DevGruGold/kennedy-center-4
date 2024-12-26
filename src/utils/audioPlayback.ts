import { supabase } from "@/integrations/supabase/client";

export const playWithElevenLabs = async (
  text: string,
  onWordBoundary?: (wordIndex: number) => void
): Promise<boolean> => {
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
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
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
      
      audio.onloadedmetadata = () => {
        if (onWordBoundary) {
          const wordDuration = audio.duration / words.length;
          const wordTimer = setInterval(() => {
            if (currentWordIndex < words.length) {
              onWordBoundary(currentWordIndex);
              currentWordIndex++;
            } else {
              clearInterval(wordTimer);
            }
          }, wordDuration * 1000);

          audio.onended = () => {
            clearInterval(wordTimer);
            onWordBoundary(-1); // Reset highlighting
            URL.revokeObjectURL(audioUrl);
            resolve(true);
          };
        }
      };

      audio.onerror = () => {
        console.error("Audio playback error");
        URL.revokeObjectURL(audioUrl);
        resolve(false);
      };

      audio.play().catch((error) => {
        console.error("Audio playback error:", error);
        URL.revokeObjectURL(audioUrl);
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