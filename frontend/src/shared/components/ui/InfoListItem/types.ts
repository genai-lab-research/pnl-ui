import React from 'react';

export interface InfoListItemProps {
  /** Item label/description text */
  label: string;
  /** Status information */
  status?: {
    label: string;
    variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning' | 'info' | 'default';
  };
  /** Icon name or ReactNode for the leading icon */
  iconName?: string;
  /** Custom icon component/element */
  iconSlot?: React.ReactNode;
  /** Path to SVG icon file (absolute path) */
  iconPath?: string;
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
  /** Click handler for the entire item */
  onClick?: () => void;
  /** Test ID for testing purposes */
  testId?: string;
}

export interface StatusPillProps {
  label: string;
  variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}