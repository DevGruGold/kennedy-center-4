import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Character } from "@/types/historical";

interface CharacterTabsProps {
  characters: Character[];
}

export const CharacterTabs = ({ characters }: CharacterTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 mb-8">
      {characters.map((character) => (
        <TabsTrigger
          key={character.name.toLowerCase().replace(/\s+/g, '')}
          value={character.name.toLowerCase().replace(/\s+/g, '')}
          className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-4"
        >
          {character.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};