import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';

const TemperatureIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-1 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-2-12a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1z" />
    </SvgIcon>
  );
};

export default TemperatureIcon;
