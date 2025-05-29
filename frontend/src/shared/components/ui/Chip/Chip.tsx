import React from 'react';
import { Chip as MuiChip, ChipProps as MuiChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

export type ChipVariant = 'filled' | 'outlined';
export type ChipSize = 'small' | 'medium';
export type ChipStatus = 'active' | 'inactive' | 'default' | 'in-progress';

export interface CustomChipProps extends Omit<MuiChipProps, 'variant' | 'color'> {
  /**
   * The variant of the chip.
   * @default 'filled'
   */
  variant?: ChipVariant;
  
  /**
   * The size of the chip.
   * @default 'small'
   */
  size?: ChipSize;
  
  /**
   * The status of the chip which determines its color.
   * @default 'default'
   */
  status?: ChipStatus;
  
  /**
   * The number or text to display within the chip.
   * @default 0
   */
  value?: number | string;
}

const StyledChip = styled(MuiChip, {
  shouldForwardProp: (prop) => !['status'].includes(prop as string),
})<{ status?: ChipStatus }>(({ theme, status }) => ({
  fontFamily: 'Inter, sans-serif',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 8px',
  height: '24px',
  borderRadius: '12px',
  
  // Status-specific styling based on Figma component
  ...(status === 'active' && {
    backgroundColor: '#479F67', // Exact color from Figma
    color: '#FAFAFA',
    '&:hover': {
      backgroundColor: '#3d8657', // Slightly darker on hover
    },
    '&:focus': {
      backgroundColor: '#3d8657',
      boxShadow: '0 0 0 2px rgba(71, 159, 103, 0.25)',
    },
    '&.Mui-disabled': {
      backgroundColor: '#479F67',
      opacity: 0.5,
      color: '#FAFAFA',
    },
  }),
  ...(status === 'inactive' && {
    backgroundColor: '#F4F4F5',
    color: '#18181B',
    '&:hover': {
      backgroundColor: '#e4e4e5',
    },
    '&:focus': {
      backgroundColor: '#e4e4e5',
      boxShadow: '0 0 0 2px rgba(244, 244, 245, 0.25)',
    },
    '&.Mui-disabled': {
      backgroundColor: '#F4F4F5',
      opacity: 0.5,
      color: '#18181B',
    },
  }),
  ...(status === 'default' && {
    backgroundColor: theme?.palette?.primary?.main || '#3f51b5',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: theme?.palette?.primary?.dark || '#002984',
    },
    '&:focus': {
      backgroundColor: theme?.palette?.primary?.dark || '#002984',
      boxShadow: `0 0 0 2px ${theme?.palette?.primary?.light || '#757de8'}`,
    },
    '&.Mui-disabled': {
      backgroundColor: theme?.palette?.primary?.main || '#3f51b5',
      opacity: 0.5,
      color: '#FFFFFF',
    },
  }),
  ...(status === 'in-progress' && {
    backgroundColor: '#F97316', // Orange color from Figma
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#E86C0D', // Slightly darker on hover
    },
    '&:focus': {
      backgroundColor: '#E86C0D',
      boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.25)',
    },
    '&.Mui-disabled': {
      backgroundColor: '#F97316',
      opacity: 0.5,
      color: '#FFFFFF',
    },
  }),

  // Variant-specific styling
  '&.MuiChip-outlined': {
    backgroundColor: 'transparent',
    ...(status === 'active' && {
      color: '#479F67',
      borderColor: '#479F67',
      '&:hover': {
        backgroundColor: 'rgba(71, 159, 103, 0.04)',
      },
    }),
    ...(status === 'inactive' && {
      color: '#18181B',
      borderColor: '#F4F4F5',
      '&:hover': {
        backgroundColor: 'rgba(244, 244, 245, 0.12)',
      },
    }),
    ...(status === 'default' && {
      color: theme?.palette?.primary?.main || '#3f51b5',
      borderColor: theme?.palette?.primary?.main || '#3f51b5',
      '&:hover': {
        backgroundColor: `${theme?.palette?.primary?.main || '#3f51b5'}10`,
      },
    }),
    ...(status === 'in-progress' && {
      color: '#F97316',
      borderColor: '#F97316',
      '&:hover': {
        backgroundColor: 'rgba(249, 115, 22, 0.04)',
      },
    }),
  },
  
  // Size-specific styling
  '&.MuiChip-sizeSmall': {
    height: '24px',
    fontSize: '12px',
    padding: '0 8px',
  },
  
  '&.MuiChip-sizeMedium': {
    height: '32px',
    fontSize: '14px',
    padding: '0 12px',
  },
  
  // Enhanced responsive styling
  [theme?.breakpoints?.down('sm') || '@media (max-width: 599px)']: {
    '&.MuiChip-sizeSmall': {
      fontSize: '11px',
      height: '22px',
      padding: '0 6px',
      borderRadius: '11px', // Maintain border-radius to height ratio
    },
    '&.MuiChip-sizeMedium': {
      fontSize: '13px',
      height: '28px',
      padding: '0 10px',
      borderRadius: '14px', // Maintain border-radius to height ratio
    },
  },
  
  // Additional breakpoint for extra small screens
  '@media (max-width: 375px)': {
    '&.MuiChip-sizeSmall': {
      fontSize: '10px',
      height: '20px',
      padding: '0 5px',
      borderRadius: '10px',
    },
    '&.MuiChip-sizeMedium': {
      fontSize: '12px',
      height: '26px',
      padding: '0 8px',
      borderRadius: '13px',
    },
  },

  // Label styling with overflow handling
  '& .MuiChip-label': {
    padding: '0',
    maxWidth: '200px', // Prevent extremely long text
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    
    // Adjust max width for smaller screens
    [theme?.breakpoints?.down('sm') || '@media (max-width: 599px)']: {
      maxWidth: '150px',
    },
    '@media (max-width: 375px)': {
      maxWidth: '120px',
    },
  },
}));

/**
 * Chip component for displaying status indicators or values
 * 
 * A versatile component for representing a compact element of data, such as
 * a status indicator, counter, or category label. The component is fully responsive
 * and adapts to different screen sizes while maintaining pixel-perfect design.
 * 
 * Long text content is automatically truncated with ellipsis to maintain the chip's
 * compact appearance across all device sizes.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic chips with different statuses
 * <Chip value={0} status="active" />
 * <Chip value="New" status="inactive" />
 * <Chip value={42} status="default" />
 * <Chip value="In progress" status="in-progress" />
 * 
 * // Different sizes
 * <Chip value="Small" size="small" />
 * <Chip value="Medium" size="medium" />
 * 
 * // Outlined variant
 * <Chip value="Outlined" variant="outlined" status="active" />
 * <Chip value="In progress" variant="outlined" status="in-progress" />
 * 
 * // Disabled state
 * <Chip value="Disabled" disabled />
 * 
 * // With long text (will be truncated with ellipsis)
 * <Chip value="This is a very long text that will be truncated" status="active" />
 * ```
 * 
 * ## Responsive Behavior
 * - On desktop (>= 900px): Full size with 12px font for small, 14px for medium
 * - On tablet (600px - 899px): Slightly reduced size
 * - On mobile (< 600px): Further reduced size with adjusted padding
 * - On small mobile (< 375px): Minimal size for very small screens
 */
export const Chip: React.FC<CustomChipProps> = ({
  variant = 'filled',
  size = 'small',
  status = 'default',
  value = 0,
  className,
  ...props
}) => {
  return (
    <StyledChip
      variant={variant}
      size={size}
      status={status}
      label={value}
      className={clsx(className)}
      {...props}
    />
  );
};

export default Chip;