import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

export interface ShippingContainerIconProps extends SvgIconProps {
  color?: string;
  size?: number | string;
}

const ShippingContainerIcon: React.FC<ShippingContainerIconProps> = ({
  color = 'currentColor',
  size,
  ...props
}) => {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 16 16"
      sx={{
        width: size,
        height: size,
        color,
      }}
    >
      <path
        d="M1 3a1 1 0 011-1h12a1 1 0 011 1v10a1 1 0 01-1 1H2a1 1 0 01-1-1V3zm1 .5v9h12v-9H2z"
        fill="currentColor"
      />
      <path d="M4 10V4h1v6H4zm7 0V4h1v6h-1z" fill="currentColor" />
      <path d="M1 10.5h14" stroke="currentColor" strokeWidth="1" />
    </SvgIcon>
  );
};

export default ShippingContainerIcon;
