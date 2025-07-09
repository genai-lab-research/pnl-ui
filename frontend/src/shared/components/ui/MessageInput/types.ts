export interface MessageInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  onAttachmentClick?: () => void;
  onVoiceClick?: () => void;
  disabled?: boolean;
  className?: string;
}