export interface NotificationRowProps {
  /**
   * The message to display in the notification
   */
  message: string;
  
  /**
   * The timestamp of the notification
   */
  timestamp: string;
  
  /**
   * The name of the author/operator who triggered the action
   */
  authorName: string;
  
  /**
   * The URL for the avatar image (optional)
   * If not provided, will use the person icon with background color
   */
  avatarUrl?: string;
}