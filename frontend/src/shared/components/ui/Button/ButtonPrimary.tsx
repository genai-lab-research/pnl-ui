import React from 'react';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ButtonPrimaryProps extends Omit<MuiButtonProps, 'color'> {
  fullWidth?: boolean;
  rounded?: boolean;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['rounded'].includes(String(prop)),
})<{ rounded?: boolean }>(({ theme, rounded }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textTransform: 'none',
  padding: theme.spacing(1.25, 1.5),
  borderRadius: rounded ? 20 : 6,
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: theme.palette.primary.dark,
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
  },
}));

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
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

export default ButtonPrimary;
