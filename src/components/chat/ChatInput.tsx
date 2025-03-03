
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface ChatInputProps {
  sendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({
  sendMessage,
  isLoading
}: ChatInputProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<typeof SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInputMessage(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast({
          title: "Speech recognition error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive",
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
      toast({
        title: "Listening",
        description: "Speak now...",
      });
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleRecording}
          className={isRecording ? 'text-red-500' : ''}
          disabled={isLoading}
        >
          {isRecording ? <MicOff /> : <Mic />}
        </Button>
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
