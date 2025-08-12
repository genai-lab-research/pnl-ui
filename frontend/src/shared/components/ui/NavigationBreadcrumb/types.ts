export interface NavigationBreadcrumbProps {
  /** Main navigation text */
  label: string;
  /** Direction of the arrow indicator */
  arrowDirection?: 'left' | 'right' | 'up' | 'down';
  /** Visual variant */
  variant?: 'default' | 'compact' | 'minimal';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Background color variant */
  backgroundVariant?: 'dark' | 'light' | 'transparent';
  /** Arrow icon slot for custom icons */
  arrowIcon?: React.ReactNode;
  /** Click handler for navigation */
  onClick?: () => void;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
}