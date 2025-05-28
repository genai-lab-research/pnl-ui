import React, { useState } from 'react';

import clsx from 'clsx';

export interface SwitchSmallProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
}

export const SwitchSmall: React.FC<SwitchSmallProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = '',
  label,
  labelPosition = 'right',
}) => {
  // For uncontrolled component
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Determine if controlled or uncontrolled
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handleChange = () => {
    if (disabled) return;

    if (!isControlled) {
      setInternalChecked(!internalChecked);
    }

    if (onChange) {
      onChange(!isChecked);
    }
  };

  // Switch track/slide classes
  const slideClasses = clsx(
    'relative w-[34px] h-[14px] rounded-full transition-colors',
    isChecked ? 'bg-primary-500 opacity-50' : 'bg-black opacity-38',
    disabled && 'opacity-30 cursor-not-allowed',
  );

  // Switch knob/thumb classes
  const knobClasses = clsx(
    'absolute top-1/2 transform -translate-y-1/2 w-[20px] h-[20px]',
    'rounded-full bg-[#FAFAFA] transition-transform shadow-md',
    isChecked ? 'left-full -translate-x-full' : 'left-0',
    disabled && 'opacity-80',
  );

  // For accessibility, we want to use a hidden checkbox
  return (
    <label
      className={clsx(
        'flex cursor-pointer items-center',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      {label && labelPosition === 'left' && (
        <span className={clsx('mr-2 text-sm', disabled && 'opacity-50')}>{label}</span>
      )}

      <div className="relative inline-block">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
        />

        <div className={slideClasses}>
          <div className={knobClasses}></div>
        </div>
      </div>

      {label && labelPosition === 'right' && (
        <span className={clsx('ml-2 text-sm', disabled && 'opacity-50')}>{label}</span>
      )}
    </label>
  );
};

export default SwitchSmall;
