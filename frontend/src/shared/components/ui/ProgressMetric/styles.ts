import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const sizeConfig = {
  sm: {
    fontSize: '14px',
    lineHeight: '24px',
    gap: 12,
    progressHeight: 8,
    minHeight: '24px',
  },
  md: {
    fontSize: '16px',
    lineHeight: '28px',
    gap: 16,
    progressHeight: 12,
    minHeight: '28px',
  },
  lg: {
    fontSize: '18px',
    lineHeight: '32px',
    gap: 20,
    progressHeight: 16,
    minHeight: '32px',
  },
};

export const StyledContainer = styled(Box)<{ 
  variant: 'default' | 'compact' | 'outlined';
  disabled?: boolean;
  clickable?: boolean;
}>(({ theme, variant, disabled, clickable }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  minWidth: '280px',
  maxWidth: '600px',
  opacity: disabled ? 0.5 : 1,
  cursor: clickable && !disabled ? 'pointer' : 'default',
  transition: 'all 0.2s ease',
  
  ...(variant === 'outlined' && {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
  }),
  
  ...(variant === 'compact' && {
    minWidth: '200px',
  }),
  
  ...(clickable && !disabled && {
    '&:hover': {
      opacity: 0.8,
    },
  }),
  
  '@media (max-width: 600px)': {
    minWidth: '100%',
    flexDirection: variant === 'compact' ? 'row' : 'column',
    alignItems: variant === 'compact' ? 'center' : 'flex-start',
    gap: variant === 'compact' ? '8px' : '4px',
  },
}));

export const LabelText = styled(Typography)<{ size: 'sm' | 'md' | 'lg' }>(
  ({ theme, size }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: sizeConfig[size].fontSize,
    fontWeight: 400,
    lineHeight: sizeConfig[size].lineHeight,
    letterSpacing: 0,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    
    '@media (max-width: 600px)': {
      fontSize: size === 'lg' ? '16px' : sizeConfig[size].fontSize,
    },
  })
);

export const ValueText = styled(Typography)<{ size: 'sm' | 'md' | 'lg' }>(
  ({ theme, size }) => ({
    fontFamily: theme.typography.fontFamily,
    fontSize: sizeConfig[size].fontSize,
    fontWeight: 700,
    lineHeight: sizeConfig[size].lineHeight,
    letterSpacing: 0,
    color: theme.palette.text.primary,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    
    '@media (max-width: 600px)': {
      fontSize: size === 'lg' ? '16px' : sizeConfig[size].fontSize,
    },
  })
);

export const ProgressCluster = styled(Box)<{ size: 'sm' | 'md' | 'lg' }>(
  ({ size }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: `${size === 'sm' ? 6 : 8}px`,
    flex: 1,
    minWidth: 0,
    
    '@media (max-width: 600px)': {
      width: '100%',
    },
  })
);

// Progress Bar Styles
export const ProgressBarContainer = styled('div')<{ 
  height: number; 
  borderRadius: number;
}>(({ height, borderRadius }) => ({
  position: 'relative',
  width: '100%',
  minWidth: '100px',
  maxWidth: '300px',
  height: `${height}px`,
  borderRadius: `${borderRadius}px`,
  overflow: 'hidden',
  flex: 1,
  
  '@media (max-width: 600px)': {
    maxWidth: '100%',
  },
}));

export const ProgressBarTrack = styled('div')<{ 
  backgroundColor: string; 
  borderRadius: number;
}>(({ theme, backgroundColor, borderRadius }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: backgroundColor || theme.palette.action.hover,
  borderRadius: `${borderRadius}px`,
  opacity: 0.1,
}));

export const ProgressBarFill = styled('div')<{ 
  value: number; 
  color: string; 
  borderRadius: number;
}>(({ theme, value, color, borderRadius }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: `${Math.min(100, Math.max(0, value))}%`,
  height: '100%',
  backgroundColor: color || theme.palette.success.main,
  borderRadius: `${borderRadius}px`,
  transition: 'width 0.3s ease-in-out',
  background: `linear-gradient(90deg, ${color || theme.palette.success.main} 0%, ${color || theme.palette.success.main} 100%)`,
}))