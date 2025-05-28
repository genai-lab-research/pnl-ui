import React from 'react';

import clsx from 'clsx';

export interface LabelSmallProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success';
  htmlFor?: string;
  required?: boolean;
}

export const LabelSmall: React.FC<LabelSmallProps> = ({
  children,
  className,
  color = 'default',
  htmlFor,
  required = false,
}) => {
  const baseClasses = 'block text-xs font-medium mb-1'; // 12px font size

  const colorClasses = {
    default: 'text-gray-700',
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    muted: 'text-gray-500',
    error: 'text-red-600',
    success: 'text-green-600',
  };

  return (
    <label htmlFor={htmlFor} className={clsx(baseClasses, colorClasses[color], className)}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
};

export default LabelSmall;
