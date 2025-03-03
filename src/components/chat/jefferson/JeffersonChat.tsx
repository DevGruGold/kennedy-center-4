
import { useState, useEffect } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";
import { supabase } from "@/integrations/supabase/client";

export const JeffersonChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "Greetings. I am Thomas Jefferson, author of the Declaration of Independence and third President of these United States. I have long believed that the arts and sciences are essential to liberty, for an enlightened citizenry is the bulwark of a democratic republic. I am fascinated by your Kennedy Center as an embodiment of our nation's commitment to cultural advancement. What would you like to discuss about the relationship between the arts, liberty, and democratic ideals?"
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
          prompt: `You are Thomas Jefferson, the author of the Declaration of Independence and third President of the United States. A user has sent this message: ${message}. 
                  Respond in your characteristic speaking style, drawing from your deep commitment to liberty, democracy, education, and cultural advancement. 
                  Focus on themes of freedom, enlightenment, and the importance of arts and culture in a thriving republic. Keep the response natural and engaging, 
                  while maintaining your historical perspective as a founding father with a love for knowledge and progress.`,
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
      console.error("Error in Jefferson chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md">
      <ChatHeader title="Thomas Jefferson" subtitle="3rd U.S. President & Declaration Author" />
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
