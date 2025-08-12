export interface UserAvatarProps {
  /** User's display name for accessibility */
  name: string;
  /** Avatar image source URL */
  src?: string;
  /** Alternative text for the avatar image */
  alt?: string;
  /** Size variant for the avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Visual variant style */
  variant?: 'circle' | 'rounded' | 'square';
  /** Badge indicator (for online status, notifications, etc.) */
  badge?: boolean;
  /** Badge content (number, dot, icon) */
  badgeContent?: React.ReactNode;
  /** Badge position */
  badgePosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  /** Fallback initials when no image provided */
  initials?: string;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Background color for initials fallback */
  backgroundColor?: string;
  /** Text color for initials */
  textColor?: string;
}