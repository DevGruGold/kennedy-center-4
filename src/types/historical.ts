export interface Character {
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  prompt: string;
}

export interface CharacterCardProps {
  character: Character;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  generatedText: string;
  onPlay: (index: number) => void;
  onPause: () => void;
  onReset: () => void;
}