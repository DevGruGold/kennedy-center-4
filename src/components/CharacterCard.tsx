import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { CharacterCardProps } from "@/types/historical";

export const CharacterCard = ({
  character,
  index,
  isActive,
  isPlaying,
  generatedText,
  onPlay,
  onPause,
  onReset,
}: CharacterCardProps) => {
  return (
    <Card 
      className={`transition-all duration-300 ${
        isActive ? 'ring-2 ring-secondary' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={character.imageUrl}
            alt={character.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isActive && isPlaying ? 'animate-pulse' : ''
            }`}
          />
        </div>
        <h3 className="text-xl font-semibold mb-1">{character.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{character.role}</p>
        <p className="text-sm text-gray-600 mb-4">{character.description}</p>
        
        {isActive && generatedText && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm italic">{generatedText}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          {isActive && isPlaying ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onPause}
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause Demo
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => onPlay(index)}
            >
              <Play className="w-4 h-4 mr-2" />
              Start Demo
            </Button>
          )}
          <Button 
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={!isActive}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};