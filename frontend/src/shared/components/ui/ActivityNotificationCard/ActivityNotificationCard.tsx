/** @jsxImportSource @emotion/react */
import React from 'react';
import { ActivityNotificationCardProps } from './types';
import { AvatarIcon, PersonIcon, ClockIcon } from './components';
import {
  cardStyles,
  contentStyles,
  messageStyles,
  metaStyles,
  timestampStyles,
  timestampTextStyles,
  timestampIconStyles,
  authorStyles,
  loadingStyles,
  errorStyles,
} from './styles';

/**
 * ActivityNotificationCard - A reusable notification/activity card component
 * 
 * Displays activity notifications with avatar, message, timestamp and author.
 * Designed to be generic and domain-agnostic.
 */
export const ActivityNotificationCard: React.FC<ActivityNotificationCardProps> = ({
  message,
  author,
  timestamp,
  avatarIcon,
  avatarVariant = 'success',
  timestampIcon,
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  ariaLabel,
  className = '',
  onClick,
}) => {
  // Handle loading state
  if (loading) {
    return (
      <div 
        css={[cardStyles, loadingStyles]}
        className={`variant-${variant} size-${size} ${className}`}
        role="status"
        aria-label="Loading notification"
      >
        <div className="skeleton skeleton-avatar" />
        <div css={contentStyles}>
          <div className="skeleton skeleton-message" />
          <div css={metaStyles}>
            <div className="skeleton skeleton-timestamp" />
            <div className="skeleton skeleton-author" />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div 
        css={errorStyles}
        className={className}
        role="alert"
        aria-label={`Error: ${error}`}
      >
        {error}
      </div>
    );
  }

  const cardClassNames = [
    `variant-${variant}`,
    `size-${size}`,
    onClick ? 'clickable' : '',
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  // Default icons
  const defaultAvatarIcon = avatarIcon || <PersonIcon />;
  const defaultTimestampIcon = timestampIcon || <ClockIcon />;

  return (
    <div
      css={cardStyles}
      className={cardClassNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : 'article'}
      aria-label={ariaLabel || `Activity notification: ${message}`}
    >
      <AvatarIcon
        icon={defaultAvatarIcon}
        variant={avatarVariant}
        size={size}
      />
      
      <div css={contentStyles}>
        <div css={messageStyles}>
          {message}
        </div>
        
        <div css={metaStyles}>
          <div css={timestampStyles}>
            <div css={timestampIconStyles}>
              {defaultTimestampIcon}
            </div>
            <div css={timestampTextStyles}>
              {timestamp}
            </div>
          </div>
          
          <div css={authorStyles}>
            {author}
          </div>
        </div>
      </div>

      {footerSlot && (
        <div>
          {footerSlot}
        </div>
      )}
    </div>
  );
};