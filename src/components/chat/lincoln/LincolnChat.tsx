import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../ChatMessage";
import { ChatInput } from "../ChatInput";
import { ChatHeader } from "../ChatHeader";
import { startVoiceRecognition } from "@/utils/voiceUtils";
import { ChatProps } from "@/types/historical";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const LincolnChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting message
    const initialMessage = {
      role: 'assistant' as const,
      content: "Good evening, I am President Abraham Lincoln. The Kennedy Center stands as a beacon of our democratic ideals - a place where all people can come together to experience the transformative power of the arts. Just as we preserved the Union, such cultural institutions help preserve our shared heritage and values. What would you like to discuss about democracy, unity, and the role of the arts in strengthening our nation?"
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);

    const newMessage = {
      role: 'user' as const,
      content: text
    };

    setMessages(prev => [...prev, newMessage]);

    try {
      // Store user message
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          content: text,
          role: 'user'
        });

      if (insertError) throw insertError;

      // Call Gemini edge function
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt: `You are President Abraham Lincoln. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on how cultural institutions
                  like the Kennedy Center embody the democratic ideals you fought to preserve. Draw from
                  your experiences during the Civil War to emphasize the importance of cultural spaces in
                  maintaining our national fabric. Discuss how the arts can strengthen democracy and unite
                  our diverse nation, ensuring that government of the people, by the people, for the people
                  shall not perish from the earth.`
        }
      });

      if (error) throw error;

      if (data?.generatedText) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.generatedText
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Store assistant message
        await supabase
          .from('chat_messages')
          .insert({
            content: data.generatedText,
            role: 'assistant'
          });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <ChatHeader title="Chat with President Lincoln" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            {...message} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        sendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
