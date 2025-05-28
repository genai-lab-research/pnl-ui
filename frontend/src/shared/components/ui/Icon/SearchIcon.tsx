import React from 'react';

import { Search } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

const SearchIcon: React.FC<SvgIconProps> = (props) => {
  return <Search {...props} />;
};

export default SearchIcon;
