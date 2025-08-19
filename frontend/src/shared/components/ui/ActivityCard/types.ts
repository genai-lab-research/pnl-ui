import { ReactNode } from 'react';

export interface ActivityCardProps {
  /** Main activity or event message (e.g., "Environment mode switched to Auto", "New user registered") */
  title: string;
  
  /** When the activity occurred (e.g., "April 10, 2025 - 10:00PM", "2 hours ago") */
  timestamp?: string;
  
  /** Person or system that performed the activity */
  author?: string;
  
  /** Optional subtitle or additional context */
  subtitle?: string;
  
  /** Custom icon for the avatar section */
  avatarIcon?: ReactNode;
  
  /** Background color for the avatar (defaults to theme success color) */
  avatarColor?: string;
  
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state with sensible skeletons */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Whether the component is disabled */
  disabled?: boolean;
  
  /** Show timestamp icon */
  showTimestampIcon?: boolean;
  
  /** Custom footer content */
  footerSlot?: ReactNode;
}

export interface ActivityAvatarProps {
  icon?: ReactNode;
  backgroundColor?: string;
  size: ActivityCardProps['size'];
}

export interface ActivityContentProps {
  title: string;
  timestamp?: string;
  author?: string;
  subtitle?: string;
  size: ActivityCardProps['size'];
  showTimestampIcon?: boolean;
}

export interface ActivityMetaRowProps {
  timestamp?: string;
  author?: string;
  size: ActivityCardProps['size'];
  showTimestampIcon?: boolean;
}
