import React from 'react';

import { Error } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

const ErrorIcon: React.FC<SvgIconProps> = (props) => {
  return <Error {...props} />;
};

export default ErrorIcon;
