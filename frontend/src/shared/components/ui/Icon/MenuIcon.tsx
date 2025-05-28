import React from 'react';

import { Menu } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

const MenuIcon: React.FC<SvgIconProps> = (props) => {
  return <Menu {...props} />;
};

export default MenuIcon;
