import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Character } from "@/types/historical";
import { KennedyChat } from "./KennedyChat";

const character: Character = {
  name: "John F. Kennedy",
  role: "35th U.S. President",
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/John_F._Kennedy%2C_White_House_color_photo_portrait.jpg/800px-John_F._Kennedy%2C_White_House_color_photo_portrait.jpg",
  description: "Experience an AI simulation of President Kennedy discussing his vision for the arts and the Kennedy Center.",
  prompt: "Share your vision for the arts in America and the importance of the Kennedy Center as a national cultural institution. Keep your response natural and conversational, focusing on your passion for cultural advancement."
};

export const HistoricalCharacters = () => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Component mounted");
    toast({
      title: "AI Model Ready",
      description: "The JFK simulation model is ready for interaction.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-primary text-center mb-4">
        Meet President Kennedy
      </h2>
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
          Experience an AI-powered simulation of President Kennedy discussing his vision for the arts and culture in America.
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          Powered by Google's Gemini Pro AI model and ElevenLabs voice synthesis
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-48 h-48 object-cover rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-center mb-2">{character.name}</h3>
          <p className="text-gray-600 text-center">{character.description}</p>
        </div>
        <KennedyChat />
      </div>
    </div>
  );
};