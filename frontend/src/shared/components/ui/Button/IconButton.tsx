import React from 'react';

import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CustomIconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: 32,
  medium: 40,
  large: 48,
};

const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => !['customSize'].includes(prop as string),
})<{ customSize: number }>(({ theme, customSize }) => ({
  width: customSize,
  height: customSize,
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  children,
  color = 'default',
  size = 'medium',
  disabled = false,
  ...props
}) => {
  // Map our custom color prop to MUI's color prop
  let muiColor: MuiIconButtonProps['color'];
  switch (color) {
    case 'primary':
      muiColor = 'primary';
      break;
    case 'secondary':
      muiColor = 'secondary';
      break;
    case 'error':
      muiColor = 'error';
      break;
    case 'info':
      muiColor = 'info';
      break;
    case 'success':
      muiColor = 'success';
      break;
    case 'warning':
      muiColor = 'warning';
      break;
    default:
      muiColor = 'default';
  }

  return (
    <StyledIconButton color={muiColor} disabled={disabled} customSize={sizeMap[size]} {...props}>
      {children}
    </StyledIconButton>
  );
};

export default CustomIconButton;
