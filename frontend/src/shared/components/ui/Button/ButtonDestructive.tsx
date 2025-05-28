import React from 'react';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonDestructiveProps extends Omit<MuiButtonProps, 'color'> {
  fullWidth?: boolean;
  rounded?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'rounded',
})<{ rounded?: boolean }>(({ theme, rounded }) => ({
  textTransform: 'none',
  fontWeight: 500,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  boxShadow: 'none',
  ...(rounded && {
    borderRadius: 24,
  }),
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    boxShadow: 'none',
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const ButtonDestructive: React.FC<ButtonDestructiveProps> = ({
  variant = 'contained',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  rounded = false,
  startIcon,
  endIcon,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      rounded={rounded}
      startIcon={startIcon}
      endIcon={endIcon}
      disableElevation
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default ButtonDestructive;
