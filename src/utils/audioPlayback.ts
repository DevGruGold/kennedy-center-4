import { supabase } from "@/integrations/supabase/client";

export const playWithElevenLabs = async (
  text: string,
  voiceId: string,
  onWordBoundary?: (wordIndex: number) => void
): Promise<boolean> => {
  try {
    // Call Google Cloud Text-to-Speech API via Edge Function
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { 
        text,
        voiceId // We'll use this to select different voice profiles
      }
    });

    if (error) {
      console.error("Text-to-speech API error:", error);
      throw error;
    }

    if (!data?.audioContent) {
      throw new Error("No audio content received");
    }

    // Convert base64 audio content to audio buffer
    const audioData = atob(data.audioContent);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }

    // Create audio blob and play
    const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    return new Promise((resolve) => {
      // Handle word boundaries if callback provided
      if (onWordBoundary) {
        const words = text.split(' ');
        let currentWord = 0;
        const avgWordDuration = audio.duration / words.length;

        const wordInterval = setInterval(() => {
          if (currentWord < words.length) {
            onWordBoundary(currentWord);
            currentWord++;
          } else {
            clearInterval(wordInterval);
          }
        }, avgWordDuration * 1000);

        audio.onended = () => {
          clearInterval(wordInterval);
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };
      } else {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };
      }

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        resolve(false);
      };

      audio.play();
    });
  } catch (error) {
    console.error("Speech synthesis error:", error);
    return false;
  }
};