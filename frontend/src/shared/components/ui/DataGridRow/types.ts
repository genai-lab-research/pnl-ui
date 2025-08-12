import React from 'react';

export interface DataGridCellConfig {
  /** Cell content - can be string, number, or React element */
  content: string | number | React.ReactNode;
  /** Cell width in pixels */
  width?: number;
  /** Cell alignment */
  align?: 'left' | 'center' | 'right';
  /** Font weight override */
  fontWeight?: 400 | 500 | 600;
  /** Click handler for the cell */
  onClick?: () => void;
}

export interface DataGridRowProps {
  /** Array of cells to display in the row */
  cells: DataGridCellConfig[];
  /** Leading icon configuration */
  icon?: {
    /** Icon name (for predefined icons) */
    name?: string;
    /** Custom icon component */
    slot?: React.ReactNode;
    /** Path to SVG icon file */
    path?: string;
    /** Icon size */
    size?: number;
  };
  /** Status configuration for status pill */
  status?: {
    label: string;
    variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning' | 'info' | 'default';
  };
  /** Alert/warning icon configuration */
  alert?: {
    /** Alert icon component */
    icon?: React.ReactNode;
    /** Alert icon path */
    path?: string;
    /** Alert message for accessibility */
    message?: string;
  };
  /** Overflow menu configuration */
  menu?: {
    /** Menu icon component */
    icon?: React.ReactNode;
    /** Menu icon path */
    path?: string;
    /** Menu items or click handler */
    onClick?: () => void;
    /** Menu items array */
    items?: Array<{
      label: string;
      onClick: () => void;
    }>;
  };
  /** Visual variant */
  variant?: 'default' | 'compact' | 'elevated' | 'outlined';
  /** Size scale */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Whether the row is clickable */
  clickable?: boolean;
  /** Click handler for the entire row */
  onClick?: () => void;
  /** Whether the row is selected */
  selected?: boolean;
  /** Whether the row is disabled */
  disabled?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for testing purposes */
  testId?: string;
}

export interface StatusPillProps {
  label: string;
  variant: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export interface IconButtonProps {
  icon?: React.ReactNode;
  iconPath?: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}