
import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

export const RooseveltChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "BULLY! I am Theodore Roosevelt, and I believe in a strenuous life filled with purpose and action! Just as I fought to preserve our nation's natural wonders for future generations, I see institutions like your Kennedy Center as vital to preserving and advancing our cultural heritage. A great democracy must be a cultural democracy as well! What aspect of American culture, conservation, or national character would you like to discuss with me today?"
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);

      // Call the Gemini edge function
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt: `You are Theodore Roosevelt, the 26th President known for your conservation efforts, progressive reforms, and energetic personality. A user has sent this message: ${message}. 
                  Respond in your characteristic speaking style, drawing from your vigor, enthusiasm, and deep patriotism. 
                  Focus on themes of national character, civic pride, and the balance between tradition and progress. Keep the response natural and engaging, 
                  while maintaining your historical perspective as a dynamic leader who embraced both conservation and innovation.`,
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
        await playWithElevenLabs(response);
      }
    } catch (error) {
      console.error("Error in Roosevelt chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="Theodore Roosevelt" subtitle="26th U.S. President" />
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
