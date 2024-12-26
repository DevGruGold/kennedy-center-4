import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "./chat/ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const KennedyChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.log("User not authenticated");
      return;
    }

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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use the chat feature",
        variant: "destructive",
      });
      return;
    }

    const newMessage = {
      role: 'user' as const,
      content: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage("");

    try {
      // Store user message in Supabase
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          content: inputMessage,
          role: 'user',
          user_id: session.session.user.id
        });

      if (insertError) throw insertError;

      // Call Gemini edge function
      const { data, error } = await supabase.functions.invoke('generate-with-gemini', {
        body: { 
          prompt: `You are President John F. Kennedy. A user has sent this message: ${inputMessage}. 
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
        
        // Store assistant message in Supabase
        await supabase
          .from('chat_messages')
          .insert({
            content: data.generatedText,
            role: 'assistant',
            user_id: session.session.user.id
          });
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation will be added in the next iteration
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
        sendMessage={sendMessage}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
      />
    </div>
  );
};