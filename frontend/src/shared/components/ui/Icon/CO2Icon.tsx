import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const CO2Icon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M4 18V10H2.5V6H7.5V10H6V18H4M14 18V14H10V10H14V6H18.5V18H14M16 14H16.5V10H16V14Z" />
    </SvgIcon>
  );
};

export default CO2Icon;