import React from 'react';

export interface ActivityNotificationCardProps {
  /** Primary message or activity description */
  message: string;
  /** User name or author of the activity */
  author: string;
  /** Timestamp or date information */
  timestamp: string;
  /** Avatar icon name or ReactNode slot */
  avatarIcon?: string | React.ReactNode;
  /** Avatar background color variant */
  avatarVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Timestamp icon (optional) */
  timestampIcon?: React.ReactNode;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Custom footer content */
  footerSlot?: React.ReactNode;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Click handler for the entire card */
  onClick?: () => void;
}

export interface AvatarIconProps {
  icon?: string | React.ReactNode;
  variant: 'default' | 'success' | 'warning' | 'error' | 'info';
  size: 'sm' | 'md' | 'lg';
}