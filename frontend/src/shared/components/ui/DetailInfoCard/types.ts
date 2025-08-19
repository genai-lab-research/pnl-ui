import { ReactNode } from 'react';

export interface DataRow {
  /** Label for the data field */
  label: string;
  /** Value for the data field - can be text, number, or React element */
  value: string | number | ReactNode;
  /** Optional icon to display with the value */
  icon?: ReactNode;
}

export interface StatusBadge {
  /** Text to display in the badge */
  text: string;
  /** Status variant for styling */
  variant: 'active' | 'inactive' | 'warning' | 'error' | 'success';
}

export interface InfoSection {
  /** Section title */
  title: string;
  /** Section content - can be text or React element */
  content: string | ReactNode;
}

export interface DetailInfoCardProps {
  /** Main card title */
  title: string;
  
  /** Array of data rows to display in the main content */
  dataRows: DataRow[];
  
  /** Optional status badge configuration */
  statusBadge?: StatusBadge;
  
  /** Optional additional sections (like notes, description, etc.) */
  sections?: InfoSection[];
  
  /** Visual variant */
  variant?: 'default' | 'compact' | 'outlined' | 'elevated';
  
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  
  /** Loading state with sensible skeletons */
  loading?: boolean;
  
  /** Error state */
  error?: string;
  
  /** Custom footer actions/content */
  footerSlot?: ReactNode;
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Custom className for additional styling */
  className?: string;
  
  /** Click handler for the entire card */
  onClick?: () => void;
  
  /** Whether the component is disabled */
  disabled?: boolean;
}

export interface StyledContainerProps {
  variant: DetailInfoCardProps['variant'];
  size: DetailInfoCardProps['size'];
  disabled: boolean;
  clickable: boolean;
}

export interface StyledTextProps {
  size: DetailInfoCardProps['size'];
}

export interface StatusBadgeStyledProps {
  variant: StatusBadge['variant'];
  size: DetailInfoCardProps['size'];
}
