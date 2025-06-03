import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export type ButtonVariant = 
  | 'contained' 
  | 'outlined' 
  | 'text';

export type ButtonColor = 
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  /**
   * The variant of the button.
   * @default 'contained'
   */
  variant?: ButtonVariant;
  
  /**
   * The color of the button.
   * @default 'primary'
   */
  color?: ButtonColor;
  
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * The icon to display at the start of the button.
   */
  startIcon?: React.ReactNode;
  
  /**
   * The icon to display at the end of the button.
   */
  endIcon?: React.ReactNode;
  
  /**
   * If `true`, the plus circle icon will be displayed at the start of the button.
   * @default false
   */
  withPlusIcon?: boolean;
}

const StyledButton = styled(MuiButton)(() => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  letterSpacing: '0px',
  lineHeight: '20px',
  padding: '10px 16px',
  borderRadius: '6px',
  textAlign: 'center',
  '&.MuiButton-containedPrimary': {
    backgroundColor: '#3545EE',
    color: '#FAFAFA',
    '&:hover': {
      backgroundColor: '#2B39C7',
    },
  },
  '&.MuiButton-outlinedPrimary': {
    borderColor: '#3545EE',
    color: '#3545EE',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(53, 69, 238, 0.04)',
    },
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
}));

/**
 * Primary UI component for user interaction
 * 
 * @component
 * @example
 * ```tsx
 * <Button>Click Me</Button>
 * <Button variant="outlined" color="secondary">Secondary Button</Button>
 * <Button withPlusIcon>Add Crops</Button>
 * <Button startIcon={<CustomIcon />}>With Custom Icon</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  withPlusIcon = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={withPlusIcon ? <AddCircleOutlineIcon /> : startIcon}
      endIcon={endIcon}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;