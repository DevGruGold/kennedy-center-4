import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Loader2 } from "lucide-react";
import { useState } from "react";

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

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
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