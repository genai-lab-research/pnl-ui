import React, { useState, useEffect } from 'react';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import clsx from 'clsx';
import { useTheme, Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type AvatarVariant = 'circular' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline' | 'none';

export interface AvatarProps extends Omit<MuiAvatarProps, 'variant'> {
  /**
   * The src attribute for the img element.
   */
  src?: string;

  /**
   * The alt attribute for the img element.
   */
  alt?: string;

  /**
   * Used in combination with `src` or `srcSet` to provide an alt attribute for the rendered img element.
   */
  name?: string;

  /**
   * The size of the avatar.
   * @default 'medium'
   */
  size?: AvatarSize;

  /**
   * The shape of the avatar.
   * @default 'circular'
   */
  variant?: AvatarVariant;

  /**
   * Custom CSS class for the avatar.
   */
  className?: string;
  
  /**
   * If true, the avatar will display a loading indicator.
   * @default false
   */
  loading?: boolean;

  /**
   * Custom fallback icon when src fails to load and no name is provided.
   */
  fallbackIcon?: React.ReactNode;

  /**
   * Status indicator for the avatar.
   * @default 'none'
   */
  status?: AvatarStatus;


  /**
   * Set of sources for different screen sizes when using responsive images.
   */
  srcSet?: string;

  /**
   * Shadow effect level for the avatar.
   * @default 0
   */
  elevation?: 0 | 1 | 2 | 3;
  
  /**
   * If true, the avatar will have a border.
   * @default false
   */
  bordered?: boolean;
  
  /**
   * Border color for the avatar when bordered is true.
   */
  borderColor?: string;
  
  /**
   * If true, the avatar will adjust size based on screen size.
   * @default true
   */
  responsive?: boolean;
}


// Responsive size map configuration
const getResponsiveSizeMap = (theme: Theme) => {
  const baseUnit = theme.spacing(1); // Usually 8px in most Material UI themes
  
  return {
    xsmall: {
      width: `calc(${baseUnit} * 2)`, // 16px typically
      height: `calc(${baseUnit} * 2)`,
      fontSize: '0.75rem',
    },
    small: {
      width: `calc(${baseUnit} * 3)`, // 24px typically
      height: `calc(${baseUnit} * 3)`,
      fontSize: '0.875rem',
    },
    medium: {
      width: `calc(${baseUnit} * 5)`, // 40px typically
      height: `calc(${baseUnit} * 5)`,
      fontSize: '1.25rem',
    },
    large: {
      width: `calc(${baseUnit} * 7)`, // 56px typically
      height: `calc(${baseUnit} * 7)`,
      fontSize: '1.5rem',
    },
    xlarge: {
      width: `calc(${baseUnit} * 9)`, // 72px typically
      height: `calc(${baseUnit} * 9)`,
      fontSize: '1.75rem',
    },
  };
};

// Status indicator styling
const getStatusStyles = (status: AvatarStatus, theme: Theme) => {
  if (status === 'none') return {};

  // Fixed status indicator size
  const statusSize = theme.spacing(1.5); // 12px

  // Color based on status
  const statusColorMap = {
    online: theme.palette.success.main || '#4caf50',
    busy: theme.palette.error.main || '#f44336',
    away: theme.palette.warning.main || '#ff9800',
    offline: theme.palette.grey[400] || '#bdbdbd',
    none: 'transparent',
  };

  return {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '5%',
      right: '5%',
      width: statusSize,
      height: statusSize,
      borderRadius: '50%',
      backgroundColor: statusColorMap[status],
      border: `2px solid ${theme.palette.background.paper}`,
      boxSizing: 'border-box',
    },
  };
};

// Get elevation (shadow) styles
const getElevationStyles = (elevation: 0 | 1 | 2 | 3, theme: Theme) => {
  if (elevation === 0) return {};

  const shadowMap = {
    1: theme.shadows[1],
    2: theme.shadows[4],
    3: theme.shadows[8],
  };

  return {
    boxShadow: shadowMap[elevation],
  };
};

// Styled avatar component with fixed TypeScript issues
interface StyledAvatarProps {
  avatarSize?: AvatarSize; 
  isLoading?: boolean; 
  avatarStatus?: AvatarStatus;
  elevation?: 0 | 1 | 2 | 3;
  bordered?: boolean;
  borderColor?: string;
  responsive?: boolean;
}

const StyledAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => !['avatarSize', 'isLoading', 'avatarStatus', 'elevation', 'bordered', 'borderColor', 'responsive'].includes(String(prop)),
})<StyledAvatarProps>((props) => {
  const { 
    theme, 
    avatarSize = 'medium', 
    isLoading, 
    avatarStatus = 'none', 
    elevation = 0, 
    bordered = false, 
    borderColor, 
    responsive = true 
  } = props;
  
  const sizeMap = getResponsiveSizeMap(theme);

  // Base styles
  return {
    backgroundColor: '#EAEAEA',
    color: '#666666',
    position: 'relative' as const,
    ...(avatarSize && sizeMap[avatarSize]),
    
    // Add box-sizing to ensure consistent sizing with borders
    boxSizing: 'border-box' as const,
    
    // Add loading state
    ...(isLoading && {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
        borderRadius: 'inherit',
      },
    }),
    
    // Style SVG icons
    '& .MuiSvgIcon-root': {
      color: '#666666',
      width: '60%',
      height: '60%',
    },
    
    // Add status indicator
    ...getStatusStyles(avatarStatus, theme),
    
    // Add shadow if elevation is set
    ...getElevationStyles(elevation, theme),
    
    // Add border if specified
    ...(bordered && {
      border: `2px solid ${borderColor || theme.palette.background.paper}`,
    }),
    
    // Add responsive styles for different breakpoints
    ...(responsive && {
      [`${theme.breakpoints.down('sm')}`]: {
        ...(avatarSize === 'large' ? sizeMap['medium'] : {}),
        ...(avatarSize === 'xlarge' ? sizeMap['large'] : {}),
      },
      [`${theme.breakpoints.down(600)}`]: { // Using pixel value instead of 'xs' as down('xs') is deprecated
        ...(avatarSize === 'medium' ? sizeMap['small'] : {}),
        ...(avatarSize === 'large' ? sizeMap['small'] : {}),
        ...(avatarSize === 'xlarge' ? sizeMap['medium'] : {}),
      },
    }),
  };
});

/**
 * Avatar component to display user profile image or initials
 *
 * A versatile avatar component that supports images, initials, custom icons,
 * responsive sizing, status indicators, and various styling options.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Avatar src="/path/to/image.jpg" alt="User Name" />
 * 
 * // With user name fallback (shows initials if image fails to load)
 * <Avatar src="/path/to/image.jpg" name="John Doe" size="large" />
 * 
 * // With status indicator
 * <Avatar name="John Doe" status="online" />
 * 
 * // With elevation and border
 * <Avatar 
 *   src="/path/to/image.jpg" 
 *   elevation={2} 
 *   bordered 
 *   borderColor="#2196f3" 
 * />
 * 
 * // With responsive sizing
 * <Avatar 
 *   src="/path/to/image.jpg" 
 *   size="xlarge" 
 *   responsive
 *   srcSet="/path/to/small.jpg 300w, /path/to/medium.jpg 600w"
 * />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  srcSet,
  alt,
  name,
  size = 'medium',
  variant = 'circular',
  className,
  loading = false,
  fallbackIcon = <PersonIcon />,
  status = 'none',
  responsive = true,
  elevation = 0,
  bordered = false,
  borderColor,
  ...props
}) => {
  // State to track image loading error
  const [hasError, setHasError] = useState(false);
  const theme = useTheme();
  
  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);
  
  // Get appropriate size based on screen size if responsive
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isXsScreen = useMediaQuery('(max-width:600px)'); // Use explicit pixel value instead of 'xs'

  // Adjust size based on screen size if responsive is true
  const getResponsiveSize = (): AvatarSize => {
    if (!responsive) return size;
    
    if (isXsScreen) {
      if (size === 'xlarge') return 'medium';
      if (size === 'large' || size === 'medium') return 'small';
      return 'xsmall';
    } else if (isSmallScreen) {
      if (size === 'xlarge') return 'large';
      if (size === 'large') return 'medium';
      return size;
    }
    
    return size;
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a background color based on name for consistent color per user
  const getBackgroundColor = (name: string) => {
    if (!name) return '#EAEAEA';
    
    // Simple hash function
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate HSL color with fixed saturation and lightness for good contrast
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 80%)`; // Pastel color for good contrast with text
  };

  // Determine what to render inside the avatar
  const renderChildren = () => {
    if (loading) {
      return null; // The loading state is handled via CSS
    }

    if (!hasError && src) {
      return undefined; // Let Material UI handle the image
    }

    if (name) {
      return getInitials(name);
    }

    return fallbackIcon;
  };
  
  // Choose the appropriate background color if using initials
  const bgStyle = name && !src ? { bgcolor: getBackgroundColor(name) } : {};
  const responsiveSize = getResponsiveSize();

  // Make TypeScript happy with proper typing
  const avatarProps = {
    src: hasError ? undefined : src,
    srcSet,
    alt: alt || name || 'Avatar',
    avatarSize: responsiveSize,
    variant: variant as any, // Type casting to handle TS error
    className: clsx(className),
    isLoading: loading,
    avatarStatus: status as any, // Type casting to handle TS error
    elevation: elevation as any, // Type casting to handle TS error
    bordered,
    borderColor,
    responsive,
    onError: () => setHasError(true),
    ...bgStyle,
    ...props
  };

  return (
    <StyledAvatar {...avatarProps}>
      {renderChildren()}
    </StyledAvatar>
  );
};

export default Avatar;