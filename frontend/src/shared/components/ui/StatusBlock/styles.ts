import { styled } from '@mui/material/styles';
import { Box, Typography, Chip } from '@mui/material';
import { StatusBlockProps, StatusBadgeProps } from './types';

/**
 * Main container for the StatusBlock component
 * Uses theme-based styling for consistency
 */
export const StatusBlockContainer = styled(Box, {
  shouldForwardProp: (prop) => !['variant', 'size', 'disabled', 'clickable'].includes(prop as string),
})<{
  variant: StatusBlockProps['variant'];
  size: StatusBlockProps['size'];
  disabled?: boolean;
  clickable?: boolean;
}>(({ theme, variant, size, disabled, clickable }) => {
  // Size-based spacing and dimensions
  const sizeConfig = {
    sm: {
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      minHeight: theme.spacing(4),
      fontSize: theme.typography.caption.fontSize,
    },
    md: {
      gap: theme.spacing(1.5),
      padding: theme.spacing(1.5),
      minHeight: theme.spacing(5),
      fontSize: theme.typography.body2.fontSize,
    },
    lg: {
      gap: theme.spacing(2),
      padding: theme.spacing(2),
      minHeight: theme.spacing(7),
      fontSize: theme.typography.body1.fontSize,
    },
  };

  const config = sizeConfig[size || 'md'];

  return {
    display: 'flex',
    alignItems: 'center',
    gap: config.gap,
    padding: config.padding,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: variant === 'elevated' ? theme.palette.background.paper : 'transparent',
    minHeight: config.minHeight,
    width: '100%',
    maxWidth: variant === 'compact' ? theme.spacing(37.5) : '100%', // 300px in spacing units
    opacity: disabled ? theme.palette.action.disabledOpacity : 1,
    cursor: disabled ? 'not-allowed' : clickable ? 'pointer' : 'default',
    transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
    
    // Variant-specific styles
    ...(variant === 'outlined' && {
      border: `2px solid ${theme.palette.primary.main}`,
    }),
    
    ...(variant === 'elevated' && {
      boxShadow: theme.shadows[1],
      '&:hover': {
        boxShadow: theme.shadows[2],
      },
    }),

    // Interactive states
    ...(clickable && !disabled && {
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor: theme.palette.primary.main,
        outlineOffset: 2,
      },
    }),
    
    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      gap: config.gap * 0.75,
      padding: theme.spacing(1),
      minHeight: theme.spacing(4.5),
    },
  };
});

/**
 * Icon container with consistent sizing based on theme
 */
export const IconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: StatusBlockProps['size'] }>(({ theme, size }) => {
  const iconSizes = {
    sm: theme.spacing(1.75), // 14px
    md: theme.spacing(2),    // 16px
    lg: theme.spacing(2.5),  // 20px
  };

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: iconSizes[size || 'md'],
    height: iconSizes[size || 'md'],
    color: theme.palette.text.secondary,
    
    '& svg': {
      width: '100%',
      height: '100%',
      fill: 'currentColor',
    },
  };
});

/**
 * Description text with theme-based typography
 */
export const DescriptionText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: StatusBlockProps['size'] }>(({ theme, size }) => {
  const typographyVariants = {
    sm: 'caption',
    md: 'body2',
    lg: 'body1',
  } as const;

  return {
    flex: 1,
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeightRegular,
    variant: typographyVariants[size || 'md'],
    
    // Responsive font adjustments
    [theme.breakpoints.down('sm')]: {
      fontSize: size === 'lg' ? theme.typography.body2.fontSize : theme.typography.caption.fontSize,
    },
  };
});

/**
 * Status badge with theme-based color variants
 */
export const StatusBadge = styled(Chip, {
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop as string),
})<{
  variant: StatusBadgeProps['variant'];
  size: StatusBadgeProps['size'];
}>(({ theme, variant, size }) => {
  // Get colors from theme palette
  const getVariantColors = () => {
    switch (variant) {
      case 'active':
      case 'success':
        return {
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText,
        };
      case 'inactive':
        return {
          backgroundColor: theme.palette.grey[500],
          color: theme.palette.getContrastText(theme.palette.grey[500]),
        };
      case 'pending':
        return {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        };
      case 'warning':
        return {
          backgroundColor: theme.palette.warning.main,
          color: theme.palette.warning.contrastText,
        };
      case 'error':
        return {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
        };
      default:
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        };
    }
  };

  const colors = getVariantColors();
  
  // Size-based dimensions
  const sizeConfig = {
    sm: {
      height: theme.spacing(2.25), // 18px
      fontSize: theme.typography.caption.fontSize,
      padding: theme.spacing(0.75),
    },
    md: {
      height: theme.spacing(2.75), // 22px
      fontSize: theme.typography.caption.fontSize,
      padding: theme.spacing(1.375), // 11px
    },
    lg: {
      height: theme.spacing(3.5), // 28px
      fontSize: theme.typography.body2.fontSize,
      padding: theme.spacing(1.75), // 14px
    },
  };

  const config = sizeConfig[size || 'md'];
  
  return {
    ...colors,
    border: `1px solid ${colors.backgroundColor}`,
    borderRadius: theme.spacing(125), // 9999px equivalent
    height: config.height,
    fontSize: config.fontSize,
    fontWeight: theme.typography.fontWeightSemiBold || 600,
    fontFamily: theme.typography.fontFamily,
    
    '& .MuiChip-label': {
      padding: `0 ${config.padding}px`,
    },
    
    // Responsive adjustments
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(2.5),
      fontSize: theme.typography.caption.fontSize,
      '& .MuiChip-label': {
        padding: `0 ${theme.spacing(1)}px`,
      },
    },
  };
});

/**
 * Footer container for additional content
 */
export const FooterContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
}));

/**
 * Loading skeleton container
 */
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  minHeight: theme.spacing(5),
  width: '100%',
}));
