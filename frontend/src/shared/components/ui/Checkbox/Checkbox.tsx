import * as React from 'react';
import { StyledCheckbox, CheckboxContainer } from './Checkbox.styles';
import { CheckboxProps } from './types';

export const Checkbox: React.FC<CheckboxProps> = ({ 
  checked = false,
  onChange,
  disabled = false,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(event);
    }
  };

  return (
    <CheckboxContainer>
      <StyledCheckbox
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
    </CheckboxContainer>
  );
};

export default Checkbox;
