export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'bot';
  isTyping?: boolean;
}

export interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  onMinimize?: () => void;
  title?: string;
  className?: string;
}