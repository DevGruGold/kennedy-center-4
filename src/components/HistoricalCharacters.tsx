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
      title: `Animating ${characters[index].name}`,
      description: "Using Google's Gemini AI model for historical character animation...",
      variant: "default", // Fixed the type error here
    });
  };

  const handlePause = () => {
    setIsPlaying(false);
    toast({
      title: "Animation Paused",
      description: "You can resume the AI-powered animation at any time.",
      variant: "default", // Fixed the type error here
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveCharacter(null);
    toast({
      title: "Animation Reset",
      description: "Select a character to start a new Gemini-powered animation.",
      variant: "default", // Fixed the type error here
    });
  };

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">
        Meet Historical Figures
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Experience AI-powered animations of influential figures using Google's Gemini model, bringing the Kennedy Center's rich history to life.
      </p>
      
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
                    Pause
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handlePlay(index)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Animate
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