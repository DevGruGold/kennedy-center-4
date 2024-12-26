import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "../ChatMessage";
import { ChatInput } from "../ChatInput";
import { ChatHeader } from "../ChatHeader";
import { ChatProps } from "@/types/historical";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const GrantChat = ({ voiceId }: ChatProps) => {
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
    const initialMessage = {
      role: 'assistant' as const,
      content: "Good day, I am General Ulysses S. Grant. Having led our nation through war and reconstruction, I understand deeply the importance of cultural unity. The Kennedy Center stands as a testament to our shared artistic heritage - a reminder of the cultural bonds that helped reunite our nation. What would you like to discuss about leadership, unity, and the role of the arts in strengthening our national fabric?"
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
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          content: text,
          role: 'user'
        });

      if (insertError) throw insertError;

      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt: `You are Ulysses S. Grant, speaking in 1885 while writing your memoirs. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on your experiences as Union General and President,
                  while drawing parallels to how cultural institutions like the Kennedy Center represent the unity you fought to preserve.
                  Share insights about leadership, national reconciliation, and the importance of arts and culture in strengthening
                  our nation's bonds. Keep your responses direct and straightforward, reflecting your reputation for clear communication
                  and determination.`
        }
      });

      if (error) throw error;

      if (data?.generatedText) {
        const assistantMessage = {
          role: 'assistant' as const,
          content: data.generatedText
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
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
      <ChatHeader title="Chat with General Grant" />
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