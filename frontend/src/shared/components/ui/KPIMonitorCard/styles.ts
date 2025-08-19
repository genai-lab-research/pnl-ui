import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { KPIMonitorCardProps } from './types';

/**
 * Main container for the KPIMonitorCard component
 * Uses theme-based styling for consistency and responsiveness
 */
export const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'size', 'disabled', 'clickable'].includes(prop as string),
})<{
  variant: KPIMonitorCardProps['variant'];
  size: KPIMonitorCardProps['size'];
  disabled: boolean;
  clickable: boolean;
}>(({ theme, variant, size, disabled, clickable }) => {
  // Size-based spacing and dimensions
  const sizeConfig = {
    sm: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
      minWidth: theme.spacing(21), // 168px
      minHeight: theme.spacing(10), // 80px
      fontSize: theme.typography.caption.fontSize,
      titleLineHeight: theme.spacing(2), // 16px
      valueLineHeight: theme.spacing(3), // 24px
    },
    md: {
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      minWidth: theme.spacing(26), // 208px
      minHeight: theme.spacing(12.5), // 100px
      fontSize: theme.typography.body2.fontSize,
      titleLineHeight: theme.spacing(2.5), // 20px
      valueLineHeight: theme.spacing(4), // 32px
    },
    lg: {
      padding: theme.spacing(2.5),
      gap: theme.spacing(2.5),
      minWidth: theme.spacing(31), // 248px
      minHeight: theme.spacing(15), // 120px
      fontSize: theme.typography.body1.fontSize,
      titleLineHeight: theme.spacing(3), // 24px
      valueLineHeight: theme.spacing(5), // 40px
    },
  };

  const config = sizeConfig[size || 'md'];

  return {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F7F9FD' : theme.palette.background.paper,
    border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
    borderRadius: theme.spacing(0.75), // 6px
    padding: config.padding,
    gap: config.gap,
    minWidth: config.minWidth,
    minHeight: config.minHeight,
    width: 'fit-content',
    height: 'fit-content',
    
    transition: theme.transitions.create(['box-shadow', 'transform', 'background-color']),
    cursor: disabled ? 'not-allowed' : clickable ? 'pointer' : 'default',
    opacity: disabled ? theme.palette.action.disabledOpacity : 1,
    
    // Variant-specific styles
    ...(variant === 'compact' && {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
    }),
    
    ...(variant === 'elevated' && {
      boxShadow: theme.shadows[2],
      '&:hover': clickable && !disabled ? {
        boxShadow: theme.shadows[4],
      } : {},
    }),

    // Interactive states
    ...(clickable && !disabled && {
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: variant === 'elevated' ? theme.shadows[6] : theme.shadows[2],
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: variant === 'elevated' ? theme.shadows[2] : theme.shadows[1],
      },
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor: theme.palette.primary.main,
        outlineOffset: 2,
      },
    }),
    
    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(18), // 144px
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
    },
    
    [theme.breakpoints.down('xs')]: {
      minWidth: '100%',
      maxWidth: '100%',
    },
  };
});

/**
 * Title text with theme-based typography
 */
export const StyledTitleText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: KPIMonitorCardProps['size'] }>(({ theme, size }) => {
  const sizeConfig = {
    sm: {
      fontSize: '12px',
      lineHeight: '16px',
    },
    md: {
      fontSize: '14px',
      lineHeight: '20px',
    },
    lg: {
      fontSize: '16px',
      lineHeight: '24px',
    },
  };

  const config = sizeConfig[size || 'md'];

  return {
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
    fontSize: config.fontSize,
    fontWeight: 400,
    lineHeight: config.lineHeight,
    letterSpacing: 0,
    color: theme.palette.text.secondary,
    textAlign: 'left',
    textTransform: 'none',
    margin: 0,
    flexShrink: 0,
    alignSelf: 'flex-start',
    width: '100%',
    
    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: '16px',
    },
  };
});

/**
 * Value container for icon and values
 */
export const StyledValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'flex-start',
  gap: theme.spacing(0.75),
  flex: 1,
  width: '100%',
  
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(0.5),
  },
}));

/**
 * Icon container with theme-based sizing
 */
export const StyledIconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: KPIMonitorCardProps['size'] }>(({ theme, size }) => {
  const iconSizes = {
    sm: theme.spacing(2.5), // 20px
    md: theme.spacing(3.5), // 28px
    lg: theme.spacing(4),   // 32px
  };

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: iconSizes[size || 'md'],
    height: iconSizes[size || 'md'],
    opacity: 0.5,
    flexShrink: 0,
    color: theme.palette.text.secondary,
    alignSelf: 'center',
    
    '& svg, & img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    
    [theme.breakpoints.down('sm')]: {
      width: iconSizes.sm,
      height: iconSizes.sm,
    },
  };
});

/**
 * Value text with theme-based typography
 */
export const StyledValueText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: KPIMonitorCardProps['size'] }>(({ theme, size }) => {
  const sizeConfig = {
    sm: {
      fontSize: '24px',
      lineHeight: '32px',
    },
    md: {
      fontSize: '32px',
      lineHeight: '40px',
    },
    lg: {
      fontSize: '40px',
      lineHeight: '48px',
    },
  };

  const config = sizeConfig[size || 'md'];

  return {
    fontFamily: theme.typography.fontFamily,
    fontStyle: 'normal',
    fontSize: config.fontSize,
    fontWeight: 600,
    lineHeight: config.lineHeight,
    letterSpacing: 0,
    color: theme.palette.text.primary,
    textAlign: 'left',
    textTransform: 'none',
    margin: 0,
    flexShrink: 0,
    
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
      lineHeight: '32px',
    },
  };
});

/**
 * Loading container with theme-based styling
 */
export const LoadingContainer = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'size', 'disabled', 'clickable'].includes(prop as string),
})<{
  variant: KPIMonitorCardProps['variant'];
  size: KPIMonitorCardProps['size'];
  disabled: boolean;
  clickable: boolean;
}>(({ theme, variant, size }) => {
  const sizeConfig = {
    sm: {
      padding: theme.spacing(1.5),
      gap: theme.spacing(1.5),
      minWidth: theme.spacing(21), // 168px
      minHeight: theme.spacing(10), // 80px
    },
    md: {
      padding: theme.spacing(2),
      gap: theme.spacing(2),
      minWidth: theme.spacing(26), // 208px
      minHeight: theme.spacing(12.5), // 100px
    },
    lg: {
      padding: theme.spacing(2.5),
      gap: theme.spacing(2.5),
      minWidth: theme.spacing(31), // 248px
      minHeight: theme.spacing(15), // 120px
    },
  };

  const config = sizeConfig[size || 'md'];

  return {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F7F9FD' : theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(0.75), // 6px
    padding: config.padding,
    gap: config.gap,
    minWidth: config.minWidth,
    minHeight: config.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(18),
      padding: theme.spacing(1.5),
    },
  };
});

/**
 * Footer container for additional content
 */
export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
}));