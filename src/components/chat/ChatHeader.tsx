interface ChatHeaderProps {
  title?: string;
}

export const ChatHeader = ({ title = "Chat with President Kennedy" }: ChatHeaderProps) => (
  <div className="p-4 border-b">
    <h2 className="text-xl font-semibold text-primary">{title}</h2>
  </div>
);