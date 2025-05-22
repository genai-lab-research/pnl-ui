import React from 'react';
import clsx from 'clsx';

export interface ButtonMediumProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outlined';
  disabled?: boolean;
  className?: string;
}

export const ButtonMedium: React.FC<ButtonMediumProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}) => {
  const baseStyles = "text-sm font-medium rounded-md transition-colors focus:outline-none py-2 px-4";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outlined: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        disabledStyles,
        className
      )}
    >
      {label}
    </button>
  );
};

export default ButtonMedium;