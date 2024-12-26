import { supabase } from "@/integrations/supabase/client";

export const playWithElevenLabs = async (
  text: string,
  voiceId: string,
  onWordBoundary?: (wordIndex: number) => void
): Promise<boolean> => {
  try {
    // Use browser's built-in speech synthesis
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      
      // Get available voices and try to set a male US English voice
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(voice => 
        voice.lang.includes('en-US') && voice.name.includes('Male')
      );
      
      if (usVoice) {
        utterance.voice = usVoice;
      }

      // Handle word boundaries if callback provided
      if (onWordBoundary) {
        const words = text.split(' ');
        let currentWord = 0;
        
        utterance.onboundary = (event) => {
          if (event.name === 'word' && currentWord < words.length) {
            onWordBoundary(currentWord);
            currentWord++;
          }
        };
      }

      utterance.onend = () => {
        resolve(true);
      };

      utterance.onerror = () => {
        console.error("Speech synthesis error");
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    });
  } catch (error) {
    console.error("Speech synthesis error:", error);
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