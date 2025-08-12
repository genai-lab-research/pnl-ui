/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { InfoDisplayCardProps } from './types';
import { StatusPill } from './components';
import { useCardClasses } from './hooks';
import { announceToScreenReader, createSafeId, formatFieldValue } from './utils';
import {
  cardStyles,
  headerStyles,
  contentAreaStyles,
  fieldsGridStyles,
  fieldColumnStyles,
  fieldLabelStyles,
  fieldValueStyles,
  descriptionSectionStyles,
  descriptionTitleStyles,
  descriptionTextStyles,
  iconStyles,
  loadingStyles,
  errorStyles,
} from './styles';

/**
 * InfoDisplayCard - A reusable card component for displaying structured information
 * 
 * Features:
 * - Fully responsive design that adapts to different screen sizes
 * - Support for multiple visual variants (default, compact, outlined, elevated)
 * - Customizable sizes (sm, md, lg)
 * - Loading and error states
 * - Status pill for displaying current state
 * - Flexible field structure with icon support
 * - Description section for additional notes
 * - Accessibility support with proper ARIA labels
 * - Interactive support with keyboard navigation
 */
const InfoDisplayCard: React.FC<InfoDisplayCardProps> = ({
  title,
  fields,
  status,
  description,
  descriptionTitle = 'Notes',
  variant = 'default',
  size = 'md',
  loading = false,
  error,
  footerSlot,
  ariaLabel,
  className = '',
  onClick,
}) => {
  const cardClasses = useCardClasses({ variant, size, onClick, className });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  // Enhanced accessibility: announce loading state changes
  const [previousLoading, setPreviousLoading] = React.useState(loading);
  React.useEffect(() => {
    if (previousLoading !== loading && loading) {
      announceToScreenReader(`Loading ${title} information`);
    }
    setPreviousLoading(loading);
  }, [loading, previousLoading, title]);

  // Generate safe IDs for accessibility
  const cardId = React.useMemo(() => createSafeId(title), [title]);
  const descriptionId = React.useMemo(() => `${cardId}-description`, [cardId]);

  // Error state
  if (error) {
    return (
      <div css={[cardStyles, errorStyles]} className={className}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div
        css={[cardStyles, loadingStyles]}
        className={cardClasses}
        role="status"
        aria-label={`Loading ${title} information`}
        aria-busy="true"
      >
        <div className="skeleton skeleton-header" />
        <div css={contentAreaStyles}>
          <div css={fieldsGridStyles}>
            <div css={[fieldColumnStyles]} className="labels-column">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton skeleton-field" />
              ))}
            </div>
            <div css={[fieldColumnStyles]} className="values-column">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="skeleton skeleton-value" />
              ))}
            </div>
          </div>
          <div className="skeleton skeleton-description" />
        </div>
      </div>
    );
  }

  return (
    <div
      css={cardStyles}
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${title} information card${onClick ? ' - clickable' : ''}`}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Card Header */}
      <h2 css={headerStyles}>
        {title}
      </h2>
      
      {/* Content Area */}
      <div css={contentAreaStyles}>
        {/* Fields Grid */}
        <div css={fieldsGridStyles}>
          {/* Labels Column */}
          <div css={[fieldColumnStyles]} className="labels-column">
            {fields.map((field, index) => (
              <div key={`label-${index}`} css={fieldLabelStyles}>
                {field.label}
              </div>
            ))}
          </div>
          
          {/* Values Column */}
          <div css={[fieldColumnStyles]} className="values-column">
            {fields.map((field, index) => {
              const isStatusField = field.label.toLowerCase().includes('status');
              const fieldId = `${cardId}-field-${index}`;
              const formattedValue = formatFieldValue(field.value);
              
              return (
                <div 
                  key={`value-${index}`} 
                  css={fieldValueStyles}
                  id={fieldId}
                  role={isStatusField ? 'status' : undefined}
                  aria-label={isStatusField ? `Status: ${status?.label || 'No status'}` : `${field.label}: ${formattedValue}`}
                >
                  {field.icon && (
                    <div css={iconStyles} aria-hidden="true">
                      {field.icon}
                    </div>
                  )}
                  {isStatusField && status ? (
                    <StatusPill 
                      label={status.label} 
                      variant={status.variant}
                      size={size}
                    />
                  ) : (
                    <span>{typeof field.value === 'string' ? field.value : formattedValue}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Section */}
        {description && (
          <div css={descriptionSectionStyles}>
            <h3 css={descriptionTitleStyles}>
              {descriptionTitle}
            </h3>
            <p 
              css={descriptionTextStyles}
              id={descriptionId}
            >
              {description}
            </p>
          </div>
        )}
      </div>
      
      {/* Footer Slot */}
      {footerSlot && (
        <div>
          {footerSlot}
        </div>
      )}
    </div>
  );
};

export default InfoDisplayCard;