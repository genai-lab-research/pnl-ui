import React from 'react';

/**
 * Arrow icon component properties
 */
interface ArrowIconProps {
  /** Whether the icon should appear disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Left-pointing arrow icon for Previous navigation
 * Used in pagination controls to indicate backward navigation
 */
export const ArrowLeftIcon: React.FC<ArrowIconProps> = ({ disabled, className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12.5 15L7.5 10L12.5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={disabled ? 0.26 : 1}
    />
  </svg>
);

/**
 * Right-pointing arrow icon for Next navigation
 * Used in pagination controls to indicate forward navigation
 */
export const ArrowRightIcon: React.FC<ArrowIconProps> = ({ disabled, className }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M7.5 5L12.5 10L7.5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={disabled ? 0.26 : 1}
    />
  </svg>
);