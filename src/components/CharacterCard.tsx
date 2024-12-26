import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { CharacterCardProps } from "@/types/historical";
import { playWithElevenLabs } from "@/utils/audioPlayback";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const { toast } = useToast();

  const handlePlayVoice = async () => {
    if (!generatedText) {
      toast({
        title: "No text to speak",
        description: "Generate some text first by starting the demo",
        variant: "destructive",
      });
      return;
    }

    setIsPlayingVoice(true);
    try {
      await playWithElevenLabs(generatedText, character.voiceId);
    } catch (error) {
      console.error("Voice playback error:", error);
      toast({
        title: "Voice Playback Error",
        description: "Failed to play voice. Please try again.",
        variant: "destructive",
      });
    }
    setIsPlayingVoice(false);
  };

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
          {isActive && generatedText && (
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayVoice}
              disabled={isPlayingVoice}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};