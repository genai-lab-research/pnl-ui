import { forwardRef } from 'react';
import { TextInputProps } from './types';
import {
  InputContainer,
  DefaultContainer,
  InactiveContainer,
  StyledInput
} from './TextInput.styles';

/**
 * TextInput component 
 * A text-input field used in the Vertical Farming Control Panel.
 * Provides a default "inactive" state with placeholder text.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((
  {
    placeholder = 'Notes (optional)',
    value,
    onChange,
    disabled = false,
    className = '',
    id,
    name,
    maxLength,
    ...props
  },
  ref
) => {
  return (
    <InputContainer className={className}>
      <DefaultContainer>
        <InactiveContainer>
          <StyledInput
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            id={id}
            name={name}
            maxLength={maxLength}
            {...props}
          />
        </InactiveContainer>
      </DefaultContainer>
    </InputContainer>
  );
});

TextInput.displayName = 'TextInput';
