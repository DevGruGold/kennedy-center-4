interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[80%] p-3 rounded-lg ${
        role === 'user'
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {content}
    </div>
  </div>
);