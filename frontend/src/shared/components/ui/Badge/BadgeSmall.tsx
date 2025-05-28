import React from 'react';

import clsx from 'clsx';

export interface BadgeSmallProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export const BadgeSmall: React.FC<BadgeSmallProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full text-[12px] font-semibold py-[3px] px-[11px] leading-[16px]';

  const variantClasses = {
    default: 'text-[#09090B] border border-[#E5E7EB] bg-transparent',
    primary: 'text-primary-900 border border-primary-200 bg-primary-50',
    secondary: 'text-secondary-900 border border-secondary-200 bg-secondary-50',
    success: 'text-green-900 border border-green-200 bg-green-50',
    warning: 'text-yellow-900 border border-yellow-200 bg-yellow-50',
    error: 'text-red-900 border border-red-200 bg-red-50',
    info: 'text-blue-900 border border-blue-200 bg-blue-50',
  };

  return <span className={clsx(baseClasses, variantClasses[variant], className)}>{children}</span>;
};

export default BadgeSmall;
