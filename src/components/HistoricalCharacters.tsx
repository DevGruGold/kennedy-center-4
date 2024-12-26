import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { KennedyChat } from "./chat/kennedy/KennedyChat";
import { GrantChat } from "./chat/grant/GrantChat";
import { LeeChat } from "./chat/lee/LeeChat";
import { LincolnChat } from "./chat/lincoln/LincolnChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const characters: Character[] = [
  {
    name: "John F. Kennedy",
    role: "35th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/800px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg",
    description: "Experience an AI simulation of President Kennedy discussing his vision for the arts and the Kennedy Center.",
    voiceId: "iP95p4xoKVk53GoZ742B",
    prompt: "Share your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution. Emphasize your belief in the power of arts to inspire and unite the nation. Keep your response natural and conversational, focusing on your passion for cultural advancement and the legacy you hope to leave through the Kennedy Center."
  },
  {
    name: "Ulysses S. Grant",
    role: "18th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ulysses_S_Grant_by_Brady_c1870-restored.jpg/800px-Ulysses_S_Grant_by_Brady_c1870-restored.jpg",
    description: "Engage with the Civil War general and president on topics of military strategy, leadership, and cultural unity.",
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center represent the unity we fought to preserve during the Civil War. Reflect on how the arts can heal national divisions, drawing parallels to post-Civil War reconciliation. Keep your responses direct and clear, emphasizing the importance of cultural institutions in strengthening national bonds."
  },
  {
    name: "Robert E. Lee",
    role: "Confederate General",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Robert_E_Lee_in_1863.png/800px-Robert_E_Lee_in_1863.png",
    description: "Discuss leadership, reconciliation, and the role of cultural institutions in national healing.",
    voiceId: "pqHfZKP75CvOlQylNhV4",
    prompt: "Reflect on the role of cultural institutions like the Kennedy Center in fostering national reconciliation and understanding. Share your thoughts on how the arts can bridge divides and promote healing, drawing from your post-war experience as an educator. Keep your responses dignified and thoughtful, emphasizing the importance of cultural unity in rebuilding relationships between all Americans."
  },
  {
    name: "Abraham Lincoln",
    role: "16th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/800px-Abraham_Lincoln_O-77_matte_collodion_print.jpg",
    description: "Engage with the president who preserved the Union and championed democracy and cultural unity.",
    voiceId: "XB0fDUnXU5powFXDhCwa",
    prompt: "Share your vision of how cultural institutions like the Kennedy Center embody the democratic ideals you fought to preserve. Discuss how the arts can strengthen our democracy and unite our diverse nation. Draw from your experiences during the Civil War to emphasize the importance of cultural spaces in maintaining our national fabric and ensuring that government of the people, by the people, for the people shall not perish from the earth."
  }
];

export const HistoricalCharacters = () => {
  const { toast } = useToast();
  const [activeCharacter, setActiveCharacter] = useState("kennedy");

  useEffect(() => {
    toast({
      title: "AI Models Ready",
      description: "The historical figure simulations are ready for interaction.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-primary text-center mb-6">
          Meet Historical Figures
        </h2>
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 mb-3 max-w-2xl mx-auto">
            Experience AI-powered simulations of historical figures discussing their lives, achievements, and perspectives.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Powered by advanced AI technology and realistic avatar generation
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <Tabs defaultValue="kennedy" className="w-full" onValueChange={setActiveCharacter}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1 mb-8">
              <TabsTrigger value="kennedy" className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-4">
                John F. Kennedy
              </TabsTrigger>
              <TabsTrigger value="grant" className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-4">
                Ulysses S. Grant
              </TabsTrigger>
              <TabsTrigger value="lee" className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-4">
                Robert E. Lee
              </TabsTrigger>
              <TabsTrigger value="lincoln" className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis px-2 md:px-4">
                Abraham Lincoln
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="kennedy">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <img
                      src={characters[0].imageUrl}
                      alt={characters[0].name}
                      className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-center mb-2">{characters[0].name}</h3>
                    <p className="text-gray-600 text-center">{characters[0].description}</p>
                  </div>
                  <div className="h-full">
                    <KennedyChat voiceId={characters[0].voiceId} key={activeCharacter} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="grant">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <img
                      src={characters[1].imageUrl}
                      alt={characters[1].name}
                      className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-center mb-2">{characters[1].name}</h3>
                    <p className="text-gray-600 text-center">{characters[1].description}</p>
                  </div>
                  <div className="h-full">
                    <GrantChat voiceId={characters[1].voiceId} key={activeCharacter} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lee">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <img
                      src={characters[2].imageUrl}
                      alt={characters[2].name}
                      className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-center mb-2">{characters[2].name}</h3>
                    <p className="text-gray-600 text-center">{characters[2].description}</p>
                  </div>
                  <div className="h-full">
                    <LeeChat voiceId={characters[2].voiceId} key={activeCharacter} />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lincoln">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <img
                      src={characters[3].imageUrl}
                      alt={characters[3].name}
                      className="w-full aspect-square object-cover rounded-lg shadow-lg mb-4"
                    />
                    <h3 className="text-2xl font-semibold text-center mb-2">{characters[3].name}</h3>
                    <p className="text-gray-600 text-center">{characters[3].description}</p>
                  </div>
                  <div className="h-full">
                    <LincolnChat voiceId={characters[3].voiceId} key={activeCharacter} />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};