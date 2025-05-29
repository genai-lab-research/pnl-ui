import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

export interface DestructiveButtonProps extends Omit<MuiButtonProps, 'color'> {
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

const StyledButton = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  fontFamily: 'Inter, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  padding: '10px 16px',
  borderRadius: '6px',
  border: `1px solid ${theme.palette.error.main}`,
  color: theme.palette.error.main,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: `${theme.palette.error.main}10`,
    borderColor: theme.palette.error.main,
  },
  '&:focus': {
    boxShadow: `0 0 0 3px ${theme.palette.error.main}30`,
  },
  '&:active': {
    backgroundColor: `${theme.palette.error.main}20`,
  },
  '&.Mui-disabled': {
    color: theme.palette.action.disabled,
    borderColor: theme.palette.action.disabled,
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
    color: 'inherit',
  },
  // Size specific styles
  '&.MuiButton-sizeSmall': {
    padding: '6px 12px',
    fontSize: '12px',
    lineHeight: '16px',
  },
  '&.MuiButton-sizeLarge': {
    padding: '12px 20px',
    fontSize: '16px',
    lineHeight: '24px',
  },
}));

/**
 * Destructive Button component for delete operations, featuring a trash icon and a destructive red color scheme.
 * It follows Material Design guidelines and provides a clear visual indication of its destructive nature.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <DestructiveButton>Delete Container</DestructiveButton>
 * 
 * // Disabled state
 * <DestructiveButton disabled>Delete Container</DestructiveButton>
 * 
 * // With click handler
 * <DestructiveButton onClick={() => handleDelete()}>
 *   Delete Container
 * </DestructiveButton>
 * ```
 */
export const DestructiveButton: React.FC<DestructiveButtonProps> = ({
  size = 'medium',
  disabled = false,
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant="outlined"
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={<DeleteIcon />}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default DestructiveButton;