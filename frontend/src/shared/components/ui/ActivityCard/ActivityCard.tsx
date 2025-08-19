import React from 'react';
import { Skeleton, Alert } from '@mui/material';
import { ActivityCardProps } from './types';
import {
  StyledContainer,
  StyledAvatar,
  StyledContentContainer,
  StyledTitle,
  StyledMetaRow,
  StyledTimestampContainer,
  StyledTimestampIcon,
  StyledMetaText,
  LoadingContainer,
  ErrorContainer,
  FooterContainer,
} from './styles';

// Default person icon component - matches the avatar from Figma
const DefaultPersonIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
      fill="currentColor"
    />
    <path 
      d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" 
      fill="currentColor"
    />
  </svg>
);

// Schedule icon component for timestamps
const ScheduleIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 0C3.589 0 0 3.589 0 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14.4A6.4 6.4 0 1 1 8 1.6a6.4 6.4 0 0 1 0 12.8z" 
      fill="currentColor"
    />
    <path 
      d="M8.8 4H7.2v4.8l3.6 2.16.8-1.28L8.8 7.6V4z" 
      fill="currentColor"
    />
  </svg>
);

/**
 * ActivityCard - A reusable component for displaying activity notifications and system events
 * 
 * Use this component to show activity feeds, notification lists, event logs, or any 
 * time-based user/system actions. Perfect for dashboards, activity feeds, or audit trails.
 * 
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Multiple size variants (sm, md, lg)
 * - Visual variants (default, compact, outlined, elevated)
 * - Loading and error states
 * - Customizable avatar icons and colors
 * - Timestamp and author display
 * - Theme integration with consistent styling
 * - Proper accessibility support
 */
export const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  timestamp,
  author,
  subtitle,
  avatarIcon,
  avatarColor = '#489F68',
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  ariaLabel,
  className,
  onClick,
  disabled = false,
  showTimestampIcon = true,
  footerSlot,
}) => {
  // Generate accessible label
  const generatedAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel;
    
    let label = `Activity: ${title}`;
    if (timestamp) label += `, occurred at ${timestamp}`;
    if (author) label += `, by ${author}`;
    if (subtitle) label += `, ${subtitle}`;
    if (error) label += `, Error: ${error}`;
    
    return label;
  }, [ariaLabel, title, timestamp, author, subtitle, error]);

  // Determine if component is clickable
  const isClickable = Boolean(onClick && !disabled);

  // Handle loading state
  if (loading) {
    return (
      <LoadingContainer 
        className={className} 
        $variant={variant}
        $size={size}
        $disabled={disabled}
        $clickable={false}
        role="status"
        aria-label="Loading activity data"
      >
        <Skeleton 
          variant="circular" 
          width={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} 
          height={size === 'sm' ? 24 : size === 'lg' ? 40 : 32} 
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Skeleton variant="text" width="70%" height={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          <Skeleton variant="text" width="50%" height={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
        </div>
      </LoadingContainer>
    );
  }

  // Handle error state
  if (error) {
    return (
      <ErrorContainer className={className} role="alert" aria-label={`Error: ${error}`}>
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      </ErrorContainer>
    );
  }

  // Render avatar
  const renderAvatar = () => {
    return (
      <StyledAvatar $backgroundColor={avatarColor} $size={size}>
        {avatarIcon || <DefaultPersonIcon size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} />}
      </StyledAvatar>
    );
  };

  // Render meta row with timestamp and author
  const renderMetaRow = () => {
    if (!timestamp && !author) return null;

    return (
      <StyledMetaRow>
        {timestamp && (
          <StyledTimestampContainer>
            {showTimestampIcon && (
              <StyledTimestampIcon $size={size}>
                <ScheduleIcon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
              </StyledTimestampIcon>
            )}
            <StyledMetaText $size={size}>{timestamp}</StyledMetaText>
          </StyledTimestampContainer>
        )}
        {author && (
          <StyledMetaText $size={size}>{author}</StyledMetaText>
        )}
      </StyledMetaRow>
    );
  };

  return (
    <StyledContainer
      className={className}
      $variant={variant}
      $size={size}
      $disabled={disabled}
      $clickable={isClickable}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : 'article'}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={generatedAriaLabel}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {/* Avatar */}
      {renderAvatar()}
      
      {/* Content container */}
      <StyledContentContainer>
        {/* Title */}
        <StyledTitle $size={size}>
          {title}
        </StyledTitle>
        
        {/* Subtitle */}
        {subtitle && (
          <StyledMetaText $size={size}>
            {subtitle}
          </StyledMetaText>
        )}
        
        {/* Meta row with timestamp and author */}
        {renderMetaRow()}
      </StyledContentContainer>
      
      {/* Footer slot for additional content */}
      {footerSlot && (
        <FooterContainer>
          {footerSlot}
        </FooterContainer>
      )}
    </StyledContainer>
  );
};
