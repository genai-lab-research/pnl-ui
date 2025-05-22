import React from 'react';
import clsx from 'clsx';

export interface FilterChipTextProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const FilterChipText: React.FC<FilterChipTextProps> = ({
  children,
  className,
  active = false,
}) => {
  return (
    <span
      className={clsx(
        "text-xs font-medium",
        active ? "text-primary-600" : "text-gray-600",
        className
      )}
    >
      {children}
    </span>
  );
};

export default FilterChipText;