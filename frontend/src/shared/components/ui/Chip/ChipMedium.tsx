import React from 'react';
import clsx from 'clsx';
import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type ChipMediumVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'maintenance';

export interface ChipMediumProps extends Omit<ChipProps, 'color' | 'size' | 'label'> {
  label: string;
  variant?: ChipMediumVariant;
  className?: string;
  icon?: React.ReactNode;
}

// Map our custom variants to Material UI colors
const variantToColorMap: Record<ChipMediumVariant, any> = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  maintenance: 'warning', // Map maintenance to warning color but with custom styling
};

const StyledChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: ChipMediumVariant }>(({ theme, variant }) => ({
  height: '32px',
  fontSize: '0.875rem',
  fontWeight: 600,
  borderRadius: '9999px', // Full rounded
  '& .MuiChip-label': {
    padding: '0 12px',
  },
  '& .MuiChip-icon': {
    marginLeft: '8px',
    marginRight: '-4px',
    fontSize: '18px',
  },
  // Special case for maintenance variant
  ...(variant === 'maintenance' && {
    backgroundColor: '#F97316',
    color: '#FFFFFF',
  }),
}));

export const ChipMedium: React.FC<ChipMediumProps> = ({
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
      size="medium"
      color={color}
      icon={icon ? <span className="mr-2">{icon}</span> : undefined}
      className={clsx('chip-medium', className)}
      variant={variant === 'maintenance' ? 'filled' : undefined}
      {...props}
    />
  );
};

export default ChipMedium;