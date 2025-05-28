import React from 'react';

export interface CheckboxStandardProps {
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  className?: string;
}

export const CheckboxStandard: React.FC<CheckboxStandardProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  labelPlacement = 'end',
  className = '',
  ...props
}) => {
  // Layout classes based on label placement
  const containerClasses = {
    start: 'flex-row-reverse justify-end',
    end: 'flex-row justify-start',
    top: 'flex-col-reverse items-center',
    bottom: 'flex-col items-center',
  };

  // Label margin classes based on placement
  const labelMarginClasses = {
    start: 'mr-3',
    end: 'ml-3',
    top: 'mb-2',
    bottom: 'mt-2',
  };

  // Custom checkbox component using Tailwind
  const CheckboxInput = () => (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border 
          ${
            disabled
              ? 'border-gray-300 bg-gray-100'
              : checked
              ? 'border-primary bg-primary'
              : 'border-gray-400 bg-white'
          } 
          peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-opacity-50`}
      >
        {checked && (
          <svg
            className="h-3.5 w-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </span>
    </div>
  );

  // If there's no label, return just the checkbox
  if (!label) {
    return <CheckboxInput />;
  }

  // With label, create a flex container
  return (
    <label
      className={`flex items-center ${containerClasses[labelPlacement]} ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${className}`}
    >
      <CheckboxInput />
      <span
        className={`text-sm ${labelMarginClasses[labelPlacement]} ${
          disabled ? 'text-gray-400' : 'text-text-primary'
        }`}
      >
        {label}
      </span>
    </label>
  );
};

export default CheckboxStandard;
