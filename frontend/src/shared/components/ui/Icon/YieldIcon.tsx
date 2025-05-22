import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const YieldIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M17 20c0-1.66-1.34-3-3-3 0-1.66-1.34-3-3-3-1.66 0-3 1.34-3 3H5V7h2V4H5V3h6v4H9v3h2v2h2v-3h6V7h-2V4h-2.03V3H19v4h-2v3.12l2 2V20h-2zm-5-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-3-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </SvgIcon>
  );
};

export default YieldIcon;