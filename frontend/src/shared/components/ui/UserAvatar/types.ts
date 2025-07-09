export interface UserAvatarProps {
  /**
   * The source URL of the avatar image
   */
  src: string;
  
  /**
   * Alternative text for the avatar image
   */
  alt: string;
  
  /**
   * The size of the avatar in pixels
   * @default 32
   */
  size?: number;
  
  /**
   * Optional CSS class name
   */
  className?: string;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
}