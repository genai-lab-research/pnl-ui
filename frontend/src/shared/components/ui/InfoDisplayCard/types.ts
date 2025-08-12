import React from 'react';

export interface InfoDisplayCardField {
  /** Field label/key */
  label: string;
  /** Field value content */
  value: string | React.ReactNode;
  /** Field icon component (for specific fields like Type) */
  icon?: React.ReactNode;
}

export interface InfoDisplayCardProps {
  /** Card title/header */
  title: string;
  /** Array of field data to display */
  fields: InfoDisplayCardField[];
  /** Status information */
  status?: {
    label: string;
    variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  };
  /** Additional description or notes section */
  description?: string;
  /** Description section title */
  descriptionTitle?: string;
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

export interface StatusPillProps {
  label: string;
  variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}