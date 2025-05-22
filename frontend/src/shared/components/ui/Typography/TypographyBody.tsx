import React from 'react';
import clsx from 'clsx';

export interface TypographyBodyProps {
  children: React.ReactNode;
  className?: string;
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  gutterBottom?: boolean;
}

export const TypographyBody: React.FC<TypographyBodyProps> = ({
  children,
  className,
  color = 'default',
  align = 'left',
  gutterBottom = false,
}) => {
  const baseClasses = "font-normal text-sm"; // 14px font size
  
  const colorClasses = {
    default: "text-gray-900",
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    muted: "text-gray-500",
    error: "text-red-600",
    success: "text-green-600",
  };
  
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  return (
    <p
      className={clsx(
        baseClasses,
        colorClasses[color],
        alignClasses[align],
        gutterBottom && 'mb-4',
        className
      )}
    >
      {children}
    </p>
  );
};

export default TypographyBody;