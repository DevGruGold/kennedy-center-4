import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { startVoiceRecognition } from "@/utils/voiceUtils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const KennedyChat = () => {
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
    loadChatHistory();
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

  const playWithElevenLabs = async (text: string) => {
    try {
      const { data: secrets } = await supabase
        .from('secrets')
        .select('key_value')
        .eq('key_name', 'ELEVEN_LABS_API_KEY')
        .maybeSingle();
      
      if (!secrets?.key_value) {
        throw new Error("ElevenLabs API key not found");
      }

      const VOICE_ID = "iP95p4xoKVk53GoZ742B"; // Chris's voice for JFK
      
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": secrets.key_value,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.3,
              similarity_boost: 0.85,
              style: 1.0,
              use_speaker_boost: true
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.play();
      });
    } catch (error) {
      console.error("ElevenLabs error:", error);
      throw error;
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
          prompt: `You are President John F. Kennedy. A user has sent this message: ${text}. 
                  Respond in your characteristic speaking style, focusing on your vision for the arts, 
                  culture, and the Kennedy Center. Keep the response natural and engaging.`
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

        // Play the response using ElevenLabs
        await playWithElevenLabs(data.generatedText);
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
          description: "Speak your message to President Kennedy",
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
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
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