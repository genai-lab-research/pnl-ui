import React from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  /**
   * The variant of the TextField.
   * @default 'outlined'
   */
  variant?: 'outlined' | 'standard' | 'filled';

  /**
   * Whether the TextField is multiline.
   * @default false
   */
  multiline?: boolean;

  /**
   * Number of rows when multiline is true.
   * @default 4
   */
  rows?: number;

  /**
   * Custom CSS class for the component.
   */
  className?: string;
}

const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  width: '100%',
  
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    fontFamily: 'Inter, Roboto, sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(76, 78, 100, 0.87)',
    
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: '1px',
    },
    
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(76, 78, 100, 0.22)',
    },
    
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.15)',
      },
    },
    
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(76, 78, 100, 0.22)',
      transition: 'border-color 0.15s ease-in-out',
    },
  },
  
  '& .MuiOutlinedInput-input': {
    padding: '7px 12px',
    '&::placeholder': {
      color: 'rgba(76, 78, 100, 0.6)',
      opacity: 1,
    },
  },
  
  '& .MuiInputLabel-outlined': {
    color: 'rgba(76, 78, 100, 0.6)',
    fontSize: '12px',
    lineHeight: '12px',
    letterSpacing: '0.15px',
    transform: 'translate(12px, 13px) scale(1)',
    
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
    },
  },
  
  '& .MuiFormHelperText-root': {
    marginLeft: '0',
    fontSize: '12px',
    lineHeight: '16px',
  }
}));

/**
 * TextField component for inputting text with various states.
 * 
 * This component provides a text input field with Material UI styling,
 * matching the design specifications from Figma. It supports outlined,
 * filled, and standard variants, along with multiline functionality.
 * 
 * @component
 * @example
 * ```tsx
 * <TextField 
 *   label="Location"
 *   placeholder="Enter location"
 *   value={location}
 *   onChange={handleLocationChange}
 * />
 * ```
 */
export const TextField: React.FC<TextFieldProps> = ({
  variant = 'outlined',
  multiline = false,
  rows = 4,
  className,
  placeholder,
  ...rest
}) => {
  return (
    <StyledTextField
      variant={variant}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      className={clsx(className)}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default TextField;