import { useState } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatInput } from "../ChatInput";
import { ChatMessage } from "../ChatMessage";
import { generateWithOpenAI } from "@/utils/textGeneration/openaiService";
import { playWithElevenLabs } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";

export const AdamsChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      setMessages((prev) => [...prev, { role: "user", content: message }]);

      const prompt = `You are John Adams, the second President of the United States. Respond in first person as Adams, maintaining his characteristic intellectual and principled speaking style. Focus on your thoughts about education, arts, and cultural development in America. Here is what you should respond to: ${message}`;

      const response = await generateWithOpenAI(prompt);
      
      if (response) {
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
        await playWithElevenLabs(response); // Removed the second argument
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