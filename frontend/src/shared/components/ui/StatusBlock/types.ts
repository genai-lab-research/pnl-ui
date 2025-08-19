import { ReactNode } from 'react';

export interface StatusBlockProps {
  /** Primary description or title text */
  title: string;
  
  /** Icon element or icon name */
  icon?: ReactNode | string;
  
  /** Status badge text */
  status?: string;
  
  /** Status badge variant that affects styling */
  statusVariant?: 'active' | 'inactive' | 'pending' | 'success' | 'warning' | 'error';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Loading state */
  loading?: boolean;
  
  /** Error state with message */
  error?: string;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Click handler for the entire block */
  onClick?: () => void;
  
  /** Whether the component is disabled */
  disabled?: boolean;
  
  /** Custom footer content */
  footerSlot?: ReactNode;
}

export interface StatusBadgeProps {
  text: string;
  variant: StatusBlockProps['statusVariant'];
  size: StatusBlockProps['size'];
}
