import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const HumidityIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M12 3.77l7.11 7.11c2.34 2.34 2.34 6.14 0 8.49-2.34 2.34-6.14 2.34-8.49 0a3.894 3.894 0 0 1-1.66-1.66c-2.34-2.34-2.34-6.14 0-8.49L12 3.77m0-2.41L3.52 9.63c-3.12 3.12-3.12 8.19 0 11.31 1.56 1.56 3.61 2.34 5.66 2.34 2.05 0 4.09-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31L12 1.36z" />
    </SvgIcon>
  );
};

export default HumidityIcon;