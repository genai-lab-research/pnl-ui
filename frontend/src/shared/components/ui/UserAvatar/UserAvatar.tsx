/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { UserAvatarProps } from './types';
import { 
  useAvatarClasses, 
  useBadgeClasses, 
  useInitials, 
  useImageHandler, 
  useBackgroundColor 
} from './hooks';
import {
  avatarContainerStyles,
  avatarImageStyles,
  fallbackStyles,
  badgeStyles,
  loadingStyles,
  errorStyles
} from './styles';

/**
 * UserAvatar - A reusable avatar component for displaying user profile pictures
 * 
 * Features:
 * - Multiple size variants (sm, md, lg, xl)
 * - Shape variants (circle, rounded, square)
 * - Fallback to initials when no image is provided
 * - Badge support for status indicators
 * - Loading and error states
 * - Accessible with proper ARIA labels
 * - Responsive design
 * - Click handler support
 * - Consistent color generation for initials fallback
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  src,
  alt,
  size = 'md',
  variant = 'circle',
  badge = false,
  badgeContent,
  badgePosition = 'top-right',
  initials,
  loading = false,
  error,
  onClick,
  className = '',
  ariaLabel,
  backgroundColor,
  textColor = '#ffffff'
}) => {
  const avatarClasses = useAvatarClasses({ size, variant, onClick, className });
  const badgeClasses = useBadgeClasses({ position: badgePosition });
  const displayInitials = useInitials({ name, initials });
  const generatedBackgroundColor = useBackgroundColor({ backgroundColor, name });
  const { 
    shouldShowImage, 
    shouldShowFallback, 
    handleImageLoad, 
    handleImageError 
  } = useImageHandler({ src });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  const effectiveAriaLabel = ariaLabel || `${name}'s avatar`;

  // Error state
  if (error) {
    return (
      <div 
        css={[avatarContainerStyles, errorStyles]} 
        className={avatarClasses}
        role="img"
        aria-label={effectiveAriaLabel}
      >
        Error
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div 
        css={[avatarContainerStyles, loadingStyles]} 
        className={avatarClasses}
        role="status"
        aria-label="Loading avatar"
      >
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div
      css={avatarContainerStyles}
      className={avatarClasses}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={effectiveAriaLabel}
    >
      {/* Avatar Image */}
      {shouldShowImage && (
        <img
          css={avatarImageStyles}
          src={src}
          alt={alt || name}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Fallback Initials */}
      {shouldShowFallback && (
        <div 
          css={[fallbackStyles, { 
            backgroundColor: generatedBackgroundColor,
            color: textColor 
          }]}
          className={`size-${size}`}
        >
          {displayInitials}
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div 
          css={badgeStyles} 
          className={badgeClasses}
          role="status"
          aria-label="Status indicator"
        >
          {badgeContent || ''}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;