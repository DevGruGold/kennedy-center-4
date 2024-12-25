import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Character {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
}

const characters: Character[] = [
  {
    name: "Leonard Bernstein",
    role: "Conductor & Composer",
    imageUrl: "/placeholder.svg",
    description: "Legendary conductor who brought classical music to television audiences."
  },
  {
    name: "Marian Anderson",
    role: "Opera Singer",
    imageUrl: "/placeholder.svg",
    description: "Groundbreaking contralto who broke racial barriers in classical music."
  },
  {
    name: "John F. Kennedy",
    role: "35th U.S. President",
    imageUrl: "/placeholder.svg",
    description: "The president who championed the arts and inspired the Center's creation."
  }
];

export const HistoricalCharacters = () => {
  const [activeCharacter, setActiveCharacter] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const handlePlay = (index: number) => {
    setActiveCharacter(index);
    setIsPlaying(true);
    toast({
      title: "Starting Simulation",
      description: "This is a simulated AI animation demonstration. No actual historical figures are being recreated.",
      variant: "default",
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast({
      title: "Simulation Paused",
      description: "The AI animation demonstration has been paused.",
      variant: "default",
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveCharacter(null);
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
          Experience simulated AI-powered animations demonstrating how historical figures might be brought to life using advanced technology.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Note: This is a demonstration of potential future technology. No actual historical figures are being recreated.
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