import React from 'react';

import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface TabButtonSmallProps extends Omit<ButtonProps, 'variant'> {
  active?: boolean;
}

const StyledTabButton = styled(Button, {
  shouldForwardProp: (prop) => !['active'].includes(String(prop)),
})<{ active?: boolean }>(({ theme, active }) => ({
  textTransform: 'none',
  minWidth: 64,
  height: 28,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  boxShadow: 'none',
  fontWeight: 500,
  fontSize: '0.75rem',
  letterSpacing: '0.1px',
  lineHeight: '16px',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

export const TabButtonSmall: React.FC<TabButtonSmallProps> = ({
  children,
  active = false,
  disabled = false,
  ...props
}) => {
  return (
    <StyledTabButton active={active} disableElevation disabled={disabled} disableRipple {...props}>
      {children}
    </StyledTabButton>
  );
};

export default TabButtonSmall;
