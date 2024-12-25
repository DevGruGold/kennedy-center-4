import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { pipeline } from "@huggingface/transformers";

interface Character {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  prompt: string;
}

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
  const { toast } = useToast();

  const generateResponse = async (character: Character) => {
    try {
      // Initialize the text generation pipeline
      const generator = await pipeline(
        "text-generation",
        "onnx-community/gpt2-medium",
        { device: "webgpu" }
      );

      // Generate response
      const output = await generator(character.prompt, {
        max_length: 100,
        num_return_sequences: 1,
      });

      return output[0].generated_text;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I apologize, but I'm having trouble accessing my knowledge at the moment. Please try again later.";
    }
  };

  const handlePlay = async (index: number) => {
    setActiveCharacter(index);
    setIsPlaying(true);
    
    toast({
      title: "Starting Simulation",
      description: "Generating AI response. Please wait...",
      variant: "default",
    });

    try {
      const response = await generateResponse(characters[index]);
      setGeneratedText(response);
      
      // Create speech synthesis
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Different voices for different characters
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
          <Card 
            key={index}
            className={`transition-all duration-300 ${
              activeCharacter === index ? 'ring-2 ring-secondary' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    activeCharacter === index && isPlaying ? 'animate-pulse' : ''
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-1">{character.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{character.role}</p>
              <p className="text-sm text-gray-600 mb-4">{character.description}</p>
              
              {activeCharacter === index && generatedText && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm italic">{generatedText}</p>
                </div>
              )}
              
              <div className="flex gap-2">
                {activeCharacter === index && isPlaying ? (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handlePause()}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Demo
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handlePlay(index)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Demo
                  </Button>
                )}
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  disabled={activeCharacter !== index}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};