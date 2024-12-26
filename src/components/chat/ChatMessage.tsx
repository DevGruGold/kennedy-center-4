interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  highlightedWordIndex?: number;
}

export const ChatMessage = ({ role, content, highlightedWordIndex = -1 }: ChatMessageProps) => {
  const words = content.split(' ');
  
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          role === 'user'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {words.map((word, index) => (
          <span
            key={index}
            className={`${
              index === highlightedWordIndex ? 'bg-yellow-200' : ''
            } ${index > 0 ? 'ml-1' : ''}`}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};