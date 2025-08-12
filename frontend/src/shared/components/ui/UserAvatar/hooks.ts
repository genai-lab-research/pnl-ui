import { useMemo, useCallback, useState } from 'react';
import { UserAvatarProps } from './types';

interface UseAvatarClassesProps {
  size: UserAvatarProps['size'];
  variant: UserAvatarProps['variant'];
  onClick?: UserAvatarProps['onClick'];
  className?: string;
}

export const useAvatarClasses = ({ 
  size, 
  variant, 
  onClick, 
  className = '' 
}: UseAvatarClassesProps) => {
  return useMemo(() => {
    const classes = [
      `size-${size}`,
      `variant-${variant}`,
      onClick ? 'clickable' : '',
      className
    ].filter(Boolean);
    
    return classes.join(' ');
  }, [size, variant, onClick, className]);
};

interface UseBadgeClassesProps {
  position: UserAvatarProps['badgePosition'];
}

export const useBadgeClasses = ({ position }: UseBadgeClassesProps) => {
  return useMemo(() => {
    return `position-${position}`;
  }, [position]);
};

interface UseInitialsProps {
  name: string;
  initials?: string;
}

export const useInitials = ({ name, initials }: UseInitialsProps) => {
  return useMemo(() => {
    if (initials) {
      return initials.slice(0, 2).toUpperCase();
    }
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    
    return name.slice(0, 2).toUpperCase();
  }, [name, initials]);
};

interface UseImageHandlerProps {
  src?: string;
  onError?: (error: string) => void;
}

export const useImageHandler = ({ src, onError }: UseImageHandlerProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(false);
    if (onError) {
      onError('Failed to load avatar image');
    }
  }, [onError]);

  const shouldShowImage = src && !imageError;
  const shouldShowFallback = !src || imageError;

  return {
    imageError,
    imageLoaded,
    shouldShowImage,
    shouldShowFallback,
    handleImageLoad,
    handleImageError
  };
};

interface UseBackgroundColorProps {
  backgroundColor?: string;
  name: string;
}

export const useBackgroundColor = ({ backgroundColor, name }: UseBackgroundColorProps) => {
  return useMemo(() => {
    if (backgroundColor) {
      return backgroundColor;
    }
    
    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  }, [backgroundColor, name]);
};