import React from 'react';
import clsx from 'clsx';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type ChipSmallVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'connected';

export interface ChipSmallProps extends Omit<ChipProps, 'color' | 'size' | 'label'> {
  label: string;
  variant?: ChipSmallVariant;
  className?: string;
  icon?: React.ReactNode;
}

// Map our custom variants to Material UI colors
const variantToColorMap: Record<ChipSmallVariant, any> = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  connected: 'success', // Map connected to success color
};

const StyledChip = styled(Chip)(({ theme }) => ({
  height: '24px',
  fontSize: '0.75rem',
  fontWeight: 600,
  borderRadius: '9999px', // Full rounded
  '& .MuiChip-label': {
    padding: '0 8px',
  },
  '& .MuiChip-icon': {
    marginLeft: '4px',
    marginRight: '-4px',
    fontSize: '16px',
  },
}));

export const ChipSmall: React.FC<ChipSmallProps> = ({
  label,
  variant = 'default',
  className,
  icon,
  ...props
}) => {
  // Map our custom variant to Material UI color
  const color = variantToColorMap[variant];

  return (
    <StyledChip 
      label={label}
      size="small"
      color={color}
      icon={icon ? <span className="mr-1">{icon}</span> : undefined}
      className={clsx('chip-small', className)}
      {...props}
    />
  );
};

export default ChipSmall;