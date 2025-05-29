import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface PrimaryButtonProps extends Omit<MuiButtonProps, 'color'> {
  /**
   * Button content
   */
  children: React.ReactNode;
  
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * If `true`, the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * If `true`, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

const StyledButton = styled(MuiButton)(() => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  padding: '10px 12px',
  borderRadius: '6px',
  backgroundColor: '#3545EE', // The exact color from the Figma file
  color: '#FAFAFA', // The exact color from the Figma file
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#2B39C7', // Darker shade for hover
    boxShadow: 'none',
  },
  '&:focus': {
    boxShadow: '0 0 0 3px rgba(53, 69, 238, 0.3)', // Focus outline
  },
  '&:active': {
    backgroundColor: '#232FA3', // Even darker for active state
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    color: 'rgba(0, 0, 0, 0.26)',
  },
  // Size specific styles
  '&.MuiButton-sizeSmall': {
    padding: '6px 10px',
    fontSize: '12px',
    lineHeight: '16px',
  },
  '&.MuiButton-sizeLarge': {
    padding: '12px 16px',
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

/**
 * Primary Button component for main actions, featuring a solid blue background and white text.
 * It follows Material Design guidelines and is designed for the primary call-to-action.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <PrimaryButton>Create Container</PrimaryButton>
 * 
 * // Disabled state
 * <PrimaryButton disabled>Create Container</PrimaryButton>
 * 
 * // With click handler
 * <PrimaryButton onClick={() => handleCreate()}>
 *   Create Container
 * </PrimaryButton>
 * ```
 */
export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  size = 'medium',
  disabled = false,
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant="contained"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default PrimaryButton;