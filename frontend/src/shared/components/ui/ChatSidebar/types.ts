export interface ChatSidebarProps {
  open: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  isTyping?: boolean;
  originalQuery?: string;
  data?: {
    generated_code?: string;
    thoughts?: string;
    results?: any[];
    base_64_image?: string;
  };
}