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

export const GrantChat = ({ voiceId }: ChatProps) => {
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
      content: "Good day, I am General Ulysses S. Grant. I'm here to share my experiences from the Civil War, my presidency, and my efforts to protect the rights of formerly enslaved people. What would you like to discuss about military strategy, leadership, or the challenges of Reconstruction?"
    };
    setMessages([initialMessage]);
  }, []);

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error loading chat history:", error);
      return;
    }

    if (data) {
      const formattedMessages = data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      setMessages(formattedMessages);
    }
  };

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
          prompt: `You are Ulysses S. Grant, speaking in 1885 while writing your memoirs. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on your experiences as Union General during the Civil War,
                  your presidency, and your efforts to protect the rights of formerly enslaved people. Keep your responses direct 
                  and straightforward, reflecting your reputation for clear communication and determination. Share insights about 
                  military strategy, leadership, and the challenges of Reconstruction. Maintain historical accuracy while engaging 
                  naturally with the user's questions.`
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
          description: "Speak your message to General Grant",
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