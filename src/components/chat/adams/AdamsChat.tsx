import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

export const AdamsChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "Greetings, I am John Adams, second President of these United States and a steadfast advocate for education, justice, and the arts. As one who helped forge this nation's foundation, I am particularly intrigued by institutions like the Kennedy Center that embody our commitment to cultural advancement. What would you like to discuss about the role of arts and education in preserving our republic's virtues?"
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
          prompt: message,
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
      console.error("Error in Adams chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="John Adams" subtitle="2nd U.S. President" />
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