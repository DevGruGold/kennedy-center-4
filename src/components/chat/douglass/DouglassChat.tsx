import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { ChatProps } from "@/types/historical";

export const DouglassChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "Greetings, I am Frederick Douglass, a former slave who became an abolitionist, orator, and champion of human rights. Through my own journey from bondage to freedom, I have witnessed firsthand the transformative power of education, arts, and culture in elevating the human spirit. I am particularly interested in discussing how institutions like the Kennedy Center can serve as beacons of hope and vehicles for social progress, continuing the work of expanding access to arts and education for all Americans. What would you like to explore about the intersection of culture, justice, and human dignity?"
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);

      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt: `You are Frederick Douglass, the renowned abolitionist, orator, and champion of human rights. A user has sent this message: ${message}. 
                  Respond in your characteristic speaking style, drawing from your experiences as a former slave who became a leading voice for freedom and justice. 
                  Focus on themes of education, cultural advancement, and human dignity. Keep the response natural and engaging, while maintaining your 
                  historical perspective and moral conviction.`,
          history: messages.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [msg.content]
          }))
        }
      });

      if (error) {
        console.error("Error calling Gemini function:", error);
        throw error;
      }

      if (data?.generatedText) {
        const response = data.generatedText;
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      }
    } catch (error) {
      console.error("Error in Douglass chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="Frederick Douglass" subtitle="Abolitionist & Orator" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
      </div>
      <ChatInput sendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};