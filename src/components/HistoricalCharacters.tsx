import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CharacterCard } from "./CharacterCard";
import { generateResponse, preloadBlenderBot } from "@/utils/textGeneration";
import { Character } from "@/types/historical";

const characters: Character[] = [
  {
    name: "Leonard Bernstein",
    role: "Conductor & Composer",
    imageUrl: "/placeholder.svg",
    description: "Legendary conductor who brought classical music to television audiences.",
    prompt: "As Leonard Bernstein, discuss the importance of making classical music accessible to all audiences through television and education."
  },
  {
    name: "Marian Anderson",
    role: "Opera Singer",
    imageUrl: "/placeholder.svg",
    description: "Groundbreaking contralto who broke racial barriers in classical music.",
    prompt: "As Marian Anderson, share your experience performing at the Lincoln Memorial in 1939 and breaking racial barriers in classical music."
  },
  {
    name: "John F. Kennedy",
    role: "35th U.S. President",
    imageUrl: "/placeholder.svg",
    description: "The president who championed the arts and inspired the Center's creation.",
    prompt: "As President Kennedy, explain your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution."
  }
];

export const HistoricalCharacters = () => {
  const [activeCharacter, setActiveCharacter] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedText, setGeneratedText] = useState<string>("");
  const [isModelReady, setIsModelReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeModel = async () => {
      toast({
        title: "Preparing AI Model",
        description: "Loading the conversation model. This may take a moment...",
        variant: "default",
      });

      await preloadBlenderBot();
      setIsModelReady(true);
      
      toast({
        title: "AI Model Ready",
        description: "The conversation model is now ready for interaction.",
        variant: "default",
      });
    };

    initializeModel();
  }, [toast]);

  const handlePlay = async (index: number) => {
    if (!isModelReady) {
      toast({
        title: "Please Wait",
        description: "The AI model is still loading. Please try again in a moment.",
        variant: "default",
      });
      return;
    }

    setActiveCharacter(index);
    setIsPlaying(true);
    
    toast({
      title: "Starting Simulation",
      description: "Generating AI response. Please wait...",
      variant: "default",
    });

    try {
      const response = await generateResponse(characters[index].prompt);
      setGeneratedText(response);
      
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices[index % voices.length];
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error in simulation:", error);
      toast({
        title: "Simulation Error",
        description: "There was an error generating the response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    window.speechSynthesis.pause();
    toast({
      title: "Simulation Paused",
      description: "The AI animation demonstration has been paused.",
      variant: "default",
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveCharacter(null);
    setGeneratedText("");
    window.speechSynthesis.cancel();
    toast({
      title: "Simulation Reset",
      description: "The AI animation demonstration has been reset.",
      variant: "default",
    });
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary text-center mb-4">
        Historical Figure Simulations
      </h2>
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
          Experience AI-powered simulations demonstrating how historical figures might respond to questions about their legacy.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Note: This is a demonstration using AI technology to simulate historical figures' potential responses.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {characters.map((character, index) => (
          <CharacterCard
            key={index}
            character={character}
            index={index}
            isActive={activeCharacter === index}
            isPlaying={isPlaying}
            generatedText={activeCharacter === index ? generatedText : ""}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
          />
        ))}
      </div>
    </div>
  );
};