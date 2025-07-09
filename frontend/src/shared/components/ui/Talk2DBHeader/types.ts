export interface Talk2DBHeaderProps {
  /**
   * The title text to display in the header
   * @default 'Talk2DB'
   */
  title?: string;
  
  /**
   * Callback function when expand icon is clicked
   */
  onExpand?: () => void;
  
  /**
   * Callback function when close icon is clicked
   */
  onClose?: () => void;
  
  /**
   * Whether to show the bot icon
   * @default true
   */
  showBotIcon?: boolean;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
  
  /**
   * Whether the chat is in expanded state
   * @default false
   */
  expanded?: boolean;
}