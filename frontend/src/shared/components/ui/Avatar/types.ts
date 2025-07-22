export interface AvatarProps {
  /**
   * The source URL of the avatar image
   */
  src: string;
  
  /**
   * Alternative text for the avatar image
   */
  alt: string;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
}