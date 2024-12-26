import { Character } from "@/types/historical";
import { TalkingAvatar } from "../TalkingAvatar";

interface CharacterProfileProps {
  character: Character;
  isPlaying: boolean;
  generatedText: string;
  onPlaybackComplete: () => void;
}

export const CharacterProfile = ({ 
  character,
  isPlaying,
  generatedText,
  onPlaybackComplete
}: CharacterProfileProps) => {
  return (
    <div>
      <img
        src={character.imageUrl}
        alt={character.name}
        className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
      />
      <h3 className="text-2xl font-semibold text-center mb-2">{character.name}</h3>
      <p className="text-gray-600 text-center">{character.description}</p>
    </div>
  );
};