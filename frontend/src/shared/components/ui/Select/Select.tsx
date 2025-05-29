import React from 'react';
import { 
  Select as MuiSelect, 
  SelectProps as MuiSelectProps, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

export interface SelectOption {
  /**
   * The value to be used when the option is selected
   */
  value: string | number;
  
  /**
   * The display text for the option
   */
  label: string;
}

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  /**
   * The options to display in the select dropdown
   */
  options: SelectOption[];
  
  /**
   * The label for the select field
   */
  label?: string;
  
  /**
   * The helper text to display below the select field
   */
  helperText?: string;
  
  /**
   * The variant of the select field
   * @default 'outlined'
   */
  variant?: 'outlined' | 'standard' | 'filled';
  
  /**
   * The size of the select field
   * @default 'medium'
   */
  size?: 'small' | 'medium';
  
  /**
   * Whether the select field is in an error state
   * @default false
   */
  error?: boolean;
  
  /**
   * Custom CSS class for the component
   */
  className?: string;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  
  // Outlined input styling
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    fontFamily: 'Inter, Roboto, sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(0, 0, 0, 0.87)',
    
    // Focus state
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
    
    // Hover state
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.38)',
    },
    
    // Disabled state
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.15)',
      },
    },
    
    // Error state
    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.error.main,
    },
    
    // Default border
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.22)',
      transition: 'border-color 0.15s ease-in-out',
    },
  },
  
  // Select padding
  '& .MuiSelect-select': {
    padding: '12px',
    '&.MuiInputBase-inputSizeSmall': {
      padding: '8px 12px',
    },
  },
  
  // Dropdown icon styling
  '& .MuiSelect-icon': {
    color: 'rgba(0, 0, 0, 0.54)',
    right: '8px',
  },
  
  // Label styling
  '& .MuiInputLabel-outlined': {
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '12px',
    fontFamily: 'Inter, Roboto, sans-serif',
    lineHeight: '20px',
    transform: 'translate(12px, 13px) scale(1)',
    
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
    
    '&.MuiInputLabel-sizeSmall': {
      transform: 'translate(12px, 9px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
  },
  
  // Helper text styling
  '& .MuiFormHelperText-root': {
    marginLeft: '0',
    fontSize: '12px',
    lineHeight: '16px',
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  
  // Menu items styling
  '& .MuiMenuItem-root': {
    fontSize: '16px',
    fontFamily: 'Inter, Roboto, sans-serif',
    minHeight: '40px',
  }
}));

/**
 * Select component for choosing an option from a dropdown list.
 * 
 * This component provides a select input field with Material UI styling,
 * matching the design specifications from Figma. It supports outlined,
 * filled, and standard variants, with customizable options.
 * 
 * @component
 * @example
 * ```tsx
 * <Select 
 *   label="Container Name"
 *   options={[
 *     { value: 'farm-container-01', label: 'farm-container-01' },
 *     { value: 'farm-container-02', label: 'farm-container-02' },
 *     { value: 'farm-container-03', label: 'farm-container-03' },
 *     { value: 'farm-container-04', label: 'farm-container-04' },
 *   ]}
 *   value="farm-container-04"
 *   onChange={handleChange}
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  variant = 'outlined',
  size = 'medium',
  error = false,
  className,
  ...rest
}) => {
  // Generate a unique ID for the select and label
  const id = React.useId();
  const labelId = `${id}-label`;
  const helperTextId = helperText ? `${id}-helper-text` : undefined;
  
  return (
    <StyledFormControl 
      variant={variant} 
      size={size} 
      error={error}
      className={clsx(className)}
    >
      {label && (
        <InputLabel id={labelId}>{label}</InputLabel>
      )}
      <MuiSelect
        labelId={labelId}
        label={label}
        aria-describedby={helperTextId}
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && (
        <FormHelperText id={helperTextId}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  );
};

export default Select;