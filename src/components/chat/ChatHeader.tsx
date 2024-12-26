interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

export const ChatHeader = ({ 
  title = "Chat with President Kennedy",
  subtitle
}: ChatHeaderProps) => (
  <div className="p-4 border-b">
    <h2 className="text-xl font-semibold text-primary">{title}</h2>
    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
  </div>
);