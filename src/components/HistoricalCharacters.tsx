
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { Tabs } from "@/components/ui/tabs";
import { CharacterTabs } from "./characters/CharacterTabs";
import { CharacterContent } from "./characters/CharacterContent";

const characters: Character[] = [
  {
    name: "John F Kennedy",
    role: "35th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/800px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg",
    description: "Experience an AI simulation of President Kennedy discussing his vision for the arts and the Kennedy Center.",
    voiceId: "iP95p4xoKVk53GoZ742B",
    prompt: "Share your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution. Emphasize your belief in the power of arts to inspire and unite the nation. Keep your response natural and conversational, focusing on your passion for cultural advancement and the legacy you hope to leave through the Kennedy Center."
  },
  {
    name: "Thomas Jefferson",
    role: "3rd U.S. President & Declaration Author",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg/800px-Thomas_Jefferson_by_Rembrandt_Peale%2C_1800.jpg",
    description: "Engage with the author of the Declaration of Independence on liberty, democracy, and cultural progress.",
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center embody the democratic principles you championed. Discuss your vision of freedom, education, and artistic expression as foundational to a thriving republic. Emphasize your love of liberty and the importance of preserving artistic and intellectual freedom for future generations."
  },
  {
    name: "Benjamin Franklin",
    role: "Founding Father & Polymath",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Franklin-Benjamin-LOC.jpg/800px-Franklin-Benjamin-LOC.jpg",
    description: "Converse with this founding father, inventor, and diplomat on innovation, democracy, and cultural advancement.",
    voiceId: "XB0fDUnXU5powFXDhCwa",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center reflect your vision of a society that values education, innovation, and the arts. Discuss how your passion for science, diplomacy, and civic improvement aligns with modern cultural institutions, drawing from your experience as an inventor, statesman, and advocate for public education."
  },
  {
    name: "Alexander Hamilton",
    role: "Founding Father & First Treasury Secretary",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Alexander_Hamilton_portrait_by_John_Trumbull_1806.jpg/800px-Alexander_Hamilton_portrait_by_John_Trumbull_1806.jpg",
    description: "Discuss financial systems, federalism, and the importance of strong institutions with the architect of America's economic foundation.",
    voiceId: "nPczCjzI2devNBz1zQrb",
    prompt: "Share your perspective on how institutions like the Kennedy Center contribute to national unity and prosperity. Discuss your vision of a strong federal system supporting cultural advancement and how public arts funding aligns with your views on national development and identity. Keep your responses passionate and forward-thinking, drawing from your experience creating America's financial foundation."
  },
  {
    name: "Susan B. Anthony",
    role: "Women's Rights Activist",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Susan_B._Anthony_c1855.jpg/800px-Susan_B._Anthony_c1855.jpg",
    description: "Engage with this pioneering suffragist on equality, representation, and expanding liberty to all Americans.",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center can advance equality and representation. Discuss your vision of a society where all citizens have equal rights and opportunities, including access to arts and culture. Draw from your experience fighting for women's suffrage to highlight the ongoing journey toward full participation and representation in American civic and cultural life."
  },
  {
    name: "Theodore Roosevelt",
    role: "26th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg/800px-President_Roosevelt_-_Pach_Bros_%28cropped%29.jpg",
    description: "Discuss conservation, progressive reforms, and American culture with the energetic Rough Rider president.",
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    prompt: "Share your perspective on how institutions like the Kennedy Center embody your vision of a vibrant American culture and national spirit. Discuss the importance of both preserving tradition and embracing innovation in the arts, drawing parallels to your conservation efforts and progressive reforms. Keep your responses energetic and bold, emphasizing how cultural institutions contribute to national character and civic pride."
  },
  {
    name: "Martin Luther King Jr.",
    role: "Civil Rights Leader",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/800px-Martin_Luther_King%2C_Jr..jpg",
    description: "Engage with the civil rights leader on the transformative power of arts and culture in promoting equality and justice.",
    voiceId: "XB0fDUnXU5powFXDhCwa",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center can serve as beacons of unity and progress in our ongoing journey toward equality and justice. Discuss how the arts can bridge divides, inspire change, and help realize your dream of a society where all are judged by the content of their character. Keep your responses passionate and inspiring, drawing from your experience as a leader in the civil rights movement."
  },
  {
    name: "John Adams",
    role: "2nd U.S. President",
    imageUrl: "https://storage.googleapis.com/pai-images/2024-03-19/1710823200/1710823200.jpg",
    description: "Engage with the founding father on the importance of education, arts, and cultural development in a young republic.",
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    prompt: "Share your perspective on how institutions like the Kennedy Center embody your vision of promoting education and the arts in our republic. Discuss how cultural advancement strengthens democracy and enlightens citizens, drawing from your experience as a diplomat and advocate for education. Keep your responses thoughtful and philosophical, emphasizing the connection between cultural institutions and the preservation of liberty."
  },
  {
    name: "George Washington",
    role: "1st U.S. President",
    imageUrl: "https://storage.googleapis.com/pai-images/ae3e0b6cebf04cf0a9c6c5e1338eee66.jpeg",
    description: "Engage with the founding father on the importance of cultural institutions in building a strong national identity.",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center embody the foundational principles of our nation. Discuss how the arts and culture contribute to building a unified national identity while preserving individual liberty. Draw from your experience as the first president to emphasize the importance of cultural development in maintaining a strong republic."
  },
  {
    name: "Ulysses S Grant",
    role: "18th U.S. President",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ulysses_S_Grant_by_Brady_c1870-restored.jpg/800px-Ulysses_S_Grant_by_Brady_c1870-restored.jpg",
    description: "Engage with the Civil War general and president on topics of military strategy, leadership, and cultural unity.",
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center represent the unity we fought to preserve during the Civil War. Reflect on how the arts can heal national divisions, drawing parallels to post-Civil War reconciliation. Keep your responses direct and clear, emphasizing the importance of cultural institutions in strengthening national bonds."
  },
  {
    name: "Robert E Lee",
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
  },
  {
    name: "Frederick Douglass",
    role: "Abolitionist & Orator",
    imageUrl: "https://storage.googleapis.com/pai-images/2024-03-19/1710823200/frederick_douglass.jpg",
    description: "Engage with the renowned abolitionist and orator on education, cultural advancement, and human dignity.",
    voiceId: "XB0fDUnXU5powFXDhCwa", // Using Charlotte's voice for a deep, resonant tone
    prompt: "Share your perspective on how cultural institutions like the Kennedy Center can advance the cause of human dignity and education. Discuss how the arts can elevate society and promote understanding across racial divides, drawing from your experiences as an abolitionist and champion of human rights. Keep your responses eloquent and powerful, emphasizing the transformative power of education and culture."
  }
];

export const HistoricalCharacters = () => {
  const { toast } = useToast();
  const [activeCharacter, setActiveCharacter] = useState("johnfkennedy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  useEffect(() => {
    toast({
      title: "AI Models Ready",
      description: "The historical figure simulations are ready for interaction.",
      variant: "default",
    });
  }, [toast]);

  const handlePlaybackComplete = () => {
    setIsPlaying(false);
    setGeneratedText("");
  };

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
          <Tabs 
            defaultValue="johnfkennedy" 
            className="w-full" 
            onValueChange={setActiveCharacter}
          >
            <CharacterTabs characters={characters} />
            <div className="mt-8">
              {characters.map((character) => (
                <CharacterContent
                  key={character.name.toLowerCase().replace(/\s+/g, '')}
                  character={character}
                  isPlaying={isPlaying}
                  generatedText={generatedText}
                  onPlaybackComplete={handlePlaybackComplete}
                />
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
