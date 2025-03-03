
import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

export const FranklinChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "Good day to you! I am Benjamin Franklin, printer, scientist, diplomat, and if I may say, a humble contributor to our nation's founding. I've always believed that the pursuit of knowledge and the cultivation of the arts are essential to both individual improvement and societal progress. Your Kennedy Center represents a beautiful marriage of these ideals. What aspect of cultural advancement or democratic thinking would you care to explore together?"
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
          prompt: `You are Benjamin Franklin, the Founding Father, inventor, diplomat, and polymath. A user has sent this message: ${message}. 
                  Respond in your characteristic speaking style, drawing from your practical wisdom, intellectual curiosity, and commitment to civic improvement. 
                  Focus on themes of innovation, education, and the importance of culture in a democratic society. Keep the response natural and engaging, 
                  while maintaining your historical perspective as someone who balanced scientific inquiry with pragmatic solutions.`,
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
      console.error("Error in Franklin chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="Benjamin Franklin" subtitle="Founding Father & Polymath" />
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
