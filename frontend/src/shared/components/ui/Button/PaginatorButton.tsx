import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from '@mui/material/Button';
import clsx from 'clsx';

export type PaginatorButtonVariant = 'contained' | 'outlined' | 'text';
export type PaginatorButtonColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';
export type PaginatorButtonIcon = 'previous' | 'next' | 'none';

export interface PaginatorButtonProps {
  /**
   * Button variant
   * @default outlined
   */
  variant?: PaginatorButtonVariant;

  /**
   * Button color
   * @default primary
   */
  color?: PaginatorButtonColor;

  /**
   * Button icon position
   * @default none
   */
  icon?: PaginatorButtonIcon;

  /**
   * CSS class name
   */
  className?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Button children (text content)
   */
  children?: React.ReactNode;

  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * PaginatorButton component for pagination navigation
 */
export const PaginatorButton: React.FC<PaginatorButtonProps> = ({
  variant = 'outlined',
  color = 'primary',
  icon = 'none',
  className,
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled}
      className={clsx('rounded-md px-3 py-[7px]', 'text-sm font-medium tracking-wider', className)}
      onClick={onClick}
      startIcon={icon === 'previous' ? <ArrowBackIcon /> : undefined}
      endIcon={icon === 'next' ? <ArrowForwardIcon /> : undefined}
      aria-label={
        icon === 'previous'
          ? 'Go to previous page'
          : icon === 'next'
          ? 'Go to next page'
          : undefined
      }
      sx={{
        textTransform: 'none',
        borderRadius: '6px',
      }}
    >
      {children}
    </Button>
  );
};

export default PaginatorButton;
