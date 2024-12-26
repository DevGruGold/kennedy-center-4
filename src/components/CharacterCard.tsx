import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { CharacterCardProps } from "@/types/historical";
import { TalkingAvatar } from "./TalkingAvatar";

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
        isActive ? 'ring-2 ring-secondary shadow-lg scale-[1.02]' : ''
      }`}
    >
      <CardContent className="p-6">
        <div className="relative">
          <TalkingAvatar
            imageUrl={character.imageUrl}
            text={generatedText}
            isPlaying={isActive && isPlaying}
            onPlaybackComplete={onPause}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            {isActive && isPlaying ? (
              <Button 
                variant="secondary" 
                size="sm"
                className="shadow-lg"
                onClick={onPause}
              >
                <Pause className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="sm"
                className="shadow-lg"
                onClick={() => onPlay(index)}
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            <Button 
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!isActive}
              className="bg-white/90 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-1">{character.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{character.role}</p>
          <p className="text-sm text-gray-600 mb-4">{character.description}</p>
          
          {isActive && generatedText && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm italic text-gray-700">{generatedText}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};