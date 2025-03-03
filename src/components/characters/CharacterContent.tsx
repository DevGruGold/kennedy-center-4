
import { Character } from "@/types/historical";
import { TabsContent } from "@/components/ui/tabs";
import { CharacterProfile } from "./CharacterProfile";
import { KennedyChat } from "../chat/kennedy/KennedyChat";
import { AdamsChat } from "../chat/adams/AdamsChat";
import { GrantChat } from "../chat/grant/GrantChat";
import { LeeChat } from "../chat/lee/LeeChat";
import { LincolnChat } from "../chat/lincoln/LincolnChat";
import { WashingtonChat } from "../chat/washington/WashingtonChat";
import { MLKChat } from "../chat/mlk/MLKChat";
import { DouglassChat } from "../chat/douglass/DouglassChat";
import { JeffersonChat } from "../chat/jefferson/JeffersonChat";
import { FranklinChat } from "../chat/franklin/FranklinChat";
import { HamiltonChat } from "../chat/hamilton/HamiltonChat";
import { AnthonyChat } from "../chat/anthony/AnthonyChat";
import { RooseveltChat } from "../chat/roosevelt/RooseveltChat";

interface CharacterContentProps {
  character: Character;
  isPlaying: boolean;
  generatedText: string;
  onPlaybackComplete: () => void;
}

export const CharacterContent = ({
  character,
  isPlaying,
  generatedText,
  onPlaybackComplete
}: CharacterContentProps) => {
  const getChatComponent = () => {
    const value = character.name.toLowerCase().replace(/\s+/g, '');
    switch (value) {
      case 'johnfkennedy':
        return <KennedyChat voiceId={character.voiceId} />;
      case 'johnadams':
        return <AdamsChat voiceId={character.voiceId} />;
      case 'georgewashington':
        return <WashingtonChat voiceId={character.voiceId} />;
      case 'ulyssessgrant':
        return <GrantChat voiceId={character.voiceId} />;
      case 'robertelee':
        return <LeeChat voiceId={character.voiceId} />;
      case 'abrahamlincoln':
        return <LincolnChat voiceId={character.voiceId} />;
      case 'martinlutherkingjr.':
        return <MLKChat voiceId={character.voiceId} />;
      case 'frederickdouglass':
        return <DouglassChat voiceId={character.voiceId} />;
      case 'thomasjefferson':
        return <JeffersonChat voiceId={character.voiceId} />;
      case 'benjaminfranklin':
        return <FranklinChat voiceId={character.voiceId} />;
      case 'alexanderhamilton':
        return <HamiltonChat voiceId={character.voiceId} />;
      case 'susanb.anthony':
        return <AnthonyChat voiceId={character.voiceId} />;
      case 'theodoreroosevelt':
        return <RooseveltChat voiceId={character.voiceId} />;
      default:
        return null;
    }
  };

  return (
    <TabsContent value={character.name.toLowerCase().replace(/\s+/g, '')}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <CharacterProfile
          character={character}
          isPlaying={isPlaying}
          generatedText={generatedText}
          onPlaybackComplete={onPlaybackComplete}
        />
        <div className="h-full">
          {getChatComponent()}
        </div>
      </div>
    </TabsContent>
  );
};
