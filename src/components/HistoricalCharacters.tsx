import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CharacterCard } from "./CharacterCard";
import { generateResponse } from "@/utils/textGeneration";
import { Character } from "@/types/historical";
import { playWithElevenLabs, playWithBrowserSpeech } from "@/utils/audioPlayback";
import { SimulationControls } from "./simulation/SimulationControls";

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
        await playWithBrowserSpeech(response);
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