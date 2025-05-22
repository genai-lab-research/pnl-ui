import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export interface ArrowDropDownIconProps extends SvgIconProps {
  className?: string;
}

export const ArrowDropDownIcon: React.FC<ArrowDropDownIconProps> = ({ className, ...props }) => {
  return (
    <StyledSvgIcon
      className={className}
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path d="M7 10l5 5 5-5z" />
    </StyledSvgIcon>
  );
};

export default ArrowDropDownIcon;