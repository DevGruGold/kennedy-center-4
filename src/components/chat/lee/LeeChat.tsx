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

export const LeeChat = ({ voiceId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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
      content: "Good day, I am General Robert E. Lee. As someone who witnessed the devastating effects of national division and later worked to promote reconciliation through education, I deeply appreciate the role of cultural institutions like the Kennedy Center in fostering understanding and unity. What would you like to discuss about leadership, healing, and the transformative power of the arts?"
    };
    setMessages([initialMessage]);
  }, []);

  const processMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);

    const newMessage = {
      role: 'user' as const,
      content: text
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");

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
          prompt: `You are General Robert E. Lee, speaking in 1870. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on themes of reconciliation, education,
                  and the healing power of cultural institutions like the Kennedy Center. Draw from your post-war
                  experience as an educator to discuss how the arts can bridge divides and foster understanding.
                  Keep your responses dignified and thoughtful, emphasizing the importance of cultural unity in
                  rebuilding relationships between all Americans.`
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
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current = startVoiceRecognition(
          (text) => {
            setInputMessage(text);
            processMessage(text);
          },
          () => setIsRecording(false)
        );
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "Speak your message to General Lee",
        });
      } catch (error) {
        console.error("Voice recognition error:", error);
        toast({
          title: "Error",
          description: "Failed to start voice recording. Please check your microphone permissions.",
          variant: "destructive",
        });
        setIsRecording(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <ChatHeader title="Chat with General Lee" />
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
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={() => processMessage(inputMessage)}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        isProcessing={isProcessing}
      />
    </div>
  );
};
