import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Character } from "@/types/historical";

interface CharacterTabsProps {
  characters: Character[];
}

export const CharacterTabs = ({ characters }: CharacterTabsProps) => {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-gray-100/50 p-1 rounded-lg">
      {characters.map((character) => (
        <TabsTrigger
          key={character.name.toLowerCase().replace(/\s+/g, '')}
          value={character.name.toLowerCase().replace(/\s+/g, '')}
          className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm 
            px-3 py-2 text-sm font-medium transition-all hover:bg-white/50 
            whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {character.name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};