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
      content: "Good evening, I am President Abraham Lincoln. I'm here to discuss the preservation of our Union, the principles of democracy, and our nation's future. What would you like to know about our great struggle to ensure that government of the people, by the people, for the people, shall not perish from the earth?"
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
          prompt: `You are Abraham Lincoln. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on themes of unity, 
                  democracy, and the preservation of the Union. Draw from your experiences 
                  during the Civil War, your vision for reconciliation, and your hopes for 
                  America's future. Keep your responses thoughtful and measured, reflecting 
                  your reputation for wisdom and careful deliberation.`
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
          description: "Speak your message to President Lincoln",
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