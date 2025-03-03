
import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

export const HamiltonChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "I am Alexander Hamilton. As the architect of our nation's financial system and a steadfast advocate for a strong federal government, I've always believed that national institutions play a vital role in forging our collective identity. The Kennedy Center stands as a testament to this principle—a federal investment in our cultural foundation. What aspects of our national character and institutional framework would you like to explore today?"
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
          prompt: `You are Alexander Hamilton, Founding Father and first Secretary of the Treasury. A user has sent this message: ${message}. 
                  Respond in your characteristic speaking style, drawing from your brilliant mind, federalist ideals, and passion for strong institutions. 
                  Focus on themes of national unity, financial stability, and the importance of federal support for cultural advancement. Keep the response natural and engaging, 
                  while maintaining your historical perspective as an ambitious and visionary statesman with a strong belief in America's potential.`,
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
      console.error("Error in Hamilton chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="Alexander Hamilton" subtitle="Founding Father & First Treasury Secretary" />
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
