import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CharacterCard } from "./CharacterCard";
import { generateResponse } from "@/utils/textGeneration";
import { Character } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

const character: Character = {
  name: "John F. Kennedy",
  role: "35th U.S. President",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/800px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg",
  description: "Experience an AI simulation of President Kennedy discussing his vision for the arts and the Kennedy Center.",
  prompt: "Share your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution. Keep your response natural and conversational, focusing on your passion for cultural advancement."
};

export const HistoricalCharacters = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedText, setGeneratedText] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    console.log("Component mounted");
    toast({
      title: "AI Model Ready",
      description: "The JFK simulation model is ready for interaction.",
      variant: "default",
    });
  }, [toast]);

  const playWithElevenLabs = async (text: string) => {
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
              stability: 0.5,
              similarity_boost: 0.75,
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
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
      return true;
    } catch (error) {
      console.error("ElevenLabs error:", error);
      return false;
    }
  };

  const handlePlay = async () => {
    console.log("Play button clicked");
    setIsPlaying(true);
    setGeneratedText("");
    
    toast({
      title: "Starting Simulation",
      description: "Generating President Kennedy's response. Please wait...",
      variant: "default",
    });

    try {
      console.log("Attempting to generate response...");
      const response = await generateResponse(character.prompt);
      console.log("Received AI response:", response);
      
      if (!response) {
        throw new Error("No response received from AI");
      }

      setGeneratedText(response);
      
      // Try ElevenLabs first, fall back to browser speech synthesis if it fails
      const elevenLabsSuccess = await playWithElevenLabs(response);
      
      if (!elevenLabsSuccess) {
        console.log("Falling back to browser speech synthesis");
        const utterance = new SpeechSynthesisUtterance(response);
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
          setIsPlaying(false);
        };
      }
    } catch (error) {
      console.error("Error in simulation:", error);
      toast({
        title: "Simulation Error",
        description: `Error: ${error.message}. Please try again.`,
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    window.speechSynthesis.pause();
    toast({
      title: "Simulation Paused",
      description: "The AI simulation has been paused.",
      variant: "default",
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setGeneratedText("");
    window.speechSynthesis.cancel();
    toast({
      title: "Simulation Reset",
      description: "The AI simulation has been reset.",
      variant: "default",
    });
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary text-center mb-4">
        Meet President Kennedy
      </h2>
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
          Experience an AI-powered simulation of President Kennedy discussing his vision for the arts and culture in America.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Powered by Google's Gemini Pro AI model and ElevenLabs voice synthesis
        </p>
      </div>
      
      <div className="max-w-xl mx-auto">
        <CharacterCard
          character={character}
          index={0}
          isActive={true}
          isPlaying={isPlaying}
          generatedText={generatedText}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};