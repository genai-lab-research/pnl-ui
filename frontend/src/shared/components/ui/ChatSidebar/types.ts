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
  data?: {
    sql_code?: string;
    chart_code?: string;
    results?: any[];
    base_64_image?: string;
  };
}