import React from 'react';
import clsx from 'clsx';

export interface TabLabelProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const TabLabel: React.FC<TabLabelProps> = ({
  children,
  className,
  active = false,
}) => {
  return (
    <span
      className={clsx(
        "text-sm font-medium transition-colors",
        active ? "text-primary-600" : "text-gray-500 hover:text-gray-700",
        className
      )}
    >
      {children}
    </span>
  );
};

export default TabLabel;