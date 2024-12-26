import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { KennedyChat } from "./KennedyChat";
import { CaesarChat } from "./CaesarChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const characters: Character[] = [
  {
    name: "John F. Kennedy",
    role: "35th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/800px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg",
    description: "Experience an AI simulation of President Kennedy discussing his vision for the arts and the Kennedy Center.",
    prompt: "Share your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution. Keep your response natural and conversational, focusing on your passion for cultural advancement."
  },
  {
    name: "Julius Caesar",
    role: "Roman Emperor",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Julius_Caesar_%28100-44_BC%29.JPG/800px-Julius_Caesar_%28100-44_BC%29.JPG",
    description: "Engage with the legendary Roman leader on topics of leadership, conquest, and Roman culture.",
    prompt: "Share your insights on leadership, the Roman Empire, and your military conquests. Keep your responses natural and engaging, focusing on your experiences as a leader."
  }
];

export const HistoricalCharacters = () => {
  const { toast } = useToast();
  const [activeCharacter, setActiveCharacter] = useState("kennedy");

  useEffect(() => {
    console.log("Component mounted");
    toast({
      title: "AI Models Ready",
      description: "The historical figure simulations are ready for interaction.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary text-center mb-4">
        Meet Historical Figures
      </h2>
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
          Experience AI-powered simulations of historical figures discussing their lives, achievements, and perspectives.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Powered by Google's Gemini Pro AI model and ElevenLabs voice synthesis
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="kennedy" className="w-full" onValueChange={setActiveCharacter}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="kennedy">John F. Kennedy</TabsTrigger>
            <TabsTrigger value="caesar">Julius Caesar</TabsTrigger>
          </TabsList>
          <TabsContent value="kennedy">
            <div className="mb-8">
              <img
                src={characters[0].imageUrl}
                alt={characters[0].name}
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-center mb-2">{characters[0].name}</h3>
              <p className="text-gray-600 text-center">{characters[0].description}</p>
            </div>
            <KennedyChat />
          </TabsContent>
          <TabsContent value="caesar">
            <div className="mb-8">
              <img
                src={characters[1].imageUrl}
                alt={characters[1].name}
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-center mb-2">{characters[1].name}</h3>
              <p className="text-gray-600 text-center">{characters[1].description}</p>
            </div>
            <CaesarChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};