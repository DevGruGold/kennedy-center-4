import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
}

export const ChatInput = ({
  inputMessage,
  setInputMessage,
  sendMessage,
  isRecording,
  toggleRecording,
}: ChatInputProps) => (
  <div className="p-4 border-t">
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleRecording}
        className={isRecording ? 'text-red-500' : ''}
      >
        {isRecording ? <MicOff /> : <Mic />}
      </Button>
      <Input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <Button onClick={sendMessage}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </div>
);